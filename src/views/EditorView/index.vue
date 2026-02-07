<template>
  <div>
    <div class="header">
      <Header :isEditor="true" :id="id" />
    </div>
    <div class="container">
      <LeftSide />
      <RightSide />
    </div>
    <div>
      <Center />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { OptionsStatus, PicLink, TypeStatus } from '@/types'
import { isPicLink, isOptionsStatus, isTypeStatus } from '@/types'
import { ElMessage } from 'element-plus'
import { computed, provide } from 'vue'
import Header from '@/components/Common/Header.vue'
import LeftSide from './LeftSide/index.vue'
import RightSide from './RightSide.vue'
import Center from './Center.vue'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/stores/useEditor'
import { restoreComponentStatus, changeEditorIsShowStatus } from '@/utils'
const route = useRoute()
const store = useEditorStore()
store.resetComs()

const id = computed(() => (route.params.id ? String(route.params.id) : ''))
if (id.value) {
  store.getSurveyById(Number(id.value)).then((res) => {
    if (res) {
      restoreComponentStatus(res.coms)
      store.setStore(res)
    }
  })
}

const currentCom = computed(() => store.coms[store.currentComponentIndex])
const updateStatus = (configKey: string, payload?: number | string | boolean | PicLink) => {
  const currentComEditorStatus = currentCom.value.status as unknown as OptionsStatus | TypeStatus
  switch (configKey) {
    case 'type':
      {
        if (typeof payload === 'number' && isTypeStatus(currentComEditorStatus)) {
          changeEditorIsShowStatus(currentComEditorStatus, payload)
          store.setSize(currentComEditorStatus[configKey], payload)
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
        store.setTextStatus(currentComEditorStatus[configKey], payload as string)
      }
      break
    case 'options':
      {
        if (isOptionsStatus(currentComEditorStatus))
          if (typeof payload === 'number') {
            // 删除选项
            const result = store.removeOption(currentComEditorStatus[configKey], payload)
            if (result) ElMessage.success('选项删除成功')
            else ElMessage.error('至少保留两个选项')
          } else if (typeof payload === 'object' && isPicLink(payload)) {
            store.setPicLinkByIndex(currentComEditorStatus[configKey], payload)
          } else {
            // 添加选项
            store.addOption(currentComEditorStatus[configKey])
          }
      }
      break
    case 'position':
      {
        if (typeof payload !== 'number') {
          console.error('Invalid payload type for "position". Expected a number.')
          return
        }
        store.setPosition(currentComEditorStatus[configKey], payload as number)
      }
      break
    case 'titleSize':
    case 'descSize':
      {
        if (typeof payload !== 'number') {
          console.error(`Invalid payload type for "${configKey}". Expected a number.`)
          return
        }
        store.setSize(currentComEditorStatus[configKey], payload as number)
      }
      break
    case 'titleWeight':
    case 'descWeight':
      {
        if (typeof payload !== 'number') {
          console.error(`Invalid payload type for "${configKey}". Expected a number.`)
          return
        }
        store.setWeight(currentComEditorStatus[configKey], payload as number)
      }
      break
    case 'titleItalic':
    case 'descItalic':
      {
        if (typeof payload !== 'number') {
          console.error(`Invalid payload type for "${configKey}". Expected a number.`)
          return
        }
        store.setItalic(currentComEditorStatus[configKey], payload as number)
      }
      break
    case 'titleColor':
    case 'descColor':
      {
        if (typeof payload !== 'string') {
          console.error(`Invalid payload type for "${configKey}". Expected a string.`)
          return
        }
        store.setColor(currentComEditorStatus[configKey], payload as string)
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
.header {
  width: 100%;
  background-color: var(--white);
  position: fixed;
  top: 0;
  z-index: 10;
}
.container {
  width: calc(100vw - 40px);
  padding: 20px;
  // Header的高度50px，上下padding 20px
  height: calc(100vh - 50px - 40px);
  background: url('@/assets/imgs/editor_background.png');
  position: fixed;
  top: 50px;
}
</style>
