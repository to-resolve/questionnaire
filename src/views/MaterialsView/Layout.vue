<template>
  <div class="layout-container flex">
    <div class="left flex wrap space-between">
      <slot />
    </div>
    <div class="center">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :status="store.coms[store.currentMaterialCom].status"
          :serialNum="1"
        />
      </router-view>
    </div>
    <div class="right">
      <EditPannel :com="currentCom" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PicLink, MaterialStore } from '@/types'
import { isPicLink, isOptionsStatus, isTypeStatus } from '@/types'
import EditPannel from '@/components/SurveyComs/Editltems/EditPannel.vue'
import { computed, provide } from 'vue'
import { useMaterialStore } from '@/stores/useMaterial'
import { ElMessage } from 'element-plus'
import { changeEditorIsShowStatus } from '@/utils'
const store = useMaterialStore() as unknown as MaterialStore
const currentCom = computed(() => store.coms[store.currentMaterialCom])

const updateStatus = (configKey: string, payload?: number | string | boolean | object) => {
  switch (configKey) {
    case 'type':
      {
        if (typeof payload === 'number' && isTypeStatus(currentCom.value.status)) {
          console.log(111)
          changeEditorIsShowStatus(currentCom.value.status, payload)
          store.setSize(currentCom.value.status[configKey], payload)
        }
      }
      break
    case 'title':
    case 'desc':
      {
        if (typeof payload !== 'string') {
          console.error('Invalid payload type for "title or desc". Expected a string.')
          return
        }
        store.setTextStatus(currentCom.value.status[configKey], payload as string)
      }
      break
    case 'options':
      {
        if (isOptionsStatus(currentCom.value.status))
          if (typeof payload === 'number') {
            // 删除选项
            const result = store.removeOption(currentCom.value.status[configKey], payload)
            if (result) ElMessage.success('选项删除成功')
            else ElMessage.error('至少保留两个选项')
          } else if (typeof payload === 'object' && isPicLink(payload)) {
            store.setPicLinkByIndex(currentCom.value.status[configKey], payload)
          } else {
            // 添加选项
            store.addOption(currentCom.value.status[configKey])
          }
      }
      break
    case 'position':
      {
        if (typeof payload !== 'number') {
          console.error('Invalid payload type for "position". Expected a number.')
          return
        }
        store.setPosition(currentCom.value.status[configKey], payload as number)
      }
      break
    case 'titleSize':
    case 'descSize':
      {
        if (typeof payload !== 'number') {
          console.error(`Invalid payload type for "${configKey}". Expected a number.`)
          return
        }
        store.setSize(currentCom.value.status[configKey], payload as number)
      }
      break
    case 'titleWeight':
    case 'descWeight':
      {
        if (typeof payload !== 'number') {
          console.error(`Invalid payload type for "${configKey}". Expected a number.`)
          return
        }
        store.setWeight(currentCom.value.status[configKey], payload as number)
      }
      break
    case 'titleItalic':
    case 'descItalic':
      {
        if (typeof payload !== 'number') {
          console.error(`Invalid payload type for "${configKey}". Expected a number.`)
          return
        }
        store.setItalic(currentCom.value.status[configKey], payload as number)
      }
      break
    case 'titleColor':
    case 'descColor':
      {
        if (typeof payload !== 'string') {
          console.error(`Invalid payload type for "${configKey}". Expected a string.`)
          return
        }
        store.setColor(currentCom.value.status[configKey], payload as string)
      }
      break
  }
}

const getLink = (link: PicLink) => {
  updateStatus('options', link)
}
provide('getLink', getLink)
provide('updateStatus', updateStatus)
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: calc(100vh - 100px - 40px - 20px);
  align-items: flex-start;
  border: 1px solid var(--border-color);
  border-top-right-radius: var(--border-radius-lg);
  border-bottom-right-radius: var(--border-radius-lg);
  border-bottom-left-radius: var(--border-radius-lg);
  .left {
    width: 180px;
    text-align: center;
    align-items: flex-start;
    padding: 20px;
  }
  .center {
    width: 550px;
    height: calc(100vh - 100px - 60px - 40px - 20px);
    overflow-y: scroll;
    padding: 30px;
    border-left: 1px solid var(--border-color);
  }
  .right {
    width: 400px;
    height: calc(100vh - 100px - 40px - 20px);
    overflow-y: scroll;
    border-left: 1px solid var(--border-color);
  }
}
</style>
