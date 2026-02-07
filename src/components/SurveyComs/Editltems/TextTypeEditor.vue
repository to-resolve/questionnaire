<template>
  <ButtonGroup title="说明类型" :status="status[currentStatus]">
    <el-button-group>
      <el-button
        :class="{
          select: currentStatus === 0,
        }"
        @click="changeType(0)"
      >
        <font-awesome-icon icon="heading" />
      </el-button>
      <el-button
        :class="{
          select: currentStatus === 1,
        }"
        @click="changeType(1)"
      >
        <font-awesome-icon icon="paragraph" />
      </el-button>
    </el-button-group>
  </ButtonGroup>
</template>

<script setup lang="ts">
import type { UpdateStatus, VueComType } from '@/types'
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

const updateStatus = inject<UpdateStatus>('updateStatus')
const changeType = (type: number) => {
  if (updateStatus) updateStatus(props.configKey, type)
}
</script>

<style lang="scss" scoped></style>
