import type { VueComType } from './common'

export interface BaseProps {
  id: string
  isShow: boolean
  name: string
  editCom: VueComType
}

export type StringStatusArr = string[]
export type ValueStatusArr = Array<{ value: string; status: string }>
export type PicTitleDescStatusArr = Array<{
  picTitle: string
  picDesc: string
  value: string
}>

export interface TextProps extends BaseProps {
  status: string
}

export type optinsStatusArr = StringStatusArr | ValueStatusArr | PicTitleDescStatusArr

export interface OptionsProps extends BaseProps {
  status: optinsStatusArr
  currentStatus: number
}

export interface BaseStatus {
  title: TextProps
  desc: TextProps
  position: OptionsProps
  titleSize: OptionsProps
  descSize: OptionsProps
  titleWeight: OptionsProps
  descWeight: OptionsProps
  titleItalic: OptionsProps
  descItalic: OptionsProps
  titleColor: TextProps
  descColor: TextProps
}

export interface OptionsStatus extends BaseStatus {
  options: OptionsProps
}

export interface TypeStatus extends BaseStatus {
  type: OptionsProps
}

export function isOptionsStatus(status: BaseStatus): status is OptionsStatus {
  return 'options' in status
}

export function isTypeStatus(status: BaseStatus): status is TypeStatus {
  return 'type' in status
}

export function isStringArr(status: optinsStatusArr): status is string[] {
  return Array.isArray(status) && typeof status[0] === 'string'
}

export function isValueStatusArr(status: optinsStatusArr): status is ValueStatusArr {
  return (
    Array.isArray(status) &&
    typeof status[0] === 'object' &&
    'value' in status[0] &&
    'status' in status[0]
  )
}

export function isPicTitleDescStatusArr(status: optinsStatusArr): status is PicTitleDescStatusArr {
  return (
    Array.isArray(status) &&
    typeof status[0] === 'object' &&
    'picTitle' in status[0] &&
    'picDesc' in status[0] &&
    'value' in status[0]
  )
}

export type PicLink = { link: string; index: number }

export function isPicLink(obj: object): obj is PicLink {
  return 'link' in obj && 'index' in obj
}

export type GetLink = (obj: PicLink) => void

export type UpdateStatus = (
  configKey: string,
  payload?: number | string | boolean | PicLink,
) => void
