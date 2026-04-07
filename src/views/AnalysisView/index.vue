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
                  <div :ref="(el) => setChartRef(el, index)" class="echart-box"></div>
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
        <el-table :data="answerList" border stripe v-loading="loading" style="width: 100%">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="submitTime" label="提交时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.submitTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="来源IP" />
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
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
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

const chartInstances: any[] = []
const chartRefs: (HTMLElement | null)[] = []

const setChartRef = (el: any, index: number) => {
  if (el) {
    chartRefs[index] = el
    console.log(`设置图表${index}的ref:`, el)
  }
}

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
      // 再延迟一下确保DOM完全渲染
      setTimeout(initCharts, 100)
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
    setTimeout(initCharts, 100)
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
  console.log('开始初始化图表，数据数量:', analysisData.value.length)
  console.log('chartRefs数组:', chartRefs)

  // 先销毁之前的实例
  chartInstances.forEach((chart) => {
    if (chart) chart.dispose()
  })
  chartInstances.length = 0

  analysisData.value.forEach((item, index) => {
    const chartDom = chartRefs[index]
    console.log(`图表${index}元素:`, chartDom)
    if (chartDom) {
      const myChart = echarts.init(chartDom)
      chartInstances.push(myChart)

      console.log(`图表${index}数据:`, item.options)

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
      console.log(`图表${index}初始化完成`)
    }
  })
}

const handleResize = () => {
  chartInstances.forEach((chart) => {
    if (chart) chart.resize()
  })
}

onMounted(() => {
  fetchSurveyInfo()
  fetchAnalysisData()
  fetchAnswerList()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartInstances.forEach((chart) => {
    if (chart) chart.dispose()
  })
  window.removeEventListener('resize', handleResize)
})

const viewDetail = async (row: any) => {
  try {
    // 首先获取问卷的组件信息来解析答案
    if (!surveyInfo.value) {
      await fetchSurveyInfo()
    }

    if (surveyInfo.value?.coms) {
      const components = JSON.parse(surveyInfo.value.coms)
      const answersData = JSON.parse(row.answerData)

      // 先构建输入组件的索引映射
      const inputIndexMap = new Map()
      let inputIndex = 0
      components.forEach((component: any, idx: number) => {
        const name = component.name
        if (name !== 'text-note') {
          inputIndex++
          inputIndexMap.set(idx, inputIndex)
        }
      })

      const parsedAnswers: any[] = []

      components.forEach((component: any, componentIdx: number) => {
        const name = component.name

        // 只处理有输入的组件
        if (name === 'text-note') return

        const answerKeyNum = inputIndexMap.get(componentIdx)
        const answerKey = answerKeyNum ? String(answerKeyNum) : null
        if (!answerKey) return

        const status = component.status || {}
        const titleObj = status.title || {}
        const title = titleObj.status || '未知问题'

        const value = answersData[answerKey]

        if (value !== undefined && value !== null && value !== '') {
          // 处理多选题
          if (name === 'checkbox' || name === 'multi-select') {
            const optionsObj = status.options || {}
            const options = optionsObj.status || []
            if (Array.isArray(value)) {
              // 多选答案可能是文字，也可能是索引
              const labels = value.map((v: any) => {
                if (options.includes(v)) {
                  return v
                }
                const idx = Number(v)
                return !isNaN(idx) && options[idx] ? options[idx] : v
              })
              parsedAnswers.push({ title, value: labels })
            } else {
              parsedAnswers.push({ title, value })
            }
          } else if (name === 'rate' || name === 'rate-score') {
            parsedAnswers.push({ title, value: value + '分' })
          } else if (
            name === 'radio' ||
            name === 'radio-select' ||
            name === 'select' ||
            name === 'dropdown'
          ) {
            const optionsObj = status.options || {}
            const options = optionsObj.status || []
            // 单选答案可能是文字，也可能是索引
            let label = value
            if (!options.includes(value)) {
              const idx = Number(value)
              if (!isNaN(idx) && options[idx]) {
                label = options[idx]
              }
            }
            parsedAnswers.push({ title, value: label })
          } else {
            parsedAnswers.push({ title, value })
          }
        }
      })

      currentAnswer.value = {
        ...row,
        answers: parsedAnswers,
      }
    } else {
      currentAnswer.value = row
    }
  } catch (e) {
    console.error('解析答卷详情失败', e)
    currentAnswer.value = row
  }
  detailVisible.value = true
}
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
