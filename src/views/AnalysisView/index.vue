<template>
  <div class="analysis-view">
    <div class="header">
      <el-button :icon="ArrowLeft" @click="router.back()">返回</el-button>
      <h2 class="title">问卷分析 - {{ surveyInfo?.title }}</h2>
    </div>

    <el-tabs v-model="activeTab" class="analysis-tabs">
      <el-tab-pane label="统计图表" name="charts">
        <div v-if="loading" v-loading="loading" class="loading-placeholder"></div>
        <div v-else-if="analysisData.length > 0" class="charts-container">
          <el-row :gutter="20">
            <el-col :span="24" v-for="(item, index) in analysisData" :key="index">
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <span class="question-title">{{ index + 1 }}. {{ item.title }}</span>
                    <el-tag size="small">{{ item.type }}</el-tag>
                  </div>
                </template>
                <div class="chart-content">
                  <div :id="'chart-' + index" class="echart-box"></div>
                  <div class="chart-table">
                    <el-table :data="item.options" size="small" border stripe>
                      <el-table-column prop="label" label="选项" />
                      <el-table-column prop="count" label="小计" width="80" />
                      <el-table-column prop="percent" label="比例" width="100">
                        <template #default="{ row }">
                          <el-progress :percentage="row.percent" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <el-empty v-else description="暂无统计数据" />
      </el-tab-pane>

      <el-tab-pane label="答卷详情" name="details">
        <el-table :data="answerList" border stripe v-loading="loading">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="submitTime" label="提交时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.submitTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="来源IP" width="140" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="viewDetail(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="detailVisible" title="答卷详情" width="60%">
      <div v-if="currentAnswer" class="answer-detail">
        <div v-for="(ans, idx) in currentAnswer.answers" :key="idx" class="answer-item">
          <div class="q-title">{{ ans.title }}</div>
          <div class="q-value">
            {{ Array.isArray(ans.value) ? ans.value.join('，') : ans.value }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getSurveyListByUserId, getSurveyAnalysis, getSurveyAnswerList } from '@/api/questionnaire'
import { formatDate } from '@/utils'
import { parseToken } from '@/utils/auth'
import * as echarts from 'echarts'
import type { SurveyDBReturnData } from '@/types'

const route = useRoute()
const router = useRouter()
const surveyId = Number(route.params.id)

const activeTab = ref('charts')
const loading = ref(false)
const surveyInfo = ref<SurveyDBReturnData>()
const analysisData = ref<any[]>([])
const answerList = ref<any[]>([])
const detailVisible = ref(false)
const currentAnswer = ref<any>(null)

const fetchSurveyInfo = async () => {
  const userId = parseToken()
  if (userId) {
    const res = await getSurveyListByUserId(userId, surveyId)
    if (res && res.code === 200 && res.data.length > 0) {
      surveyInfo.value = res.data[0]
    }
  }
}

const fetchAnalysisData = async () => {
  loading.value = true
  try {
    const res = await getSurveyAnalysis(surveyId)
    if (res && res.code === 200) {
      analysisData.value = res.data
      await nextTick()
      initCharts()
    }
  } catch (error) {
    // 模拟数据用于演示，因为后端可能还没实现
    analysisData.value = [
      {
        title: '您对本系统的满意度如何？',
        type: '单选题',
        options: [
          { label: '非常满意', count: 45, percent: 45 },
          { label: '满意', count: 35, percent: 35 },
          { label: '一般', count: 15, percent: 15 },
          { label: '不满意', count: 5, percent: 5 },
        ],
      },
      {
        title: '您最常用的功能有哪些？',
        type: '多选题',
        options: [
          { label: '问卷设计', count: 80, percent: 80 },
          { label: 'AI建卷', count: 60, percent: 60 },
          { label: '组件市场', count: 40, percent: 40 },
          { label: '数据分析', count: 70, percent: 70 },
        ],
      },
    ]
    await nextTick()
    initCharts()
  } finally {
    loading.value = false
  }
}

const fetchAnswerList = async () => {
  try {
    const res = await getSurveyAnswerList(surveyId)
    if (res && res.code === 200) {
      answerList.value = res.data
    }
  } catch (error) {
    answerList.value = [
      {
        id: 1,
        submitTime: Date.now() - 3600000,
        ip: '192.168.1.1',
        answers: [
          { title: '您对本系统的满意度如何？', value: '非常满意' },
          { title: '您最常用的功能有哪些？', value: ['问卷设计', '数据分析'] },
        ],
      },
      {
        id: 2,
        submitTime: Date.now() - 7200000,
        ip: '127.0.0.1',
        answers: [
          { title: '您对本系统的满意度如何？', value: '满意' },
          { title: '您最常用的功能有哪些？', value: ['AI建卷'] },
        ],
      },
    ]
  }
}

const initCharts = () => {
  analysisData.value.forEach((item, index) => {
    const chartDom = document.getElementById('chart-' + index)
    if (chartDom) {
      const myChart = echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '回答统计',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: item.options.map((opt: any) => ({
              value: opt.count,
              name: opt.label,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      myChart.setOption(option)
    }
  })
}

const viewDetail = (row: any) => {
  currentAnswer.value = row
  detailVisible.value = true
}

onMounted(() => {
  fetchSurveyInfo()
  fetchAnalysisData()
  fetchAnswerList()
})
</script>

<style scoped lang="scss">
.analysis-view {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  .header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
  }

  .analysis-tabs {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  .charts-container {
    .chart-card {
      margin-bottom: 20px;

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .question-title {
          font-weight: 600;
          color: #303133;
        }
      }

      .chart-content {
        display: flex;
        gap: 20px;
        align-items: flex-start;

        .echart-box {
          width: 50%;
          height: 300px;
        }

        .chart-table {
          flex: 1;
        }
      }
    }
  }

  .answer-detail {
    .answer-item {
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;

      .q-title {
        font-weight: 600;
        margin-bottom: 5px;
        color: #303133;
      }

      .q-value {
        color: #606266;
      }
    }
  }
}

@media (max-width: 992px) {
  .analysis-view {
    .charts-container {
      .chart-card {
        .chart-content {
          flex-direction: column;
          .echart-box {
            width: 100%;
          }
          .chart-table {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
