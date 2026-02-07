// 业务组件
import TextNote from '@/components/SurveyComs/Materials/NoteComs/TextNote.vue'

// 编辑组件
import TitleEditor from '@/components/SurveyComs/Editltems/TitleEditor.vue'
import DescEditor from '@/components/SurveyComs/Editltems/DescEditor.vue'
import ColorEditor from '@/components/SurveyComs/Editltems/ColorEditor.vue'
import PositionEditor from '@/components/SurveyComs/Editltems/PositionEditor.vue'
import ItalicEditor from '@/components/SurveyComs/Editltems/ItalicEditor.vue'
import WeightEditor from '@/components/SurveyComs/Editltems/WeightEditor.vue'
import SizeEditor from '@/components/SurveyComs/Editltems/SizeEditor.vue'
import TextTypeEditor from '@/components/SurveyComs/Editltems/TextTypeEditor.vue'
import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default function () {
  return {
    type: markRaw(TextNote),
    name: 'text-note',
    id: uuidv4(),
    status: {
      type: {
        id: uuidv4(),
        status: ['标题', '段落'],
        isShow: true,
        currentStatus: 1,
        name: 'text-type-editor',
        editCom: markRaw(TextTypeEditor),
      },
      title: {
        id: uuidv4(),
        status: '备注说明标题',
        isShow: false,
        name: 'title-editor',
        editCom: markRaw(TitleEditor),
      },
      desc: {
        id: uuidv4(),
        status: '备注说明描述',
        isShow: true,
        name: 'desc-editor',
        editCom: markRaw(DescEditor),
      },
      position: {
        id: uuidv4(),
        currentStatus: 0,
        status: ['左对齐', '居中对齐'],
        isShow: true,
        name: 'position-editor',
        editCom: markRaw(PositionEditor),
      },
      titleSize: {
        id: uuidv4(),
        currentStatus: 0,
        status: ['22', '20', '18'],
        isShow: false,
        name: 'size-editor',
        editCom: markRaw(SizeEditor),
      },
      descSize: {
        id: uuidv4(),
        currentStatus: 0,
        status: ['16', '14', '12'],
        isShow: true,
        name: 'size-editor',
        editCom: markRaw(SizeEditor),
      },
      titleWeight: {
        id: uuidv4(),
        currentStatus: 1,
        status: ['加粗', '正常'],
        isShow: false,
        name: 'weight-editor',
        editCom: markRaw(WeightEditor),
      },
      descWeight: {
        id: uuidv4(),
        currentStatus: 1,
        status: ['加粗', '正常'],
        isShow: true,
        name: 'weight-editor',
        editCom: markRaw(WeightEditor),
      },
      titleItalic: {
        id: uuidv4(),
        currentStatus: 1,
        status: ['斜体', '正常'],
        isShow: false,
        name: 'italic-editor',
        editCom: markRaw(ItalicEditor),
      },
      descItalic: {
        id: uuidv4(),
        currentStatus: 1,
        status: ['斜体', '正常'],
        isShow: true,
        name: 'italic-editor',
        editCom: markRaw(ItalicEditor),
      },
      titleColor: {
        id: uuidv4(),
        status: '#000',
        isShow: false,
        name: 'color-editor',
        editCom: markRaw(ColorEditor),
      },
      descColor: {
        id: uuidv4(),
        status: '#909399',
        isShow: true,
        name: 'color-editor',
        editCom: markRaw(ColorEditor),
      },
    },
  }
}
