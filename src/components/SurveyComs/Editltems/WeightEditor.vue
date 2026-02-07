<template>
  <div key="id">
    <ButtonGroup
      :title="`${configKey === 'titleWeight' ? '标题' : '描述'}加粗`"
      :status="status[currentStatus]"
    >
      <el-button-group>
        <el-button :class="{ select: currentStatus === 0 }" @click="changeWeight(0)">
          <font-awesome-icon icon="bold" size="lg" />
        </el-button>
        <el-button :class="{ select: currentStatus === 1 }" @click="changeWeight(1)">
          <font-awesome-icon icon="bold" size="sm" />
        </el-button>
      </el-button-group>
    </ButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import type { VueComType } from '@/types'
import ButtonGroup from './ButtonGroup.vue'
import { inject } from 'vue'
const props = defineProps<{
  status: string[]
  currentStatus: number
  id: string
  isShow: boolean
  configKey: string
  editCom: VueComType
}>()

const updateStatus = inject('updateStatus') as (
  configKey: string,
  payload?: number | string | boolean | object,
) => void
const changeWeight = (weight: number) => {
  updateStatus(props.configKey, weight)
}
</script>

<style lang="scss" scoped></style>
