import { ElMessage, ElMessageBox } from 'element-plus'

import { addSurvey, deleteSurvey, updateSurvey } from '@/api/questionnaire'
import { parseToken } from './auth'

import type { EditorStore, surveyInfo } from '@/types'

// 保存试卷
export function save(store: EditorStore, surveyForm: surveyInfo) {
  return new Promise((resolve, reject) => {
    const surveyToSave = {
      title: surveyForm.title,
      surveyCount: store.surveyCount,
      coms: JSON.stringify(store.coms),
      status: 0,
      description: surveyForm.description,
      userId: parseToken(),
    }
    addSurvey(surveyToSave)
      .then((res) => {
        resolve(res.data.id)
        ElMessage({
          type: 'success',
          message: '保存成功',
        })
      })
      .catch((e) => {
        reject(e)
        console.log('保存失败')
      })
  })
}

// 更新试卷
export function update(store: EditorStore, id: number) {
  return new Promise((resolve, reject) => {
    updateSurvey({
      id,
      userId: parseToken(),
      surveyCount: store.surveyCount,
      coms: JSON.stringify(store.coms),
    })
      .then(() => {
        resolve(void 0)
        ElMessage({
          type: 'success',
          message: '更新成功',
        })
        store.setCurrentComponentIndex(-1)
      })
      .catch((e) => {
        reject(e)
        console.log('取消更新')
      })
  })
}

// 删除试卷
export function remove(id: number, userId: number) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm('确定删除该问卷吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        deleteSurvey(id, userId)
          .then(() => {
            resolve(void 0)
            ElMessage.success('删除成功')
          })
          .catch((e) => {
            reject(e)
            console.log('保存失败')
          })
      })
      .catch(() => {
        console.log('取消删除')
      })
  })
}
