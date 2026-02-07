<template>
  <div key="id">
    <div class="mb-10">标题内容</div>
    <el-input placeholder="请输入标题" v-model="text" @update:modelValue="inputHandle" />
  </div>
</template>

<script lang="ts" setup>
import type { VueComType } from '@/types'
import { ref, inject } from 'vue'
const props = defineProps<{
  status: string
  id: string
  isShow: boolean
  editCom: VueComType
  configKey: string
}>()
const text = ref(props.status)
const updateStatus = inject('updateStatus') as (
  configKey: string,
  payload?: number | string | boolean | object,
) => void

function inputHandle(newVal: string) {
  updateStatus(props.configKey, newVal)
}
</script>
