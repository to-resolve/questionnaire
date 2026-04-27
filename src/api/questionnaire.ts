import { request } from './request'
import type { addSurveyData, updateSurveyData } from '@/types'

// 根据用户id查询问卷
export async function getSurveyListByUserId(userId: number, id?: number) {
  // GET请求：路径参数写法（拼接在URL中）
  const data = await request.get('/survey', { userId, id })
  return data
}

// 根据用户id分页查询问卷
export async function getSurveyPageListByUserId(param: {}) {
  const data = await request.get('/survey/page', param)
  return data
}

// 新增问卷
export async function addSurvey(survey: addSurveyData) {
  // POST请求：数据放在请求体（body）中
  const data = await request.post<{ id: number }>(
    '/survey', // 请求地址
    survey, // 请求体数据（必填）
  )
  return data
}

// 删除问卷
export async function deleteSurvey(id: number, userId: number) {
  const data = await request.delete('/survey', { id, userId })
  return data
}

// 更新问卷
export async function updateSurvey(param: updateSurveyData) {
  const data = await request.put('/survey', param)
  return data
}

// 撤销发布问卷
export async function unpublishSurvey(surveyId: number) {
  const data = await request.put(`/survey/unpublish/${surveyId}`)
  return data
}

// 获取所有已发布的问卷（市场）
export async function getPublishedSurveyList(params: {
  page: number
  pageSize: number
  title?: string
}) {
  const data = await request.get('/survey/all/published', params)
  return data
}

// 获取问卷回答统计数据
export async function getSurveyAnalysis(surveyId: number) {
  const data = await request.get(`/survey/analysis/${surveyId}`)
  return data
}

// 获取问卷提交详情列表
export async function getSurveyAnswerList(surveyId: number) {
  const data = await request.get(`/survey/answers/${surveyId}`)
  return data
}

// 获取试卷信息
export async function getQuiz(quizId: string | number) {
  const data = await request.get(`/getQuiz/${quizId}`)
  return data
}

// 提交答案
export async function submitAnswers(quizId: string | number, answers: any) {
  const data = await request.post('/submitAnswers', { quizId, answers })
  return data
}

// 获取所有问卷（管理员用）
export async function getAllSurveyList(params: {
  page: number
  pageSize: number
  title?: string
  status?: number
}) {
  const data = await request.get('/admin/survey/page', params)
  return data
}

// 删除问卷（管理员用）
export async function deleteSurveyAdmin(id: number) {
  const data = await request.delete(`/admin/survey/${id}`)
  return data
}

// 撤销发布问卷（管理员用）
export async function unpublishSurveyAdmin(surveyId: number) {
  const data = await request.put(`/admin/survey/unpublish/${surveyId}`)
  return data
}
