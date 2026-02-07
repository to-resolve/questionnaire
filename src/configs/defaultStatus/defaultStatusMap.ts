// 默认状态的映射表
import SingleSelectDefaultStatus from './SingleSelect.ts'
import SinglePicSelectDefaultStatus from './SinglePicSelect.ts'
import TextNote from './TextNote.ts'
import TextInput from './TextInput.ts'

export const defaultStatusMap = {
  'single-select': SingleSelectDefaultStatus,
  'single-pic-select': SinglePicSelectDefaultStatus,
  'personal-info-gender': SingleSelectDefaultStatus,
  'personal-info-education': SingleSelectDefaultStatus,
  'text-input': TextInput,
  'text-note': TextNote,
}
