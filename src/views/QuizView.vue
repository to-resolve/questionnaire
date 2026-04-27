<template>
  <div class="quiz-wrapper" v-loading="loading">
    <div v-if="quizData && quizData.coms.length > 0" class="quiz-container mc">
      <el-card class="quiz-card" shadow="hover">
        <template #header>
          <div class="quiz-header">
            <h1 class="quiz-title">{{ quizData.title || '问卷调查' }}</h1>
            <p class="quiz-desc">
              {{ quizData.description || '感谢您参与本次问卷调查，请根据实际情况填写。' }}
            </p>
            <div class="quiz-info">
              <el-tag size="small" type="info">题目数量：{{ quizData.surveyCount }}</el-tag>
            </div>
          </div>
        </template>

        <div class="quiz-content">
          <div class="question-item" v-for="(com, index) in quizData.coms" :key="index">
            <component
              :is="com.type"
              :status="com.status"
              :serialNum="serialNum[index]"
              @updateAnswer="updateAnswer(index, $event)"
            />
          </div>
        </div>

        <div class="quiz-footer">
          <el-button v-if="!isMySurvey" type="success" size="large" @click="importSurvey">
            一键导入
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="submitAnswers">
            提交答案
          </el-button>
        </div>
      </el-card>
    </div>
    <el-empty v-else-if="!loading" description="暂无问卷内容" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { QuizData } from '@/types'
// 工具
import { restoreComponentStatus } from '@/utils'
import { parseToken } from '@/utils/auth'
// 组合式函数
import { useSurveyNo } from '@/utils/hooks'
// 引入 ElementPlus 库
import { ElMessage } from 'element-plus'
// 路由
import { useRoute, useRouter } from 'vue-router'
// 接口
import { getQuiz, submitAnswers as submitAnswersApi } from '@/api/questionnaire'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const currentUserId = ref<number | null>(null)
const quizData = ref<
  QuizData & { title?: string; description?: string; userId?: number; id?: number }
>({
  coms: [],
  surveyCount: 0,
  title: '',
  description: '',
})

// 判断是否是"我的"问卷
const isMySurvey = computed(() => {
  return currentUserId.value !== null && quizData.value.userId === currentUserId.value
})

// 用于存储所有问题的答案
const answers: Ref<{ [key: number]: string | number | Date }> = ref({})
// 获取题目编号
const serialNum = computed(() => useSurveyNo(quizData.value?.coms).value)

onMounted(async () => {
  currentUserId.value = parseToken()
  const quizId = route.params.id as string
  if (!quizId) {
    ElMessage.error('问卷ID不存在')
    loading.value = false
    return
  }

  try {
    const res = await getQuiz(quizId)
    if (res.code === 200 && res.data) {
      const data = res.data
      if (typeof data.coms === 'string') {
        data.coms = JSON.parse(data.coms)
      }
      restoreComponentStatus(data.coms)
      quizData.value = data
    }
  } catch (error) {
    console.error('获取问卷失败:', error)
  } finally {
    loading.value = false
  }
})

const updateAnswer = (index: number, answer: string | number | Date) => {
  const serial = serialNum.value[index]
  if (serial !== null) {
    answers.value[serial] = answer
  }
}

const submitAnswers = async () => {
  const quizId = route.params.id as string

  // 简单的校验：检查是否所有题目都已回答（可选，根据需求决定是否强制）
  // if (Object.keys(answers.value).length < quizData.value.surveyCount) {
  //   ElMessage.warning('请完成所有题目后再提交')
  //   return
  // }

  submitting.value = true
  try {
    const res = await submitAnswersApi(quizId, answers.value)
    if (res.code === 200) {
      ElMessage({
        message: '答案已提交，感谢您的参与！',
        type: 'success',
      })
      // 提交成功后可以跳转到结果页或首页
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const importSurvey = () => {
  // 将问卷数据保存到 localStorage 中，在编辑器页面读取
  const importData = {
    title: quizData.value.title,
    description: quizData.value.description,
    coms: quizData.value.coms,
  }
  localStorage.setItem('importSurveyData', JSON.stringify(importData))
  ElMessage.success('问卷信息已准备好，即将跳转到编辑器')
  setTimeout(() => {
    router.push('/editor')
  }, 500)
}
</script>

<style scoped lang="scss">
.quiz-wrapper {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 40px 20px;
}

.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-card {
  border-radius: 8px;
  border: none;

  :deep(.el-card__header) {
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
    padding: 30px 40px;
  }
}

.quiz-header {
  text-align: center;

  .quiz-title {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px;
  }

  .quiz-desc {
    font-size: 16px;
    color: #606266;
    line-height: 1.6;
    margin: 0 0 20px;
  }

  .quiz-info {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

.quiz-content {
  padding: 20px 20px;

  .question-item {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }
  }
}

.quiz-footer {
  margin-top: 40px;
  padding-bottom: 20px;
  text-align: center;

  .el-button {
    width: 200px;
    height: 45px;
    font-size: 16px;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .quiz-wrapper {
    padding: 20px 10px;
  }

  .quiz-card {
    :deep(.el-card__header) {
      padding: 20px;
    }
  }

  .quiz-title {
    font-size: 22px;
  }
}
</style>
