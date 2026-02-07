<template>
  <div class="container">
    <h1 class="font-weight-400 text-center">问卷制作平台</h1>
    <div class="mb-15">
      <el-button type="primary" :icon="Plus" @click="goToEditor">创建问卷</el-button>
      <el-button type="success" :icon="Compass" @click="goToComMarket">组件市场</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        prop="createDate"
        label="创建日期"
        width="250"
        :formatter="formatDate"
      ></el-table-column>
      <el-table-column prop="title" label="问卷标题"></el-table-column>
      <el-table-column
        prop="surveyCount"
        label="题目数"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="updateDate"
        label="最近跟新日期"
        width="250"
        align="center"
        :formatter="formatDate"
      ></el-table-column>
      <el-table-column prop="right" label="操作" width="300" align="center">
        <template #default="scope">
          <el-button link type="info" size="small" @click="viewSurvey(scope.row)"
            >查看问卷</el-button
          >
          <el-button link type="primary" size="small" @click="editSurvey(scope.row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="deleteSurvey(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Compass } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import type { SurveyDBData, SurveyDBReturnData } from '@/types'
import { getSurveys } from '@/db/operation'
import { formatDate } from '@/utils'

import { useEditorStore } from '@/stores/useEditor'
import { ElMessage, ElMessageBox } from 'element-plus'
const store = useEditorStore()

const tableData = ref<SurveyDBData[]>([])

function getSurveyData() {
  getSurveys().then((res) => {
    tableData.value = res
  })
}
getSurveyData()

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
    state: {
      from: 'home',
    },
  })
}

const editSurvey = (surveyInfo: SurveyDBReturnData) => {
  router.push(`/editor/${surveyInfo.id}/survey-type`)
}

const deleteSurvey = (surveyInfo: SurveyDBReturnData) => {
  ElMessageBox.confirm('确定要删除该问卷吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.deleteComs(surveyInfo.id).then(() => {
      getSurveyData()
    })
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.container {
  padding: 30px;
}
</style>
