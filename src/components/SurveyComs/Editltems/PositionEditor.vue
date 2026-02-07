<template>
  <div key="id">
    <ButtonGroup title="居中设置" :status="status[currentStatus]">
      <el-button-group>
        <el-button
          :class="{
            select: currentStatus === 0,
          }"
          @click="changePosition(0)"
        >
          <font-awesome-icon icon="align-left" />
        </el-button>
        <el-button
          :class="{
            select: currentStatus === 1,
          }"
          @click="changePosition(1)"
          ><font-awesome-icon icon="align-center" />
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
  id: string
  currentStatus: number
  isShow: boolean
  configKey: string
  editCom: VueComType
}>()
const updateStatus = inject('updateStatus') as (
  configKey: string,
  payload?: number | string | boolean | object,
) => void
const changePosition = (pos: number) => {
  updateStatus(props.configKey, pos)
}
</script>

<style lang="scss" scoped></style>
