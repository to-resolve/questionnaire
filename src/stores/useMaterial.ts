import { defineStore } from 'pinia'
import { defaultStatusMap } from '@/configs/defaultStatus/defaultStatusMap'
import {
  setTextStatus,
  addOption,
  removeOption,
  setPosition,
  setSize,
  setWeight,
  setItalic,
  setColor,
  setPicLinkByIndex,
} from '@/stores/actions'
import { updateInitStatusBeforeAdd } from '@/utils'
import type { Material, Status } from '@/types'

// 需要初始化的业务组件
const keyToInit = ['personal-info-gender', 'personal-info-education'] as Material[]

const initializedStatus: { [key: string]: Status } = {}
keyToInit.forEach((key) => {
  const defaultStatus = defaultStatusMap[key]()
  updateInitStatusBeforeAdd(defaultStatus, key)
  initializedStatus[key] = defaultStatus
})

export const useMaterialStore = defineStore('materialStore', {
  state: () => ({
    currentMaterialCom: 'single-select', // 当前选中的业务组件
    // 所有的业务组件
    coms: {
      // 初始化时加载默认状态
      'single-select': defaultStatusMap['single-select'](),
      'single-pic-select': defaultStatusMap['single-pic-select'](),
      'text-input': defaultStatusMap['text-input'](),
      'text-note': defaultStatusMap['text-note'](),
      'personal-info-gender': initializedStatus['personal-info-gender'],
      'personal-info-education': initializedStatus['personal-info-education'],
    },
  }),
  actions: {
    setCurrentMaterislCom(comName: string) {
      this.currentMaterialCom = comName
    },
    setTextStatus,
    addOption,
    removeOption,
    setPosition,
    setSize,
    setWeight,
    setItalic,
    setColor,
    setPicLinkByIndex,
  },
})
