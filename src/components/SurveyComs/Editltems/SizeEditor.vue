<template>
  <div key="id">
    <ButtonGroup
      :title="`${configKey === 'titleSize' ? '标题' : '描述'}尺寸`"
      :status="status[currentStatus]"
    >
      <el-button-group>
        <el-button :class="{ select: currentStatus === 0 }" @click="changeSize(0)">
          <font-awesome-icon icon="font" size="lg" />
        </el-button>
        <el-button :class="{ select: currentStatus === 1 }" @click="changeSize(1)">
          <font-awesome-icon icon="font" size="sm" />
        </el-button>
        <el-button :class="{ select: currentStatus === 2 }" @click="changeSize(2)">
          <font-awesome-icon icon="font" size="xs" />
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
const changeSize = (size: Number) => {
  updateStatus(props.configKey, size)
}
</script>

<style lang="scss" scoped></style>
