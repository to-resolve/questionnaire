<template>
  <div>
    <div class="container flex self-start align-items-center border-box">
      <div class="left flex justify-content-center align-items-center">
        <el-button :icon="ArrowLeft" circle size="small" @click="goHome" />
      </div>
      <div class="center flex align-items-center space-between pl-15 pr-15">
        <div v-if="isEditor">
          <div v-if="id">
            <el-button type="warning" size="small" @click="update(store, Number(id))"
              >更新问卷</el-button
            >
          </div>
          <div v-else>
            <el-button type="danger" size="small" @click="reset">重置问卷</el-button>
            <el-button type="success" size="small" @click="openSurveyDialog">保存问卷</el-button>
          </div>
        </div>
        <div v-if="isEditor">
          <el-button type="primary" size="small" @click="preview">预览</el-button>
        </div>
      </div>
      <div class="right flex justify-content-center align-items-center">
        <el-avatar :size="30" :src="avatar" />
      </div>
    </div>

    <SurveyInfoDialog :store="store" :is-preview="isPreview" v-model:visible="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

import { useRouter } from 'vue-router'
const router = useRouter()

import { update } from '@/utils/dboperate'
import type { EditorStore } from '@/types'
import SurveyInfoDialog from './SurveyInfoDialog.vue'
import { useEditorStore } from '@/stores/useEditor'
const store = useEditorStore() as EditorStore

const isPreview = ref(0) // 0：主页，1：预览，2：保存
const dialogVisible = ref(false)

const goHome = () => {
  localStorage.setItem('activeView', 'home')
  router.push('/')
}
const props = defineProps({
  isEditor: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
})
const avatar = ref('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
// 重置题目
function reset() {
  ElMessageBox.confirm('是否确定重置试卷？已有题目将全部删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store.resetComs()
      ElMessage({
        type: 'success',
        message: '已重置',
      })
    })
    .catch(() => {
      console.log('取消重置')
    })
}

function preview() {
  ElMessageBox.confirm('预览会保存问卷，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      if (props.id) {
        // 说明是更新
        update(store, Number(props.id)).then(() => {
          router.push({
            path: `/preview/${props.id}`,
            state: { from: 'editor' },
          })
        })
      } else {
        // 说明是新建
        isPreview.value = 1
        openSurveyDialog()
      }
    })
    .catch(() => {
      console.log('取消预览')
    })
}

function openSurveyDialog() {
  isPreview.value = 2
  dialogVisible.value = true
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--border-color);
  .left {
    width: 60px;
    height: 100%;
  }
  .center {
    flex: 1;
    height: 100%;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  .right {
    width: 80px;
    height: 100%;
  }
}
</style>
