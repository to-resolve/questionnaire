import type { ComponentMap } from '@/types'
import { markRaw } from 'vue'
// 引入业务组件
import SingleSelect from '@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'
import SinglePicSelect from '@/components/SurveyComs/Materials/SelectComs/SinglePicSelect.vue'
import TextNote from '@/components/SurveyComs/Materials/NoteComs/TextNote.vue'
// 引入编辑组件
import TitleEditor from '@/components/SurveyComs/Editltems/TitleEditor.vue'
import DescEditor from '@/components/SurveyComs/Editltems/DescEditor.vue'
import PositionEditor from '@/components/SurveyComs/Editltems/PositionEditor.vue'
import SizeEditor from '@/components/SurveyComs/Editltems/SizeEditor.vue'
import WeightEditor from '@/components/SurveyComs/Editltems/WeightEditor.vue'
import ItalicEditor from '@/components/SurveyComs/Editltems/ItalicEditor.vue'
import TextTypeEditor from '@/components/SurveyComs/Editltems/TextTypeEditor.vue'
import OptionsEditor from '@/components/SurveyComs/Editltems/OptionsEditor.vue'
import PicOptionsEditor from '@/components/SurveyComs/Editltems/PicOptionsEditor.vue'

export const componentMap: ComponentMap = {
  // 业务组件
  'single-select': markRaw(SingleSelect),
  'single-pic-select': markRaw(SinglePicSelect),
  'text-note': markRaw(TextNote),
  'personal-info-gender': markRaw(SingleSelect),
  'personal-info-education': markRaw(SingleSelect),
  // 编辑组件
  'title-editor': markRaw(TitleEditor),
  'desc-editor': markRaw(DescEditor),
  'position-editor': markRaw(PositionEditor),
  'options-editor': markRaw(OptionsEditor),
  'size-editor': markRaw(SizeEditor),
  'weight-editor': markRaw(WeightEditor),
  'italic-editor': markRaw(ItalicEditor),
  'text-type-editor': markRaw(TextTypeEditor),
  'pic-options-editor': markRaw(PicOptionsEditor),
}
