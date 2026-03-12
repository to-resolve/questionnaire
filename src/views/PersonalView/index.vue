<template>
  <div class="personal-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">个人中心</h2>
          <p class="page-subtitle">管理您的账户信息和个人设置</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="24">
        <!-- 左侧用户信息面板 -->
        <el-col :span="8">
          <div class="user-profile-card">
            <div class="profile-header">
              <div class="avatar-wrapper">
                <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar" />
              </div>
              <div class="user-basic-info">
                <h3 class="user-nickname">{{ userInfo.nickname }}</h3>
                <p class="user-username">@{{ userInfo.username }}</p>
                <el-tag
                  :type="userInfo.status === 1 ? 'success' : 'danger'"
                  size="small"
                  class="status-tag"
                >
                  {{ userInfo.status === 1 ? '账户正常' : '账户异常' }}
                </el-tag>
              </div>
            </div>

            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-number">{{ userInfoStats.surveysCreated }}</div>
                <div class="stat-label">创建问卷</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ userInfoStats.templatesUsed }}</div>
                <div class="stat-label">使用模板</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ userInfoStats.joinDays }}</div>
                <div class="stat-label">加入天数</div>
              </div>
            </div>

            <div class="profile-actions">
              <el-button type="primary" plain @click="editUserInfo" class="action-btn" block>
                <el-icon><Edit /></el-icon>
                编辑个人资料
              </el-button>
              <el-button
                type="warning"
                plain
                @click="showChangePassword = true"
                class="action-btn"
                block
              >
                <el-icon><Key /></el-icon>
                修改登录密码
              </el-button>
            </div>
          </div>
        </el-col>

        <!-- 右侧信息详情 -->
        <el-col :span="16">
          <el-tabs v-model="activeTab" class="info-tabs">
            <!-- 基本信息 -->
            <el-tab-pane label="账户信息" name="basic">
              <div class="tab-content">
                <el-card shadow="hover" class="info-card">
                  <template #header>
                    <div class="card-header">
                      <el-icon class="header-icon"><User /></el-icon>
                      <span>基本信息</span>
                    </div>
                  </template>

                  <div class="info-grid">
                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><User /></el-icon>
                        用户名
                      </div>
                      <div class="info-value">{{ userInfo.username }}</div>
                    </div>

                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><Edit /></el-icon>
                        昵称
                      </div>
                      <div class="info-value">{{ userInfo.nickname }}</div>
                    </div>

                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><Message /></el-icon>
                        邮箱地址
                      </div>
                      <div class="info-value">{{ userInfo.email || '无' }}</div>
                    </div>

                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><Iphone /></el-icon>
                        手机号
                      </div>
                      <div class="info-value">{{ userInfo.phone || '无' }}</div>
                    </div>

                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><Calendar /></el-icon>
                        注册时间
                      </div>
                      <div class="info-value">{{ formatTime(userInfo.createTime) }}</div>
                    </div>

                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><Clock /></el-icon>
                        最后更新
                      </div>
                      <div class="info-value">{{ formatTime(userInfo.updateTime) }}</div>
                    </div>

                    <div class="info-row">
                      <div class="info-label">
                        <el-icon><Connection /></el-icon>
                        账户状态
                      </div>
                      <div class="info-value">
                        <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
                          {{ userInfo.status === 1 ? '正常使用' : '账户异常,请联系管理员' }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>

            <!-- 安全设置 -->
            <el-tab-pane label="安全设置" name="security">
              <div class="tab-content">
                <el-card shadow="hover" class="info-card">
                  <template #header>
                    <div class="card-header">
                      <el-icon class="header-icon"><Lock /></el-icon>
                      <span>账户安全</span>
                    </div>
                  </template>

                  <div class="security-settings">
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4>
                          <el-icon><Key /></el-icon>
                          登录密码
                        </h4>
                        <p>定期更改密码可以提高账户安全性</p>
                        <span class="last-update"
                          >上次修改：{{ formatTime(userInfo.updateTime) }}</span
                        >
                      </div>
                      <el-button type="primary" @click="showChangePassword = true">
                        修改密码
                      </el-button>
                    </div>

                    <div class="setting-item">
                      <div class="setting-info">
                        <h4>
                          <el-icon><Message /></el-icon>
                          邮箱
                        </h4>
                        <p>邮箱{{ userInfo.email ? '已添加' : '未添加' }}</p>
                        <span class="bind-status">邮箱地址：{{ userInfo.email || '无' }}</span>
                      </div>
                      <el-button @click="editUserInfo">{{
                        userInfo.email ? '更换邮箱' : '添加邮箱'
                      }}</el-button>
                    </div>

                    <div class="setting-item">
                      <div class="setting-info">
                        <h4>
                          <el-icon><Iphone /></el-icon>
                          手机
                        </h4>
                        <p>用于接收重要通知和验证码</p>
                        <span class="bind-status">手机号：{{ userInfo.phone || '无' }}</span>
                      </div>
                      <el-button @click="editUserInfo">{{
                        userInfo.phone ? '更换手机' : '添加手机'
                      }}</el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="showEditProfile"
      title="编辑个人资料"
      width="500px"
      class="custom-dialog"
      @close="cancelEditProfile"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="80px"
        class="edit-form"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
          >
            <!-- 头像显示区域 -->
            <el-avatar :size="60" :src="editForm.avatar">
              <el-icon><User /></el-icon>
              <!-- 头像默认占位符 -->
            </el-avatar>
            <!-- 上传提示文字 -->
            <div style="margin-left: 15px; color: #409eff">更换头像</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled />
          <span class="form-tip">用户名不可修改</span>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="editForm.nickname"
            placeholder="请输入昵称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelEditProfile">取消</el-button>
          <el-button type="primary" @click="submitEditProfile" :loading="savingProfile">
            {{ savingProfile ? '保存中...' : '提交修改' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePassword"
      title="修改登录密码"
      width="500px"
      class="custom-dialog"
      @close="cancelChangePassword"
    >
      <el-alert
        title="安全提示"
        type="warning"
        description="建议使用包含字母、数字和特殊字符的组合密码，长度不少于8位"
        show-icon
        class="password-tip"
      />

      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新的密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelChangePassword">取消</el-button>
          <el-button type="primary" @click="submitChangePassword" :loading="changingPassword">
            {{ changingPassword ? '修改中...' : '确认修改' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Edit,
  Key,
  Lock,
  Refresh,
  Message,
  Calendar,
  Clock,
  Connection,
  Iphone,
  Upload,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getUserInfoByUserId, updateUserInfoByUserId } from '@/api/user'
import { parseToken, getToken, removeToken } from '@/utils/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前激活的标签页
const activeTab = ref('basic')

// 加载状态
const savingProfile = ref(false)
const changingPassword = ref(false)

// 用户信息
const userInfo = ref({
  id: '',
  username: '',
  password: '',
  nickname: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  email: '',
  status: 1,
  phone: '',
  createTime: '',
  updateTime: '',
})

// 获取用户信息
const getUserInfo = async () => {
  const response = await getUserInfoByUserId(parseToken())
  if (response && response.code === 200) {
    userInfo.value = response.data
  }
}

// 用户统计数据
const userInfoStats = ref({
  surveysCreated: 25,
  responsesCollected: 1250,
  templatesUsed: 8,
  joinDays: 380,
})

// 编辑资料表单
const showEditProfile = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  username: '',
  nickname: '',
  email: '',
  avatar: '',
  phone: '',
})

// 编辑资料表单验证规则
const editRules = reactive<FormRules>({
  nickname: [{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的11位手机号',
      trigger: 'blur',
    },
  ],
})

// 编辑按钮
const editUserInfo = () => {
  editForm.username = userInfo.value.username
  editForm.nickname = userInfo.value.nickname
  editForm.email = userInfo.value.email
  editForm.avatar = userInfo.value.avatar
  editForm.phone = userInfo.value.phone
  showEditProfile.value = true
}

// 修改密码表单
const showChangePassword = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码表单验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userInfo.value.password) {
          callback(new Error('原密码错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于8位', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (passwordForm.oldPassword !== userInfo.value.password) {
          callback()
        } else if (value && value === userInfo.value.password) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 刷新数据
const refreshData = () => {
  window.location.reload()
  ElMessage.success('已刷新')
}

// 格式化时间
const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleString('zh-CN')
}

// 上传头像功能
// 添加请求头
const uploadHeaders = ref({
  Authorization: `Bearer ${getToken()}`,
})
// 上传前校验
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请选择图片格式的文件（jpg/png/gif 等）！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('头像图片大小不能超过 5MB！')
    return false
  }
  return true
}

// 头像上传成功回调
const handleAvatarSuccess = (response: any) => {
  if (response.code === 200) {
    console.log(response)
    editForm.avatar = response.data
    ElMessage.success('头像上传成功！')
  } else {
    ElMessage.error(response.message || '头像上传失败')
  }
}

// 头像上传失败回调
const handleAvatarError = () => {
  ElMessage.error('头像上传失败，请稍后重试！')
}

// 取消修改资料
const cancelEditProfile = () => {
  editFormRef.value?.clearValidate()
  editForm.username = userInfo.value.username
  editForm.nickname = userInfo.value.nickname
  editForm.email = userInfo.value.email
  editForm.avatar = userInfo.value.avatar
  editForm.phone = userInfo.value.phone
  showEditProfile.value = false
}

// 提交编辑资料
const submitEditProfile = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      savingProfile.value = true
      try {
        const params = {
          id: parseToken(),
          ...editForm,
        }
        await updateUserInfoByUserId(params)
        ElMessage.success('资料更新成功')
        showEditProfile.value = false
        // 更新用户信息显示
        getUserInfo()
      } catch (error) {
        ElMessage.error('资料更新失败')
      } finally {
        savingProfile.value = false
      }
    }
  })
}

// 取消修改密码
const cancelChangePassword = () => {
  passwordFormRef.value?.clearValidate()
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showChangePassword.value = false
}

// 提交修改密码
const submitChangePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      changingPassword.value = true
      try {
        const params = {
          id: parseToken(),
          password: passwordForm.newPassword,
        }
        await updateUserInfoByUserId(params)
        ElMessage.success('密码修改成功，请重新登录')

        cancelChangePassword()

        removeToken()
        router.push('/login')
      } catch (error) {
        ElMessage.error('密码修改失败')
      } finally {
        changingPassword.value = false
      }
    }
  })
}

// 初始化表单数据
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped lang="scss">
.personal-center {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 50%, #e9ecef 100%);
  padding: 20px 20px 0 20px;

  .page-header {
    margin-bottom: 24px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 60px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius-lg);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      .header-left {
        .page-title {
          margin: 0 0 5px 0;
          color: var(--font-color);
          font-size: 26px;
          font-weight: 600;
          background: linear-gradient(45deg, var(--primary-color), #667eea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          margin: 0;
          color: var(--font-color-light);
          font-size: var(--font-size-base);
        }
      }
    }
  }

  .main-content {
    .user-profile-card {
      margin-top: 10px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius-lg);
      padding: 30px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);

      .profile-header {
        text-align: center;
        margin-bottom: 30px;

        .avatar-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;

          .user-avatar {
            border: 4px solid var(--white);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        }

        .user-basic-info {
          .user-nickname {
            margin: 0 0 8px 0;
            color: var(--font-color);
            font-size: 22px;
            font-weight: 600;
          }

          .user-username {
            margin: 0 0 12px 0;
            color: var(--font-color-lighter);
            font-size: var(--font-size-base);
          }

          .status-tag {
            font-size: var(--font-size-sm);
          }
        }
      }

      .profile-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30px;
        padding: 20px 0;
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);

        .stat-item {
          text-align: center;

          .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: var(--font-size-sm);
            color: var(--font-color-light);
          }
        }
      }

      .profile-actions {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .action-btn {
          margin-bottom: 12px;
        }
      }
    }
  }

  .info-tabs {
    :deep(.el-tabs__content) {
      padding: 0px 0;
    }

    .tab-content {
      .info-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: var(--border-radius-lg);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

        .card-header {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          color: var(--font-color);

          .header-icon {
            margin-right: 10px;
            color: var(--primary-color);
          }
        }

        .info-grid {
          .info-row {
            display: flex;
            padding: 12.5px 0;
            border-bottom: 1px solid var(--border-color);

            &:last-child {
              border-bottom: none;
            }

            .info-label {
              display: flex;
              align-items: center;
              width: 120px;
              color: var(--font-color-light);
              font-weight: 500;

              .el-icon {
                margin-right: 8px;
                color: var(--primary-color);
              }
            }

            .info-value {
              flex: 1;
              color: var(--font-color);
            }
          }
        }

        .security-settings {
          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 10px;
            border-bottom: 1px solid var(--border-color);

            &:last-child {
              border-bottom: none;
            }

            .setting-info {
              flex: 1;

              h4 {
                display: flex;
                align-items: center;
                margin: 0 0 8px 0;
                color: var(--font-color);
                font-size: 16px;
                font-weight: 500;

                .el-icon {
                  margin-right: 8px;
                  color: var(--primary-color);
                }
              }

              p {
                margin: 0 0 6px 0;
                color: var(--font-color-light);
                font-size: var(--font-size-base);
              }

              .last-update,
              .bind-status {
                font-size: var(--font-size-sm);
                color: var(--font-color-lighter);
              }
            }
          }
        }

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;

          .stat-card {
            display: flex;
            align-items: center;
            padding: 20px;
            background: var(--background-color);
            border-radius: var(--border-radius-md);
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .stat-icon {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              color: var(--white);
              font-size: 20px;

              &.primary {
                background: linear-gradient(45deg, var(--primary-color), #667eea);
              }

              &.success {
                background: linear-gradient(45deg, var(--success-color), #8fd35a);
              }

              &.warning {
                background: linear-gradient(45deg, var(--warning-color), #f0c040);
              }

              &.info {
                background: linear-gradient(45deg, var(--info-color), #a3a6ad);
              }
            }

            .stat-content {
              .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: var(--font-color);
                margin-bottom: 4px;
              }

              .stat-title {
                font-size: var(--font-size-sm);
                color: var(--font-color-light);
              }
            }
          }
        }
      }
    }
  }

  :deep(.custom-dialog) {
    .el-dialog__body {
      padding: 20px 30px;
    }

    .edit-form,
    .password-form {
      .avatar-upload {
        display: flex;
        align-items: center;
        gap: 15px;

        .upload-btn {
          font-size: var(--font-size-sm);
        }
      }

      .form-tip {
        margin-left: 10px;
        color: var(--font-color-lighter);
        font-size: var(--font-size-sm);
      }
    }

    .password-tip {
      margin-bottom: 20px;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .personal-center {
    padding: 10px;

    .page-header .header-content {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }

    .main-content {
      .el-col {
        width: 100%;
        margin-bottom: 20px;
      }

      .info-tabs .tab-content .info-card .statistics-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
