<template>
  <div>
    <div class="container">
      <h1 class="font-weight-300 text-center">问卷星平台</h1>
      <div class="mb-15">
        <el-button type="primary" :icon="Plus" @click="goToEditor">创建问卷</el-button>
        <el-button type="success" :icon="Compass" @click="goToComMarket">组件市场</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column
          fixed
          prop="createTime"
          label="创建日期"
          width="200"
          align="center"
          :formatter="formatDate"
        />
        <el-table-column prop="title" label="问卷标题" align="center" />
        <el-table-column prop="description" label="备注" header-align="center" />
        <el-table-column
          prop="status"
          label="问卷状态"
          width="100"
          align="center"
          :formatter="statusFormatDate"
        />
        <el-table-column prop="surveyCount" label="题目数" width="100" align="center" />
        <el-table-column
          prop="updateTime"
          label="最近更新日期"
          width="200"
          align="center"
          :formatter="formatDate"
        />
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template #default="scope">
            <el-button link type="success" size="small" @click="viewSurvey(scope.row)"
              >查看问卷</el-button
            >
            <el-button link type="primary" size="small" @click="editSurveyTitle(scope.row)"
              >修改标题</el-button
            >
            <el-button link type="warning" size="small" @click="editSurvey(scope.row)"
              >编辑</el-button
            >
            <el-button link type="danger" size="small" @click="delSurvey(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <SurveyInfoDialog
      ref="surveyDialogRef"
      :init-data="initDialogData"
      :is-preview="isPreview"
      v-model:visible="dialogVisible"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Compass } from '@element-plus/icons-vue'
import SurveyInfoDialog from '@/components/Common/SurveyInfoDialog.vue'
// 路由
import { useRouter } from 'vue-router'
const router = useRouter()
// 类型
import type { SurveyDBData, SurveyDBReturnData } from '@/types'
import type { TableColumnCtx } from 'element-plus'
// indexedDB
import { getSurveys } from '@/db/operation'
// axios
import { getSurveyListByUserId } from '@/api/questionnaire'
// 工具方法
import { formatDate } from '@/utils'
import { remove } from '@/utils/dboperate'
import { parseToken } from '@/utils/auth'

const surveyDialogRef = ref()
const tableData = ref<SurveyDBData[]>([])
const isPreview = ref(0) // 0：主页，1：预览，2：保存
const dialogVisible = ref(false)

function getSurveyData() {
  getSurveyListByUserId(parseToken()).then((res) => {
    if (res && res.code === 200) {
      tableData.value = res.data
    }
  })
}

const goToEditor = () => {
  localStorage.setItem('activeView', 'editor')
  router.push('/editor/survey-type')
}

const goToComMarket = () => {
  localStorage.setItem('activeView', 'materials')
  router.push('/materials')
}

const viewSurvey = (surveyInfo: SurveyDBReturnData) => {
  router.push({
    path: `/preview/${surveyInfo.id}`,
    state: { from: 'home' },
  })
}

const editSurvey = (surveyInfo: SurveyDBReturnData) => {
  router.push(`/editor/${surveyInfo.id}/survey-type`)
}

const delSurvey = (surveyInfo: SurveyDBReturnData) => {
  remove(surveyInfo.id, surveyInfo.userId).then(() => {
    getSurveyData()
  })
}

// 定义 Dialog 回显数据
const initDialogData = ref({
  id: 0,
  userId: 0,
  title: '',
  description: '',
})

const editSurveyTitle = (surveyInfo: SurveyDBReturnData) => {
  initDialogData.value = {
    id: surveyInfo.id,
    userId: surveyInfo.userId,
    title: surveyInfo.title,
    description: surveyInfo.description,
  }
  surveyDialogRef.value?.initFormData()
  dialogVisible.value = true
}

// Dialog 提交成功的回调
const handleDialogSuccess = () => {
  getSurveyData()
}

const statusFormatDate = (
  row: SurveyDBData,
  column: TableColumnCtx<SurveyDBData>,
  cellValue: number,
) => {
  return ['草稿', '已发布'][cellValue]
}

onMounted(() => {
  getSurveyData()
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
