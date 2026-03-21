import { defineStore } from 'pinia'
import type { AiSurveyData } from '@/api/aiSurvey'

export interface AiChatMessage {
  role: 'user' | 'ai'
  content?: string
  status?: 'loading' | 'success' | 'error'
  data?: AiSurveyData
}

/**
 * AI 建卷页：聊天记录
 */
export const useAiSurveyStore = defineStore('aiSurvey', {
  state: () => ({
    messages: [] as AiChatMessage[],
  }),
  actions: {
    clearMessages() {
      this.messages = []
    },
  },
})
