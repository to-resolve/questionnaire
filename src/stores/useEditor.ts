// 存储画布状态

import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import textNoteDefaultStatus from '@/configs/defaultStatus/TextNote'
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
import type { TypeStatus, Status, SurveyDBData } from '@/types'
import { isSurveyComName } from '@/types'
import TextTypeEditor from '@/components/SurveyComs/Editltems/TextTypeEditor.vue'
import TitleEditor from '@/components/SurveyComs/Editltems/TitleEditor.vue'
import DescEditor from '@/components/SurveyComs/Editltems/DescEditor.vue'
import PositionEditor from '@/components/SurveyComs/Editltems/PositionEditor.vue'
import SizeEditor from '@/components/SurveyComs/Editltems/SizeEditor.vue'
import WeightEditor from '@/components/SurveyComs/Editltems/WeightEditor.vue'
import ItalicEditor from '@/components/SurveyComs/Editltems/ItalicEditor.vue'
import ColorEditor from '@/components/SurveyComs/Editltems/ColorEditor.vue'
import { deleteSurvey, getSurveyById, saveSurvey, updateSurvey } from '@/db/operation'

// 初始化仓库的状态
const initStore = () =>
  [
    Object.assign({}, textNoteDefaultStatus(), {
      status: <TypeStatus>{
        type: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['标题', '段落'],
          isShow: true,
          editCom: markRaw(TextTypeEditor),
          name: 'text-type-editor',
        },
        title: {
          id: uuidv4(),
          status: '问卷标题',
          isShow: true,
          editCom: markRaw(TitleEditor),
          name: 'title-editor',
        },
        desc: {
          id: uuidv4(),
          status: '默认描述内容',
          isShow: false,
          editCom: DescEditor,
          name: 'desc-editor',
        },
        position: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['左对齐', '居中对齐'],
          isShow: false,
          editCom: markRaw(PositionEditor),
          name: 'position-editor',
        },
        titleSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['26', '24', '22'],
          isShow: true,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        descSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['16', '14', '12'],
          isShow: false,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        titleWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: true,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        descWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: false,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        titleItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: true,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        descItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: false,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        titleColor: {
          id: uuidv4(),
          status: '#000',
          isShow: true,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
        descColor: {
          id: uuidv4(),
          status: '#909399',
          isShow: false,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
      },
    }),
    Object.assign({}, textNoteDefaultStatus(), {
      status: <TypeStatus>{
        type: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['标题', '段落'],
          isShow: true,
          editCom: markRaw(TextTypeEditor),
          name: 'text-type-editor',
        },
        title: {
          id: uuidv4(),
          status: '默认标题内容',
          isShow: false,
          editCom: markRaw(TitleEditor),
          name: 'title-editor',
        },
        desc: {
          id: uuidv4(),
          status:
            '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧！',
          isShow: true,
          editCom: markRaw(DescEditor),
          name: 'desc-editor',
        },
        position: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['左对齐', '居中对齐'],
          isShow: true,
          editCom: markRaw(PositionEditor),
          name: 'position-editor',
        },
        titleSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['26', '24', '22'],
          isShow: false,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        descSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['16', '14', '12'],
          isShow: true,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        titleWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: false,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        descWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: true,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        titleItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: false,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        descItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: true,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        titleColor: {
          id: uuidv4(),
          status: '#000',
          isShow: false,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
        descColor: {
          id: uuidv4(),
          status: '#909399',
          isShow: true,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
      },
    }),
  ] as unknown as Status[]

export const useEditorStore = defineStore('editor', {
  state: () => ({
    currentComponentIndex: -1, // 当前选择的组件索引
    surveyCount: 0, // 问卷题目的数量
    coms: initStore() as Status[], // 问卷题目的数组
  }),
  actions: {
    setTextStatus,
    addOption,
    removeOption,
    setPosition,
    setSize,
    setWeight,
    setItalic,
    setColor,
    setPicLinkByIndex,
    addCom(newComs: Status) {
      this.coms.push(newComs)
      this.currentComponentIndex = -1
      if (isSurveyComName(newComs.name)) this.surveyCount++
    },
    setCurrentComponentIndex(index: number) {
      this.currentComponentIndex = index
    },
    removeCom(index: number) {
      if (isSurveyComName(this.coms[index].name)) {
        this.surveyCount--
      }
      this.coms.splice(index, 1)
    },
    resetComs() {
      this.coms = initStore() as Status[]
      this.currentComponentIndex = -1
      this.surveyCount = 0
    },
    saveComs(data: SurveyDBData) {
      return saveSurvey(data)
    },
    setStore(data: SurveyDBData) {
      this.coms = data.coms
      this.surveyCount = data.surveyCount
      this.currentComponentIndex = -1
    },
    updateComs(id: number, data: Partial<SurveyDBData>) {
      return updateSurvey(id, data)
    },
    getSurveyById(id: number) {
      return getSurveyById(id)
    },
    deleteComs(id: number) {
      return deleteSurvey(id)
    },
  },
})
