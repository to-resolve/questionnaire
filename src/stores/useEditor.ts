/**
 * 该仓库用于存储画布的状态
 */
import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import textNoteDefaultStatus from '@/configs/defaultStatus/TextNote'
import {
  addOption,
  removeOption,
  setPosition,
  setSize,
  setWeight,
  setItalic,
  setColor,
  setTextType,
  setTextStatus,
  setUse,
  setOptionsStatusByIndex,
  setPicLinkByIndex,
} from '@/stores/actions'
import type { TypeStatus, Status, SurveyDBData } from '@/types'
import { isSurveyComName } from '@/types'
import { restoreComponentStatus } from '@/utils'
import { v4 as uuidv4 } from 'uuid'
// 编辑器
import TextTypeEditor from '@/components/SurveyComs/EditItems/TextTypeEditor.vue'
import TitleEditor from '@/components/SurveyComs/EditItems/TitleEditor.vue'
import DescEditor from '@/components/SurveyComs/EditItems/DescEditor.vue'
import PositionEditor from '@/components/SurveyComs/EditItems/PositionEditor.vue'
import SizeEditor from '@/components/SurveyComs/EditItems/SizeEditor.vue'
import WeightEditor from '@/components/SurveyComs/EditItems/WeightEditor.vue'
import ItalicEditor from '@/components/SurveyComs/EditItems/ItalicEditor.vue'
import ColorEditor from '@/components/SurveyComs/EditItems/ColorEditor.vue'

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

// 历史记录快照类型
interface HistorySnapshot {
  coms: Status[]
  currentComponentIndex: number
  surveyCount: number
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    currentComponentIndex: -1, // 当前选中的组件（-1表示没有选中的组件）
    surveyCount: 0, // 用于对问题进行计数
    // 每个业务组件的状态，一开始有两个默认的业务组件
    coms: initStore(),
    // 撤销/重做历史栈
    undoStack: [] as HistorySnapshot[],
    redoStack: [] as HistorySnapshot[],
    // 最大历史记录数
    maxHistorySize: 50,
  }),
  actions: {
    setCurrentComponentIndex(index: number) {
      this.currentComponentIndex = index
    },
    // 新增一个业务组件
    addOption,
    removeOption,
    setPosition,
    setSize,
    setWeight,
    setItalic,
    setColor,
    setTextType,
    setTextStatus,
    setUse,
    setOptionsStatusByIndex,
    setPicLinkByIndex,
    // 新增题目的时候，也需要取消聚焦
    addCom(coms: Status[], newCom: Status) {
      // 保存快照
      this.saveSnapshot()
      coms.push(newCom)
      this.currentComponentIndex = -1
      if (isSurveyComName(newCom.name)) {
        this.surveyCount++
      }
    },
    removeCom(index: number): void {
      // 保存快照
      this.saveSnapshot()
      if (isSurveyComName(this.coms[index].name)) {
        this.surveyCount--
      }
      this.coms.splice(index, 1)
    },
    resetComs() {
      this.surveyCount = 0
      this.currentComponentIndex = -1
      this.coms = initStore()
      this.undoStack = []
      this.redoStack = []
    },
    // 还原已有问卷的仓库状态
    setStore(storeStatus: SurveyDBData) {
      this.surveyCount = storeStatus.surveyCount
      this.currentComponentIndex = -1
      // coms 可能是字符串（从数据库读取）或已经是对象数组（已被解析过）
      if (typeof storeStatus.coms === 'string') {
        this.coms = JSON.parse(storeStatus.coms) as Status[]
      } else {
        this.coms = storeStatus.coms as Status[]
      }
    },
    // 初始化仓库，有些时候仓库已经有状态了
    // 创建一个新的问卷的时候，需要初始化仓库
    initStore() {
      this.surveyCount = 0
      this.currentComponentIndex = -1
      this.coms = initStore()
      this.undoStack = []
      this.redoStack = []
    },
    // 保存快照
    saveSnapshot() {
      // 深拷贝当前状态
      const snapshot: HistorySnapshot = {
        coms: JSON.parse(JSON.stringify(this.coms)) as Status[],
        currentComponentIndex: this.currentComponentIndex,
        surveyCount: this.surveyCount,
      }

      this.undoStack.push(snapshot)

      // 限制撤销栈大小
      if (this.undoStack.length > this.maxHistorySize) {
        this.undoStack.shift()
      }

      // 每次有新操作时，清空重做栈
      this.redoStack = []
    },
    // 撤销
    undo() {
      if (this.undoStack.length === 0) return

      // 保存当前状态到重做栈
      const currentStatus: HistorySnapshot = {
        coms: JSON.parse(JSON.stringify(this.coms)) as Status[],
        currentComponentIndex: this.currentComponentIndex,
        surveyCount: this.surveyCount,
      }
      this.redoStack.push(currentStatus)

      // 弹出上一个状态并恢复组件引用
      const lastStatus = this.undoStack.pop()!
      this.coms = restoreComponentStatus(lastStatus.coms)
      this.currentComponentIndex = lastStatus.currentComponentIndex
      this.surveyCount = lastStatus.surveyCount
    },
    // 重做
    redo() {
      if (this.redoStack.length === 0) return

      // 保存当前状态到撤销栈
      const currentStatus: HistorySnapshot = {
        coms: JSON.parse(JSON.stringify(this.coms)) as Status[],
        currentComponentIndex: this.currentComponentIndex,
        surveyCount: this.surveyCount,
      }
      this.undoStack.push(currentStatus)

      // 弹出下一个状态并恢复组件引用
      const nextStatus = this.redoStack.pop()!
      this.coms = restoreComponentStatus(nextStatus.coms)
      this.currentComponentIndex = nextStatus.currentComponentIndex
      this.surveyCount = nextStatus.surveyCount
    },
  },
})
