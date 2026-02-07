import { isSurveyComName, type Status } from '@/types'
import { computed } from 'vue'

export function useSurveyNo(coms: Status[]) {
  return computed(() => {
    let questionNumber = 1
    return coms.map((com) => {
      if (isSurveyComName(com.name)) {
        return questionNumber++
      }
      return null
    })
  })
}
