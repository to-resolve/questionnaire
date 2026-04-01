<template>
  <div class="market-view">
    <div class="header">
      <h2 class="title">问卷市场</h2>
      <p class="subtitle">在这里查看并参与所有用户发布的公开问卷</p>
    </div>

    <div class="filter-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索问卷标题或描述"
        class="search-input"
        :prefix-icon="Search"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <div v-loading="loading" class="survey-grid">
      <el-row :gutter="20" v-if="publishedSurveys.length > 0">
        <el-col
          v-for="survey in publishedSurveys"
          :key="survey.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card class="survey-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="survey-title">{{ survey.title }}</span>
                <el-tag size="small" type="success">已发布</el-tag>
              </div>
            </template>
            <div class="card-content">
              <p class="description">{{ survey.description || '暂无描述' }}</p>
              <div class="meta-info">
                <div class="info-item">
                  <el-icon><Tickets /></el-icon>
                  <span>{{ survey.surveyCount }} 题</span>
                </div>
                <div class="info-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(survey.createTime, false) }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <el-button type="primary" plain @click="participateSurvey(survey.id)">
                参与调研
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-else description="暂无发布的问卷" />
    </div>

    <div class="pagination-section" v-if="total > 0">
      <el-pagination
        v-model:current-page="pageParams.page"
        v-model:page-size="pageParams.pageSize"
        :page-sizes="[8, 12, 24, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Tickets, Calendar } from '@element-plus/icons-vue'
import { getPublishedSurveyList } from '@/api/questionnaire'
import { formatDate } from '@/utils'
import { useRouter } from 'vue-router'
import type { SurveyDBReturnData } from '@/types'

const router = useRouter()
const loading = ref(false)
const searchKeyword = ref('')
const publishedSurveys = ref<SurveyDBReturnData[]>([])
const total = ref(0)

const pageParams = reactive({
  page: 1,
  pageSize: 8,
})

const fetchPublishedSurveys = async () => {
  loading.value = true
  try {
    const params = {
      ...pageParams,
      title: searchKeyword.value || undefined,
    }
    const res = await getPublishedSurveyList(params)
    if (res && res.code === 200) {
      // 假设后端返回格式为 { rows: [], total: 0 }
      // 如果后端还没改，兼容一下直接返回数组的情况
      if (Array.isArray(res.data)) {
        publishedSurveys.value = res.data
        total.value = res.data.length
      } else {
        publishedSurveys.value = res.data.rows
        total.value = res.data.total
      }
    }
  } catch (error) {
    console.error('获取已发布问卷失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageParams.page = 1
  fetchPublishedSurveys()
}

const handleSizeChange = (val: number) => {
  pageParams.pageSize = val
  pageParams.page = 1
  fetchPublishedSurveys()
}

const handleCurrentChange = (val: number) => {
  pageParams.page = val
  fetchPublishedSurveys()
}

const participateSurvey = (id: number) => {
  router.push(`/quiz/${id}`)
}

onMounted(() => {
  fetchPublishedSurveys()
})
</script>

<style scoped lang="scss">
.market-view {
  padding: 30px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;

  .header {
    margin-bottom: 30px;
    text-align: center;

    .title {
      font-size: 28px;
      color: #303133;
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 16px;
      color: #909399;
    }
  }

  .filter-section {
    max-width: 600px;
    margin: 0 auto 40px;

    .search-input {
      :deep(.el-input__wrapper) {
        border-radius: 20px 0 0 20px;
      }
      :deep(.el-input-group__append) {
        border-radius: 0 20px 20px 0;
        background-color: #409eff;
        color: white;
        border: none;
        .el-button {
          color: white;
          margin: 0;
        }
      }
    }
  }

  .survey-grid {
    flex: 1;
    .survey-card {
      margin-bottom: 20px;
      border-radius: 12px;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .survey-title {
          font-weight: 600;
          font-size: 16px;
          color: #303133;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }
      }

      .card-content {
        .description {
          color: #606266;
          font-size: 14px;
          height: 40px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 15px;
        }

        .meta-info {
          display: flex;
          justify-content: space-between;
          color: #909399;
          font-size: 12px;

          .info-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }

      .card-actions {
        margin-top: 20px;
        display: flex;
        justify-content: center;

        .el-button {
          width: 100%;
          border-radius: 8px;
        }
      }
    }
  }

  .pagination-section {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    background: white;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>
