import type { defineComponent } from 'vue'
import type { Material } from './material'
import type { OptionsProps, TextProps } from './editProps'

// 导出Vue组件类型
export type VueComType = ReturnType<typeof defineComponent>

export interface Status {
  type: VueComType
  name: Material
  id: string
  status: {
    [key: string]: TextProps | OptionsProps
  }
}
