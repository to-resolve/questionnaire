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
  const data = await request.delete(`/survey`, { id, userId })
  return data
}

// 更新问卷
export async function updateSurvey(param: updateSurveyData) {
  const data = await request.put('/survey', param)
  return data
}
