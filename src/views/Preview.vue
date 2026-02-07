<template>
  <div class="preview-container pb-40">
    <div class="center mc">
      <div class="button-group flex align-items-center space-between">
        <div class="no-print flex space-between">
          <el-button type="danger" @click="gobackHandle">返回</el-button>
          <el-button type="success" @click="genQuiz">生成在线问卷</el-button>
          <el-button type="warning" @click="genPDF">生成本地PDF</el-button>
        </div>
        <div class="mr-15">
          <el-text class="mx-1">题目数量：{{ store.surveyCount }}</el-text>
        </div>
      </div>
      <div class="content-group no-border">
        <div class="content mb-10" v-for="(com, index) in store.coms" :key="index">
          <component :is="com.type" :status="com.status" :serialNum="serialNum[index]" />
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="信息" width="500">
    分享链接: <a :href="quizLink" target="_blank">{{ quizLink }}</a>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="copyLink">复制链接</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getSurveyById } from '@/db/operation'
import { restoreComponentStatus } from '@/utils'
import { useRouter, useRoute } from 'vue-router'
import { useEditorStore } from '@/stores/useEditor'
import { useSurveyNo } from '@/utils/hooks'
import { canUsedForPDF } from '@/types'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'

const serialNum = computed(() => useSurveyNo(store.coms).value)

const store = useEditorStore()
const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)
if (id) {
  getSurveyById(id).then((res) => {
    if (res) {
      restoreComponentStatus(res.coms)
      store.setStore(res)
    }
  })
}

const gobackHandle = () => {
  const path = history.state.from
  if (path === 'home') {
    router.back()
  } else {
    router.push(`/editor/${id}/survey-type`)
  }
}

const genPDF = () => {
  const result = store.coms.every((item) => canUsedForPDF(item.name))
  if (!result) {
    ElMessage.info('当前问卷中存在不支持生成PDF的题目，请检查后再尝试！')
    return
  }
  window.print()
}

const dialogVisible = ref(false)
const quizLink = ref('')

const genQuiz = () => {
  const id = uuidv4()
  fetch('/api/saveQuiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      quizData: {
        coms: JSON.stringify(store.coms),
        surveyCount: store.surveyCount,
      },
    }),
  })
  quizLink.value = `${window.location.origin}/quiz/${id}`
  dialogVisible.value = true
}

const copyLink = () => {
  dialogVisible.value = false
  navigator.clipboard.writeText(quizLink.value)
  ElMessage.success('在线答题的链接已复制')
}
</script>

<style scoped lang="scss">
.preview-container {
  width: 100vw;
  min-height: 100vh;
  background: url('@/assets/imgs/editor_background.png');
}
.center {
  width: 800px;
}
.button-group {
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  background-color: var(--white);
  z-index: 100;
}
.content-group {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--white);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
@media print {
  .no-print {
    display: none;
  }
  .no-border {
    border: none;
    box-shadow: none;
  }
}
</style>
