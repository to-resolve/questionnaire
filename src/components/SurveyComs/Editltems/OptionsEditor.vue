<template>
  <div key="id">
    <div class="flex align-items-center mb-10">
      <div class="mr-10">题目选项</div>
      <el-button size="small" circle :icon="Plus" @click="addOptionHandle" />
    </div>
    <div v-for="(item, index) in status" :key="index" class="flex align-items-center">
      <el-input placeholder="选项" class="mb-5 mt-5" v-model="textArr[index]" />
      <el-button
        type="danger"
        size="small"
        circle
        :icon="Minus"
        class="ml-10"
        @click="removeOption(index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { VueComType } from '@/types'
import { Plus, Minus } from '@element-plus/icons-vue'
import { ref, inject } from 'vue'
const props = defineProps<{
  status: string[]
  id: string
  isShow: boolean
  editCom: VueComType
  configKey: string
}>()

const textArr = ref(props.status)
const updateStatus = inject('updateStatus') as (
  configKey: string,
  payload?: number | string | boolean | object,
) => void
const addOptionHandle = () => {
  updateStatus(props.configKey)
}

const removeOption = (index: number) => {
  updateStatus(props.configKey, index)
}
</script>
