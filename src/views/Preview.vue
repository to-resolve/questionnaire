<template>
  <div ref="preview-container" class="preview-container pb-40 pt-20">
    <div class="center mc">
      <div class="content-group no-border">
        <div class="info-bar flex justify-content-between mb-10 no-print">
          <el-text class="mx-1">题目数量：{{ store.surveyCount }}</el-text>
        </div>
        <div class="content mb-10" v-for="(com, index) in store.coms" :key="index">
          <component :is="com.type" :status="com.status" :serialNum="serialNum[index]" />
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="信息" width="500">
    分享链接: <a :href="quizLink" target="_blank">{{ quizLink }}</a>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="copyLink">复制链接</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
// 路由
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
// 图标
import { ArrowLeft } from '@element-plus/icons-vue'
// 仓库
import { useEditorStore } from '@/stores/useEditor'
const store = useEditorStore()
// db
import { getSurveyListByUserId, updateSurvey } from '@/api/questionnaire'
// 工具
import { restoreComponentStatus } from '@/utils'
import { parseToken } from '@/utils/auth'
// 引入 ElementPlus 库
import { ElMessage } from 'element-plus'
import { isUseForPDF } from '@/types'
import emitter from '@/utils/eventBus'

// 获取路由参数
const id = Number(route.params.id)
const autoPrint = route.query.autoPrint === 'true'

if (id) {
  getSurveyListByUserId(parseToken(), id).then((res) => {
    if (res) {
      const newComs = restoreComponentStatus(JSON.parse(res.data[0].coms))
      res.data[0].coms = newComs
      store.setStore(res.data[0])

      // 如果是自动打印模式，等待页面加载后触发
      if (autoPrint) {
        setTimeout(() => {
          genPDF()
        }, 1000)
      }
    }
  })
}

const scrollToTop = function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  scrollToTop()
  emitter.on('preview-action', handleHeaderAction)
})

onBeforeUnmount(() => {
  emitter.off('preview-action', handleHeaderAction)
})

// 处理来自 Header 的动作
function handleHeaderAction(action: 'genQuiz' | 'genPDF') {
  if (action === 'genQuiz') {
    genQuiz()
  } else if (action === 'genPDF') {
    genPDF()
  }
}

// 组合式函数
import { useSurveyNo } from '@/utils/hooks'
// 获取题目编号
const serialNum = computed(() => useSurveyNo(store.coms).value)

// 生成PDF
function genPDF() {
  const checkResult = store.coms.every((item) => isUseForPDF(item.name))
  if (!checkResult) {
    ElMessage({
      message: '存在不支持PDF导出的组件，请先移除这些组件',
      type: 'warning',
    })
    return
  }

  // 动态添加隐藏Vue DevTools的样式
  const style = document.createElement('style')
  style.textContent = `
    @media print {
      /* 隐藏所有固定定位的元素 */
      [style*="position: fixed"],
      [style*="position:fixed"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        max-height: 0 !important;
        max-width: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }

      /* Vue DevTools特定隐藏 */
      #__vue-devtools-container__,
      #__vue-devtools-iframe__,
      [id*="vue-devtools"],
      [class*="vue-devtools"],
      .vue-devtools {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        max-height: 0 !important;
        max-width: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }

      /* 隐藏所有可能的浮动元素 */
      [style*="z-index: 9999"],
      [style*="z-index:9999"],
      [style*="z-index: 9998"],
      [style*="z-index:9998"] {
        display: none !important;
      }
    }
  `
  document.head.appendChild(style)

  window.print()

  // 打印后移除临时样式
  setTimeout(() => {
    document.head.removeChild(style)
  }, 100)
}

const dialogVisible = ref(false) // 控制弹窗
const quizLink = ref('') // 问卷链接
// 生成在线问卷
async function genQuiz() {
  try {
    if (!store.id || !store.userId) {
      ElMessage.error('问卷信息不完整，无法发布')
      return
    }

    // 检查问卷是否已发布
    if (store.status !== 1) {
      ElMessage.warning('该功能需要先将问卷发布')
      return
    }

    // 已发布的问卷直接显示在线答题链接
    quizLink.value = `${window.location.origin}/quiz/${store.id}`
    dialogVisible.value = true
  } catch (error) {
    console.error('生成问卷链接失败:', error)
    ElMessage.error('生成问卷链接失败，请重试')
  }
}

function copyLink() {
  dialogVisible.value = false
  navigator.clipboard.writeText(quizLink.value)
  ElMessage({
    message: '链接已复制',
    type: 'success',
  })
}
</script>

<style scoped lang="scss">
.preview-container {
  width: 100%;
  min-height: 100vh;
  background: url('@/assets/imgs/editor_background.png');
}
.center {
  width: 800px;
}
.content-group {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--white);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>

<style>
@media print {
  /* 最彻底的隐藏方式 */
  .el-aside,
  .el-header,
  .aside,
  .header,
  .no-print,
  .el-menu,
  .logo,
  .user-info,
  .collapse-btn,
  .el-menu-item,
  .el-sub-menu {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    max-height: 0 !important;
    max-width: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    left: -9999px !important;
    top: -9999px !important;
  }

  .no-border {
    border: none !important;
    box-shadow: none !important;
  }

  /* 重置布局容器 */
  .layout,
  .app-container,
  .main-container,
  .main,
  .el-container,
  .el-main {
    position: static !important;
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    height: auto !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
    flex: none !important;
  }

  /* 预览容器 */
  .preview-container {
    background: white !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    display: block !important;
    min-height: auto !important;
  }

  /* 中心容器 */
  .center,
  .mc {
    width: 800px !important;
    max-width: 800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    display: block !important;
    float: none !important;
    position: relative !important;
  }

  /* 内容组 */
  .content-group {
    width: 100% !important;
    padding: 20px !important;
    margin: 0 !important;
  }

  /* 题目内容 */
  .content {
    width: 100% !important;
    page-break-inside: avoid !important;
  }

  /* 页面设置 */
  @page {
    margin: 15mm;
    size: A4 portrait;
  }

  /* 确保html和body正确 */
  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* 确保正确盒模型 */
  * {
    box-sizing: border-box !important;
  }

  /* 确保main容器完全展开 */
  :deep(.el-main) {
    width: 100% !important;
    padding: 0 !important;
  }
}
</style>
