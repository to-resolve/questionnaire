<template>
  <div key="id">
    <ButtonGroup :title="`${configKey === 'titleColor' ? '标题' : '描述'}颜色`" :status="status">
      <el-color-picker v-model="color" @change="changeColor"></el-color-picker>
    </ButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import type { VueComType } from '@/types'
import ButtonGroup from './ButtonGroup.vue'
import { inject, ref } from 'vue'
const props = defineProps<{
  status: string
  id: string
  isShow: boolean
  editCom: VueComType
  configKey: string
}>()

const color = ref(props.status)
const updateStatus = inject('updateStatus') as (
  configKey: string,
  payload?: number | string | boolean | object,
) => void
const changeColor = (newVal: String) => {
  updateStatus(props.configKey, newVal)
}
</script>

<style lang="scss" scoped></style>
