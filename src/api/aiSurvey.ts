import { request } from './request'

export interface AiQuestion {
  title: string
  type: string
  options: string[]
}

export interface AiSurveyData {
  title: string
  description: string
  questions: AiQuestion[]
}

// 获取智能问卷
export async function getAiSurvey(param: { content: string }) {
  const data = await request.post<AiSurveyData>('/ai/survey', param)
  return data
}
