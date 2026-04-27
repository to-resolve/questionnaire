<template>
  <div class="header-container">
    <div class="container flex self-start align-items-center border-box">
      <!-- 左侧区域 - 面包屑导航 -->
      <div class="left flex align-items-center pl-15 pr-15">
        <div class="breadcrumb-wrapper">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
              <el-icon v-if="item.icon" class="breadcrumb-icon">
                <component :is="item.icon" />
              </el-icon>
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <!-- 中间区域 - 功能按钮 -->
      <div class="center flex align-items-center justify-content-center">
        <transition name="fade" mode="out-in">
          <!-- 编辑页操作 -->
          <div v-if="isEditor" class="editor-actions">
            <el-button type="info" size="small" @click="goBack" class="action-btn back-btn">
              <el-icon class="btn-icon"><Back /></el-icon>
              返回
            </el-button>
            <el-button
              type="default"
              size="small"
              @click="handleUndo"
              :disabled="!canUndo"
              class="action-btn undo-btn"
            >
              <el-icon class="btn-icon"><ArrowLeft /></el-icon>
              撤销
            </el-button>
            <el-button
              type="default"
              size="small"
              @click="handleRedo"
              :disabled="!canRedo"
              class="action-btn redo-btn"
            >
              <el-icon class="btn-icon"><ArrowRight /></el-icon>
              重做
            </el-button>
            <div v-if="id" class="actions-group">
              <el-button
                type="warning"
                size="small"
                @click="updateSurvey"
                class="action-btn update-btn"
              >
                <el-icon class="btn-icon"><Refresh /></el-icon>
                更新问卷
              </el-button>
            </div>
            <div v-else class="actions-group">
              <el-button
                type="danger"
                size="small"
                @click="resetSurvey"
                class="action-btn reset-btn"
              >
                <el-icon class="btn-icon"><Delete /></el-icon>
                重置问卷
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="saveSurvey"
                class="action-btn save-btn"
              >
                <el-icon class="btn-icon"><FolderAdd /></el-icon>
                保存问卷
              </el-button>
            </div>
            <el-button
              type="primary"
              size="small"
              @click="previewSurvey"
              class="action-btn preview-btn"
            >
              <el-icon class="btn-icon"><View /></el-icon>
              预览问卷
            </el-button>
          </div>

          <!-- 预览页操作 -->
          <div v-else-if="isPreview" class="preview-actions">
            <el-button type="info" size="small" @click="goBack" class="action-btn">
              返回
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="handlePreviewAction('genQuiz')"
              class="action-btn"
            >
              <el-icon class="btn-icon"><Share /></el-icon>
              生成在线问卷
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handlePreviewAction('genPDF')"
              class="action-btn"
            >
              <el-icon class="btn-icon"><Printer /></el-icon>
              生成本地PDF
            </el-button>
          </div>

          <!-- AI 智能模式标识 -->
          <div v-else-if="isAIView" class="ai-actions">
            <el-tag type="success" effect="dark" class="ai-status-tag">
              <el-icon><MagicStick /></el-icon>
              AI 智能模式
            </el-tag>
          </div>
        </transition>
      </div>

      <!-- 右侧区域 - 用户信息和操作 -->
      <div class="right flex justify-content-center align-items-center">
        <div class="user-actions">
          <el-dropdown @command="handleCommand" placement="bottom-end">
            <div class="user-profile">
              <div class="avatar-wrapper">
                <el-avatar :size="32" :src="avatar" class="user-avatar" />
                <div class="online-status"></div>
              </div>
              <div class="user-info">
                <span class="username">{{ userInfo.username }}</span>
                <span class="user-role">{{ userInfo.nickname }}</span>
              </div>
              <el-icon class="dropdown-icon">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <el-dropdown-item command="profile" class="dropdown-item">
                  <div class="menu-item-content">
                    <el-icon class="menu-icon"><User /></el-icon>
                    <span>个人中心</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="settings" class="dropdown-item">
                  <div class="menu-item-content">
                    <el-icon class="menu-icon"><Setting /></el-icon>
                    <span>系统设置</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout" class="dropdown-item logout-item">
                  <div class="menu-item-content">
                    <el-icon class="menu-icon"><SwitchButton /></el-icon>
                    <span>退出登录</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <SurveyInfoDialog
      ref="surveyDialogRef"
      :store="store"
      :is-preview="isSaveMode"
      v-model:visible="dialogVisible"
      @success="handleSaveSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Setting,
  SwitchButton,
  ArrowDown,
  Back,
  Refresh,
  Delete,
  FolderAdd,
  View,
  House,
  Grid,
  Document,
  UserFilled,
  MagicStick,
  Printer,
  Share,
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import emitter from '@/utils/eventBus'
import { update } from '@/utils/dboperate'
import type { EditorStore } from '@/types'
import SurveyInfoDialog from './SurveyInfoDialog.vue'
import { useEditorStore } from '@/stores/useEditor'
import { getUserInfoByUserId } from '@/api/user'
import { parseToken } from '@/utils/auth'

const store = useEditorStore() as EditorStore

const surveyDialogRef = ref()
const isSaveMode = ref(0) // 0：默认，1：预览，2：保存
const dialogVisible = ref(false)

const props = defineProps({
  isEditor: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})

// 用户信息
const userInfo = ref({
  username: '',
  nickname: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
})

// 页面状态判断
const isAIView = computed(() => route.path.startsWith('/aiSurvey'))
const isPreview = computed(() => route.path.startsWith('/preview'))

// 面包屑数据 - 自动根据路由生成
const breadcrumbItems = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title)
  return matched.map((item) => {
    let icon = null
    if (item.path === '/home' || item.path === '/') icon = House
    else if (item.path.startsWith('/materials')) icon = Grid
    else if (item.path.startsWith('/editor')) icon = Document
    else if (item.path.startsWith('/preview')) icon = View
    else if (item.path.startsWith('/personal')) icon = UserFilled
    else if (item.path.startsWith('/aiSurvey')) icon = MagicStick

    return {
      title: item.meta.title as string,
      path: item.path,
      icon,
    }
  })
})

// 获取用户信息
const getUserInfo = async () => {
  try {
    const response = await getUserInfoByUserId(parseToken())
    if (response && response.code === 200) {
      userInfo.value.username = response.data.username
      userInfo.value.avatar = response.data.avatar
      userInfo.value.nickname = response.data.nickname || '用户'
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const avatar = computed(() => userInfo.value.avatar)

// 撤销/重做逻辑
const canUndo = computed(() => store.undoStack.length > 0)
const canRedo = computed(() => store.redoStack.length > 0)

function handleUndo() {
  if (canUndo.value) {
    store.undo()
  }
}

function handleRedo() {
  if (canRedo.value) {
    store.redo()
  }
}

// 键盘快捷键处理
function handleKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' || e.key === 'Z') {
      if (e.shiftKey) {
        handleRedo()
      } else {
        handleUndo()
      }
      e.preventDefault()
    } else if (e.key === 'y' || e.key === 'Y') {
      handleRedo()
      e.preventDefault()
    }
  }
}

// 重置问卷
function resetSurvey() {
  ElMessageBox.confirm('是否确定重置问卷？已有题目将全部删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
  })
    .then(() => {
      store.resetComs()
      ElMessage({
        type: 'success',
        message: '问卷已重置',
        duration: 2000,
      })
    })
    .catch(() => {
      console.log('取消重置')
    })
}

// 预览问卷
function previewSurvey() {
  ElMessageBox.confirm('预览会保存问卷，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
  })
    .then(() => {
      if (props.id) {
        // 更新现有问卷
        update(store, Number(props.id)).then(() => {
          router.push({
            path: `/preview/${props.id}`,
            state: { from: 'editor' },
          })
        })
      } else {
        // 新建问卷
        saveSurvey(1)
      }
    })
    .catch(() => {
      console.log('取消预览')
    })
}

// 保存问卷
function saveSurvey(mode: any = 2) {
  isSaveMode.value = typeof mode === 'number' ? mode : 2
  surveyDialogRef.value?.initFormData()
  dialogVisible.value = true
}

// 更新问卷
function updateSurvey() {
  update(store, Number(props.id)).then(() => {
    ElMessage.success('问卷更新成功')
  })
}

// 返回操作
function goBack() {
  const fromPath = history.state?.from
  const source = route.query.source

  if (fromPath === 'home') {
    router.push('/home')
  } else if (source === 'ai') {
    router.push('/aiSurvey')
  } else if (isPreview.value && props.id) {
    router.push(`/editor/${props.id}/survey-type`)
  } else {
    router.back()
  }
}

// 转发预览页操作到页面组件
function handlePreviewAction(action: string) {
  emitter.emit('preview-action', action as any)
}

// 下拉菜单处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/personal')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        localStorage.removeItem('token')
        router.push('/login')
        ElMessage.success('退出登录成功')
      })
      break
  }
}

// 保存成功回调
const handleSaveSuccess = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getUserInfo()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped lang="scss">
.header-container {
  height: 60px;
  background: linear-gradient(135deg, var(--white) 0%, #fafbff 100%);
  box-shadow: 0 2px 12px rgba(0, 21, 41, 0.08);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(235, 238, 245, 0.6);

  .container {
    width: 100%;
    height: 60px;
    max-width: 100%;

    .left {
      min-width: 200px;
      height: 100%;
      padding: 0 20px;
      border-right: 1px solid var(--border-color);

      .breadcrumb-wrapper {
        display: flex;
        align-items: center;

        :deep(.el-breadcrumb) {
          font-size: 14px;
          white-space: nowrap;

          .el-breadcrumb__item {
            display: flex;
            align-items: center;

            .el-breadcrumb__inner {
              display: flex;
              align-items: center;
              color: var(--font-color-light);
              font-weight: 500;
              transition: all 0.3s;

              &:hover {
                color: var(--primary-color);
              }
            }

            .breadcrumb-icon {
              margin-right: 6px;
              font-size: 16px;
            }
          }

          .el-breadcrumb__separator {
            margin: 0 8px;
            color: var(--font-color-lighter);
          }
        }
      }
    }

    .center {
      flex: 1;
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      .ai-status-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 16px;
        height: 32px;
        border-radius: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);

        .el-icon {
          font-size: 16px;
        }
      }

      .editor-actions,
      .preview-actions {
        display: flex;
        align-items: center;
        gap: 12px;

        .actions-group {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 6px;
          font-weight: 500;
          padding: 8px 16px;

          .btn-icon {
            margin-right: 6px;
            font-size: 14px;
          }

          &.update-btn:hover {
            background-color: var(--warning-color);
            border-color: var(--warning-color);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
          }

          &.reset-btn:hover {
            background-color: var(--error-color);
            border-color: var(--error-color);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
          }

          &.save-btn:hover {
            background-color: var(--success-color);
            border-color: var(--success-color);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
          }

          &.preview-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
          }

          &.back-btn:hover {
            background-color: var(--info-color);
            border-color: var(--info-color);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(144, 147, 153, 0.3);
          }
        }
      }
    }

    .right {
      width: 280px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
      padding-right: 20px;

      .user-actions {
        .user-profile {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.7);

          &:hover {
            background: rgba(64, 158, 255, 0.1);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

            .dropdown-icon {
              transform: rotate(180deg);
            }
          }

          .avatar-wrapper {
            position: relative;
            margin-right: 12px;

            .user-avatar {
              border: 2px solid var(--border-color);
              transition: all 0.3s;
            }

            .online-status {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 10px;
              height: 10px;
              background: var(--success-color);
              border: 2px solid var(--white);
              border-radius: 50%;
              animation: pulse 1.5s infinite;
            }
          }

          .user-info {
            display: flex;
            flex-direction: column;
            margin-right: 8px;

            .username {
              font-size: 14px;
              font-weight: 600;
              color: var(--font-color);
              line-height: 1.2;
            }

            .user-role {
              font-size: 12px;
              color: var(--font-color-lighter);
              line-height: 1.2;
            }
          }

          .dropdown-icon {
            font-size: 16px;
            color: var(--font-color-light);
            transition: transform 0.3s ease;
          }
        }
      }

      .quick-actions {
        display: flex;
        gap: 8px;

        .quick-action-btn {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.7);

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
          }

          .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;

            :deep(.el-badge__content) {
              background: var(--error-color);
              border: 2px solid var(--white);
            }
          }
        }
      }
    }
  }
}

// 下拉菜单样式
.user-dropdown-menu {
  min-width: 180px;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  .dropdown-item {
    padding: 12px 20px;
    transition: all 0.2s;

    &:not(.logout-item):hover {
      background: rgba(64, 158, 255, 0.1);
      color: var(--primary-color);
    }

    &.logout-item:hover {
      background: rgba(245, 108, 108, 0.1);
      color: var(--error-color);
    }

    .menu-item-content {
      display: flex;
      align-items: center;

      .menu-icon {
        margin-right: 10px;
        font-size: 16px;
      }
    }
  }
}

// 动画效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 打印样式 */
@media print {
  .header-container {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    left: -9999px !important;
    top: -9999px !important;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .header-container {
    .container {
      .left {
        min-width: auto;
        padding: 0 10px;
        .breadcrumb-wrapper {
          :deep(.el-breadcrumb) {
            .el-breadcrumb__item:not(:last-child) {
              display: none;
            }
          }
        }
      }
      .center {
        .editor-actions {
          gap: 6px;
          .action-btn {
            padding: 6px 10px;
            font-size: 12px;

            .btn-icon {
              margin-right: 4px;
              font-size: 12px;
            }
          }
        }
      }

      .right {
        width: 200px;
        padding-right: 10px;

        .user-info {
          display: none;
        }

        .quick-actions {
          .quick-action-btn {
            width: 32px;
            height: 32px;
          }
        }
      }
    }
  }
}
</style>
