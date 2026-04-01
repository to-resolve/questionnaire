import type { Status } from './common'

export interface updateSurveyData {
  id: number
  userId: number
  surveyCount?: number
  coms?: string
  title?: string
  description?: string
  status?: number
}

export interface addSurveyData {
  title: string
  surveyCount: number
  // coms: Status[]
  coms: string
  status: number
  description: string
  userId: number
}

export interface SurveyDBData extends addSurveyData {
  createTime: number
  updateTime: number
}

export interface SurveyDBReturnData extends SurveyDBData {
  id: number
}
