// 题型面板的配置文件，配置题型信息
import { CircleCheck, Files, EditPen, ChatLineSquare, User, Message } from '@element-plus/icons-vue'

export const SurveyComsList = [
  {
    title: '选择题',
    icon: CircleCheck,
    list: [
      { materialName: 'single-select', comName: '单选题' },
      { materialName: 'single-pic-select', comName: '图片单选' },
    ],
  },
  {
    title: '文本输入',
    icon: EditPen,
    list: [{ materialName: 'text-input', comName: '文本输入' }],
  },
  {
    title: '备注说明',
    icon: ChatLineSquare,
    list: [{ materialName: 'text-note', comName: '备注说明' }],
  },
  {
    title: '个人信息',
    icon: User,
    list: [
      { materialName: 'personal-info-gender', comName: '性别' },
      { materialName: 'personal-info-education', comName: '学历' },
    ],
  },
]
