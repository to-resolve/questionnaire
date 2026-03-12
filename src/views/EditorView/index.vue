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
import { computed, provide } from 'vue'
import { ElMessage } from 'element-plus'

import { getSurveyListByUserId } from '@/api/questionnaire'
import Header from '@/components/Common/Header.vue'
import LeftSide from './LeftSide/Index.vue'
import Center from './Center.vue'
import RightSide from './RightSide.vue'
import { restoreComponentStatus } from '@/utils'
import { parseToken } from '@/utils/auth'
import type { UpdateStatus, TypeStatus, OptionsStatus, GetLink, PicLink } from '@/types'
// 数据仓库更新方法
import { dispatchStatus } from '@/stores/dispatch'

import { useEditorStore } from '@/stores/useEditor'
const store = useEditorStore()

import { useRoute } from 'vue-router'
const route = useRoute()

// 如果有传递过来 id，就从数据库中获取数据来初始化仓库
const id = computed(() => (route.params.id ? String(route.params.id) : undefined))

if (id.value) {
  getSurveyListByUserId(parseToken(), Number(id.value)).then((res) => {
    if (res) {
      const newComs = restoreComponentStatus(JSON.parse(res.data[0].coms))
      res.data[0].coms = newComs
      store.setStore(res.data[0])
    }
  })
} else {
  // 如果没有 id，且不是从 AI 页面导入的（即 query 中没有 source=ai），则进行初始化
  if (route.query.source !== 'ai') {
    store.initStore()
  }
}

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
