<template>
  <div key="id">
    <ButtonGroup
      :title="`${configKey === 'titleItalic' ? '标题' : '描述'}倾斜`"
      :status="status[currentStatus]"
    >
      <el-button-group>
        <el-button :class="{ select: currentStatus === 0 }" @click="changeItalic(0)">
          <font-awesome-icon icon="italic" size="lg" />
        </el-button>
        <el-button :class="{ select: currentStatus === 1 }" @click="changeItalic(1)">
          <font-awesome-icon icon="italic" size="sm" />
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
const changeItalic = (Italic: Number) => {
  updateStatus(props.configKey, Italic)
}
</script>

<style lang="scss" scoped></style>
