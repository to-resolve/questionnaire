<template>
  <div class="questionnaire-management">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">问卷管理</h2>
          <p class="page-subtitle">管理系统所有问卷数据</p>
        </div>
        <div class="header-right">
          <el-button @click="fetchQuestionnaireList">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <el-card shadow="hover" class="table-card">
        <el-table :data="questionnaireList" v-loading="loading" style="width: 100%" border stripe>
          <el-table-column type="index" label="序号" width="60" align="center">
            <template #default="{ $index }">
              {{ (queryParams.pageNum - 1) * queryParams.pageSize + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="问卷ID" width="80" align="center" />
          <el-table-column prop="userId" label="用户ID" width="80" align="center" />
          <el-table-column prop="title" label="问卷标题" min-width="200" show-overflow-tooltip />
          <el-table-column
            prop="description"
            label="问卷描述"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '已发布' : '草稿' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="surveyCount" label="题目数" width="100" align="center" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" align="center">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="180" align="center">
            <template #default="{ row }">
              {{ formatTime(row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <el-button v-if="row.status === 1" link type="warning" @click="handleUnpublish(row)">
                下架
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="fetchQuestionnaireList"
            @current-change="fetchQuestionnaireList"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getAllSurveyList, deleteSurveyAdmin, unpublishSurveyAdmin } from '@/api/questionnaire'

const loading = ref(false)
const questionnaireList = ref([])
const total = ref(0)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
})

const fetchQuestionnaireList = async () => {
  loading.value = true
  try {
    const res = await getAllSurveyList({
      page: queryParams.pageNum,
      pageSize: queryParams.pageSize,
    })
    if (res.code === 200) {
      questionnaireList.value = res.data.rows || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取问卷列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除问卷 "${row.title}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await deleteSurveyAdmin(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchQuestionnaireList()
      }
    } catch (error) {
      console.error('删除问卷失败', error)
    }
  })
}

const handleUnpublish = (row: any) => {
  ElMessageBox.confirm('撤销发布后会删除该问卷的答案统计数据，是否撤销发布？', '撤销发布确认', {
    confirmButtonText: '确定撤销',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await unpublishSurveyAdmin(row.id)
      if (res.code === 200) {
        ElMessage.success('撤销发布成功')
        fetchQuestionnaireList()
      }
    } catch (error) {
      console.error('撤销发布失败', error)
    }
  })
}

const formatTime = (time: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString()
}

onMounted(() => {
  fetchQuestionnaireList()
})
</script>

<style scoped lang="scss">
.questionnaire-management {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 50%, #e9ecef 100%);
  min-height: calc(100vh - 60px);

  .page-header {
    margin-bottom: 24px;
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

      .page-title {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-weight: 600;
        color: #303133;
      }
      .page-subtitle {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .main-content {
    .table-card {
      min-height: calc(100vh - 227px);
      border-radius: 12px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.95);

      .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
