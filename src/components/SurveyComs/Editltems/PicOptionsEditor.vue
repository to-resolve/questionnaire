<template>
  <div>
    <div class="flex align-items-center">
      <div class="mr-10">题目选项</div>
      <el-button :icon="Plus" size="small" circle @click="addOptionHandle"></el-button>
    </div>
    <div v-for="(item, index) in textArr" :key="index">
      <div class="title mt-10 mb-10 flex align-items-center">
        <span>选项{{ index + 1 }}</span>
        <el-button
          :icon="Minus"
          circle
          size="small"
          type="danger"
          class="ml-5 delete"
          @click="removeOptionHandle(index)"
        />
      </div>
      <div class="mb-5">
        <div class="flex" v-if="item.value">
          <span class="title mr-5">已上传图片</span>
          <el-link type="primary" @click="deletePic(index)">删除图片</el-link>
        </div>
        <span v-else class="title">未上传图片</span>
      </div>
      <el-input class="mb-5" v-model="item.picTitle" placeholder="图片标题" />
      <el-input type="textarea" :rows="3" v-model="item.picDesc" placeholder="图片描述" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'
import type { VueComType, PicTitleDescStatusArr, UpdateStatus } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  currentStatus: number
  status: PicTitleDescStatusArr
  id: string
  isShow: boolean
  editCom: VueComType
  configKey: string
}>()

const textArr = ref(props.status)
const updateStatus = inject<UpdateStatus>('updateStatus')
const addOptionHandle = () => {
  if (updateStatus) {
    updateStatus(props.configKey)
  }
}
const removeOptionHandle = (index: number) => {
  if (updateStatus) {
    updateStatus(props.configKey, index)
  }
}
const deletePic = (index: number) => {
  ElMessageBox.confirm('是否确认删除图片？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      if (updateStatus) {
        updateStatus(props.configKey, {
          link: '',
          index,
        })
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
</script>

<style lang="scss" scoped>
.title {
  color: var(--font-color-light);
  font-size: var(--font-size-base);
}
.delete {
  transform: scale(0.8);
}
</style>
