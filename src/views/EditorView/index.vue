<template>
  <div class="editor-view-container">
    <div class="editor-main-content">
      <LeftSide />
      <Center />
      <RightSide />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import { getSurveyListByUserId } from '@/api/questionnaire'
import LeftSide from './LeftSide/Index.vue'
import Center from './Center.vue'
import RightSide from './RightSide.vue'
import { restoreComponentStatus } from '@/utils'
import { parseToken } from '@/utils/auth'
import type { UpdateStatus, TypeStatus, OptionsStatus, GetLink, PicLink, Status } from '@/types'
// 数据仓库更新方法
import { dispatchStatus } from '@/stores/dispatch'

import { useEditorStore } from '@/stores/useEditor'
const store = useEditorStore()

import { useRoute } from 'vue-router'
const route = useRoute()

// 检查是否有导入的问卷数据
const checkImportData = () => {
  const importDataStr = localStorage.getItem('importSurveyData')
  if (importDataStr) {
    try {
      const importData = JSON.parse(importDataStr)
      if (importData.coms && importData.coms.length > 0) {
        const newComs = restoreComponentStatus(importData.coms as Status[])
        // 直接设置 store 的属性
        store.coms = newComs
        store.surveyCount = newComs.filter((com) => {
          const surveyNames = [
            'single-select',
            'multi-select',
            'single-text',
            'multi-text',
            'option-select',
            'rate',
            'upload',
            'time-picker',
            'personal-info-name',
            'personal-info-id',
            'personal-info-tel',
            'personal-info-wechat',
            'personal-info-qq',
            'personal-info-email',
            'personal-info-address',
            'personal-info-gender',
            'personal-info-age',
            'personal-info-education',
            'personal-info-career',
            'personal-info-birth',
            'personal-info-collage',
            'personal-info-major',
            'personal-info-industry',
            'personal-info-company',
            'personal-info-position',
          ]
          return surveyNames.includes(com.name)
        }).length
        store.currentComponentIndex = -1
        localStorage.removeItem('importSurveyData')
        // 保存标题和描述到 localStorage，以便在信息编辑时使用
        if (importData.title || importData.description) {
          localStorage.setItem(
            'importSurveyInfo',
            JSON.stringify({
              title: importData.title || '',
              description: importData.description || '',
            }),
          )
        }
        ElMessage.success('问卷导入成功！请在编辑信息中设置标题和描述')
        return true
      }
    } catch (e) {
      console.error('解析导入数据失败:', e)
    }
  }
  return false
}

// 如果有传递过来 id，就从数据库中获取数据来初始化仓库
const id = computed(() => (route.params.id ? String(route.params.id) : undefined))

onMounted(() => {
  if (id.value) {
    getSurveyListByUserId(parseToken(), Number(id.value)).then((res) => {
      if (res) {
        const newComs = restoreComponentStatus(JSON.parse(res.data[0].coms))
        res.data[0].coms = newComs
        store.setStore(res.data[0])
      }
    })
  } else {
    // 首先检查是否有导入数据
    const hasImported = checkImportData()
    if (!hasImported) {
      // 如果没有 id，且不是从 AI 页面导入的（即 query 中没有 source=ai），则进行初始化
      if (route.query.source !== 'ai') {
        store.initStore()
      }
    }
  }
})

// 向子组件提供修改状态的方法
const updateStatus: UpdateStatus = (
  configKey: string,
  payload?: number | string | boolean | object,
  isShowChange?: boolean,
) => {
  // 如果没有选中组件，不执行
  if (store.currentComponentIndex === -1) {
    ElMessage({
      message: '请先将组件处于编辑状态',
      type: 'warning',
    })
    return
  }
  const status = store.coms[store.currentComponentIndex].status as unknown as
    | TypeStatus
    | OptionsStatus
  dispatchStatus(store, status, configKey, payload, isShowChange)
}
provide('updateStatus', updateStatus)

const getPicLink: GetLink = (link: PicLink) => {
  // 拿到上传的链接地址，从而更新状态仓库
  updateStatus('options', link)
}
provide('getPicLink', getPicLink)
</script>

<style scoped lang="scss">
.editor-view-container {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/editor_background.png');
  background-attachment: fixed;
  background-size: cover;
  overflow-y: auto;
}

.editor-main-content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  min-height: 100%;
  box-sizing: border-box;
  gap: 20px;
  position: relative;
}
</style>
