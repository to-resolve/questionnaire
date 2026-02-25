<template>
  <div class="enterprise-home">
    <!-- 顶部导航栏 -->
    <!-- <div class="top-navigation">
      <div class="nav-left">
        <div class="logo-section">
          <el-icon class="logo-icon"><Collection /></el-icon>
          <span class="logo-text">问卷星企业版</span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <div class="nav-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" icon="User" />
            <span class="username">管理员</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div> -->

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 数据概览卡片 -->
      <div class="overview-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card primary">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ tableData.length }}</div>
                  <div class="stat-label">总问卷数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card success">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ publishedCount }}</div>
                  <div class="stat-label">已发布</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card warning">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon><Edit /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ draftCount }}</div>
                  <div class="stat-label">草稿箱</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card info">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalQuestions }}</div>
                  <div class="stat-label">总题数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 功能操作区 -->
      <div class="action-section">
        <div class="section-header">
          <h2 class="section-title">问卷管理中心</h2>
          <div class="action-buttons">
            <el-button type="primary" :icon="Plus" @click="goToEditor" size="large">
              <span class="btn-text">新建问卷</span>
            </el-button>
            <el-button type="success" :icon="Compass" @click="goToComMarket" size="large">
              <span class="btn-text">组件库</span>
            </el-button>
            <el-button type="info" :icon="Refresh" @click="refreshData" size="large">
              <span class="btn-text">刷新</span>
            </el-button>
          </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="filter-section">
          <el-form :model="searchForm" :inline="true" class="search-form-item">
            <el-form-item label="问卷标题">
              <el-input
                v-model="searchForm.title"
                placeholder="搜索问卷标题"
                clearable
                size="large"
                style="width: 200px"
                :prefix-icon="Search"
              />
            </el-form-item>
            <el-form-item label="问卷状态">
              <el-select
                v-model="searchForm.status"
                placeholder="筛选状态"
                size="large"
                style="width: 200px"
                clearable
              >
                <el-option label="全部" :value="2"></el-option>
                <el-option label="草稿" :value="0"></el-option>
                <el-option label="已发布" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchForm.creatTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="defaultTime"
              />
            </el-form-item>
          </el-form>
          <div class="search-form-item">
            <el-button type="primary" @click="applyFilters" size="large">搜索</el-button>
            <el-button @click="resetFilters" size="large">重置</el-button>
          </div>
        </div>
      </div>

      <!-- 问卷列表表格 -->
      <div class="table-section">
        <el-card class="table-card">
          <template #header>
            <div class="table-header">
              <div class="header-left">
                <el-icon class="header-icon"><List /></el-icon>
                <span class="header-title">问卷列表</span>
                <el-tag type="info" size="small"
                  >{{ filteredTableData?.length || '0' }} 条记录</el-tag
                >
              </div>
              <div class="header-right">
                <el-dropdown>
                  <el-button>
                    批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="batchDelete">批量删除</el-dropdown-item>
                      <el-dropdown-item @click="batchExport">批量导出</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>

          <el-table
            :data="filteredTableData"
            style="width: 100%"
            border
            stripe
            empty-text="暂无问卷数据"
            row-class-name="survey-row"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />

            <el-table-column prop="createTime" label="创建时间" width="180" align="center">
              <template #default="{ row }">
                <div class="date-cell">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(row.createTime, false) }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="title" label="问卷标题" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="title-cell">
                  <el-icon class="title-icon"><Document /></el-icon>
                  <div class="title-content">
                    <div class="main-title">{{ row.title }}</div>
                    <div class="sub-title" v-if="row.description">{{ row.description }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 0 ? 'info' : 'success'" size="small" round>
                  {{ statusFormatDate(null, null, row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="surveyCount" label="题目数" width="100" align="center">
              <template #default="{ row }">
                <el-badge :value="row.surveyCount" class="question-badge" :max="99" type="primary">
                  <el-icon><Tickets /></el-icon>
                </el-badge>
              </template>
            </el-table-column>

            <el-table-column prop="updateTime" label="最后更新" width="180" align="center">
              <template #default="{ row }">
                <div>
                  <span>{{ formatDate(row.updateTime, true) }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="400" align="center">
              <template #default="scope">
                <div class="operation-buttons">
                  <el-button
                    type="primary"
                    size="small"
                    @click="viewSurvey(scope.row)"
                    :icon="View"
                  >
                    预览
                  </el-button>
                  <el-button
                    type="success"
                    size="small"
                    @click="editSurveyTitle(scope.row)"
                    :icon="EditPen"
                  >
                    编辑信息
                  </el-button>
                  <el-button
                    type="warning"
                    size="small"
                    @click="editSurvey(scope.row)"
                    :icon="Edit"
                  >
                    设计问卷
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="delSurvey(scope.row)"
                    :icon="Delete"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-section">
            <el-pagination
              style="float: right; margin: 30px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchForm.page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="searchForm.pageSize"
              layout="total,pager,sizes,"
              :total="tableTotal"
            >
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer-section">
      <div class="footer-content">
        <span>© 问卷星 - 专业的在线问卷制作平台</span>
      </div>
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import {
  Plus,
  Compass,
  Refresh,
  Search,
  ArrowDown,
  Document,
  Check,
  Edit,
  TrendCharts,
  Calendar,
  Tickets,
  View,
  EditPen,
  Delete,
  List,
} from '@element-plus/icons-vue'
import SurveyInfoDialog from '@/components/Common/SurveyInfoDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

// 类型
import type { SurveyDBData, SurveyDBReturnData } from '@/types'
import type { TableColumnCtx } from 'element-plus'
// axios
import { getSurveyListByUserId, getSurveyPageListByUserId } from '@/api/questionnaire'
// 工具方法
import { formatDate } from '@/utils'
import { remove } from '@/utils/dboperate'
import { parseToken } from '@/utils/auth'

const router = useRouter()

const surveyDialogRef = ref()
const tableData = ref<SurveyDBData[]>([])
const isPreview = ref(0) // 0：主页，1：预览，2：保存
const dialogVisible = ref(false)
const searchForm = reactive({
  title: '',
  status: 2,
  creatTime: '',
  page: 1,
  pageSize: 10,
})
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])
const tableTotal = ref(0)
const filteredTableData = ref<SurveyDBData[]>([])
// const searchKeyword = ref('')
// const statusFilter = ref('')
// const dateRange = ref<[string, string] | []>([])
const selectedRows = ref<SurveyDBData[]>([])

// 计算属性
const publishedCount = computed(() => tableData.value.filter((item) => item.status === 1).length)

const draftCount = computed(() => tableData.value.filter((item) => item.status === 0).length)

const totalQuestions = computed(() =>
  tableData.value.reduce((sum, item) => sum + item.surveyCount, 0),
)

const handleSizeChange = (val) => {
  searchForm.pageSize = val
  searchForm.page = 1
  getTableData()
}
const handleCurrentChange = (val) => {
  searchForm.page = val
  getTableData()
}
function getTableData() {
  if (Array.isArray(searchForm.creatTime)) {
    searchForm.begin = searchForm.creatTime[0]
    searchForm.end = searchForm.creatTime[1]
  } else {
    searchForm.begin = null
    searchForm.end = null
  }
  const params = {
    userId: parseToken(),
    ...searchForm,
  }
  getSurveyPageListByUserId(params).then((res) => {
    if (res && res.code === 200) {
      console.log(res, 'res')
      filteredTableData.value = res.data.rows
      tableTotal.value = res.data.total
    }
  })
}
// const filteredTableData = computed(() => {
//   let result = [...tableData.value]

//   // 关键词搜索
//   if (searchKeyword.value) {
//     const keyword = searchKeyword.value.toLowerCase()
//     result = result.filter(
//       (item) =>
//         item.title.toLowerCase().includes(keyword) ||
//         (item.description && item.description.toLowerCase().includes(keyword)),
//     )
//   }

//   // 状态筛选
//   if (statusFilter.value !== '') {
//     result = result.filter((item) => item.status.toString() === statusFilter.value)
//   }

//   // 日期范围筛选
//   if (dateRange.value && dateRange.value.length === 2) {
//     const [startDate, endDate] = dateRange.value
//     result = result.filter((item) => {
//       const itemDate = new Date(item.createTime)
//       return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
//     })
//   }

//   return result
// })

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

const refreshData = () => {
  getSurveyData()
}

const applyFilters = () => {
  console.log(searchForm, 'searchForm')
  searchForm.page = 1
  getTableData()
}
const resetFilters = () => {
  searchForm.title = ''
  searchForm.status = 2
  searchForm.creatTime = ''
  searchForm.page = 1
  searchForm.pageSize = 10
  getTableData()
}

const handleSelectionChange = (selection: SurveyDBData[]) => {
  selectedRows.value = selection
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的问卷')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 份问卷吗？`, '批量删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 执行批量删除逻辑
    selectedRows.value.forEach((row) => {
      remove(row.id, row.userId)
    })
    getSurveyData()
    ElMessage.success('批量删除成功')
  })
}

const batchExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的问卷')
    return
  }
  // 导出逻辑待实现
  ElMessage.info('批量导出功能开发中')
}

const viewSurvey = (surveyInfo: SurveyDBReturnData) => {
  console.log(surveyInfo)
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
    getTableData()
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
  row: SurveyDBData | null,
  column: TableColumnCtx<SurveyDBData> | null,
  cellValue: number,
) => {
  return ['草稿', '已发布'][cellValue]
}

onMounted(() => {
  getSurveyData()
  getTableData()
})
</script>

<style scoped lang="scss">
:deep(.el-table .cell) {
  overflow: visible;
}

.enterprise-home {
  min-height: 100vh;
  background-color: #f5f7fa;

  // 顶部导航栏样式
  .top-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 60px;
    background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .nav-left {
      display: flex;
      align-items: center;
      gap: 30px;

      .logo-section {
        display: flex;
        align-items: center;
        gap: 10px;

        .logo-icon {
          font-size: 24px;
          color: white;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 600;
          color: white;
        }
      }

      .breadcrumb {
        :deep(.el-breadcrumb__item) {
          .el-breadcrumb__inner {
            color: rgba(255, 255, 255, 0.8);

            &.is-link {
              color: white;
              font-weight: 500;
            }
          }

          &:last-child .el-breadcrumb__inner {
            color: white;
            font-weight: 600;
          }
        }
      }
    }

    .nav-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 20px;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .username {
          color: white;
          font-weight: 500;
        }

        .el-icon {
          color: white;
        }
      }
    }
  }

  // 主要内容区域
  .main-content {
    padding: 30px;
    max-width: 1600px;
    margin: 0 auto;

    // 数据概览卡片
    .overview-section {
      margin-bottom: 30px;

      .stat-card {
        border-radius: 12px;
        overflow: hidden;
        transition:
          transform 0.3s,
          box-shadow 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        &.primary {
          border-left: 4px solid #409eff;
          .stat-icon {
            background: linear-gradient(135deg, #409eff, #79bbff);
          }
        }

        &.success {
          border-left: 4px solid #67c23a;
          .stat-icon {
            background: linear-gradient(135deg, #67c23a, #95d475);
          }
        }

        &.warning {
          border-left: 4px solid #e6a23c;
          .stat-icon {
            background: linear-gradient(135deg, #e6a23c, #eebe77);
          }
        }

        &.info {
          border-left: 4px solid #909399;
          .stat-icon {
            background: linear-gradient(135deg, #909399, #b1b3b8);
          }
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 15px;

          .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            .el-icon {
              font-size: 24px;
              color: white;
            }
          }

          .stat-info {
            .stat-number {
              font-size: 28px;
              font-weight: 700;
              color: #303133;
              line-height: 1.2;
            }

            .stat-label {
              font-size: 14px;
              color: #909399;
              margin-top: 4px;
            }
          }
        }
      }
    }

    // 功能操作区
    .action-section {
      margin-bottom: 20px;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 15px;

          .el-button {
            border-radius: 8px;
            font-weight: 500;

            .btn-text {
              margin-left: 8px;
            }
          }
        }
      }

      .filter-section {
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

        :deep(.el-form-item) {
          display: flex;
          align-items: center;
          margin-bottom: 0;
          margin-right: 20px;
        }

        .search-form-item {
          display: flex;
          align-items: center;
          gap: 7px;
        }
      }
    }

    // 表格区域
    .table-section {
      .table-card {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

        :deep(.el-card__header) {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;

          .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .header-left {
              display: flex;
              align-items: center;
              gap: 12px;

              .header-icon {
                font-size: 20px;
                color: #409eff;
              }

              .header-title {
                font-size: 18px;
                font-weight: 600;
                color: #303133;
              }
            }
          }
        }

        :deep(.el-card__body) {
          padding: 0;

          .survey-row {
            transition: background-color 0.2s ease;

            &:hover {
              background-color: #f8fafc !important;
            }

            td {
              padding: 16px 12px;

              .date-cell {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #606266;

                .el-icon {
                  color: #909399;
                }
              }

              .title-cell {
                display: flex;
                align-items: center;
                gap: 12px;

                .title-icon {
                  font-size: 20px;
                  color: #409eff;
                }

                .title-content {
                  .main-title {
                    font-weight: 500;
                    color: #303133;
                    margin-bottom: 4px;
                  }

                  .sub-title {
                    font-size: 12px;
                    color: #909399;
                  }
                }
              }

              .operation-buttons {
                display: flex;
                gap: 8px;
                justify-content: center;
                flex-wrap: wrap;

                .el-button {
                  margin: 0;
                  min-width: 70px;
                }
              }
            }
          }
        }
      }
    }
  }

  // 底部信息
  .footer-section {
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid #e4e7ed;

    .footer-content {
      color: #909399;
      font-size: 14px;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .enterprise-home {
    .main-content {
      padding: 20px;

      .overview-section {
        .el-col {
          margin-bottom: 15px;
        }
      }

      .action-section {
        .section-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .enterprise-home {
    .top-navigation {
      padding: 0 15px;

      .nav-left {
        gap: 15px;

        .logo-text {
          font-size: 16px;
        }
      }
    }

    .main-content {
      padding: 15px;

      .action-section {
        .section-header {
          .action-buttons {
            width: 100%;
            flex-wrap: wrap;

            .el-button {
              flex: 1;
              min-width: 120px;
            }
          }
        }
      }

      .filter-section {
        :deep(.el-row) {
          .el-col {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
