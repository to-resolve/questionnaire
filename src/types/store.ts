import type { TextProps, OptionsProps, PicLink, Status } from '@/types'
import type { VueComType } from './common'

export type SurveyComName =
  | 'single-select'
  | 'single-pic-select'
  | 'personal-info-gender'
  | 'personal-info-education'
  | 'text-input'

// 业务组件类型(题目类型 + 非题目类型)
export type Material = SurveyComName | 'text-note'

export type EditComName =
  | 'title-editor'
  | 'desc-editor'
  | 'position-editor'
  | 'size-editor'
  | 'weight-editor'
  | 'italic-editor'
  | 'text-type-editor'
  | 'pic-options-editor'
  | 'options-editor'

export type componentName = Material | EditComName

export type ComponentMap = {
  [key in componentName]: VueComType
}

export interface Actions {
  setTextStatus: (TextProps: TextProps, text: string) => void
  addOption: (optionsProps: OptionsProps) => void
  removeOption: (optionProps: OptionsProps, index: number) => number
  setPosition: (positionProps: OptionsProps, index: number) => void
  setSize: (sizeProps: OptionsProps, index: number) => void
  setWeight: (weightProps: OptionsProps, index: number) => void
  setItalic: (italicProps: OptionsProps, index: number) => void
  setColor: (colorProps: TextProps, color: string) => void
  setPicLinkByIndex: (optionProps: OptionsProps, payload: PicLink) => void
}

export interface MaterialStore extends Actions {
  currentMaterialCom: Material
  coms: Record<Material, Status>
  setCurrentSurveyCom: (com: Material) => void
}

export const SurveyComNameArr = [
  'single-select',
  'single-pic-select',
  'personal-info-gender',
  'personal-info-education',
]

export function isSurveyComName(value: string): value is SurveyComName {
  return SurveyComNameArr.includes(value as SurveyComName)
}

const PDFComs = [
  'single-select',
  'single-pic-select',
  'personal-info-gender',
  'personal-info-education',
  'text-note',
]

export function canUsedForPDF(value: string): boolean {
  return PDFComs.includes(value)
}

export type QuizData = {
  surveyCount: number
  coms: Status[]
}
