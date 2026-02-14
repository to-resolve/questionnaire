<template>
  <el-dialog
    v-model="innerDialogVisible"
    title="请输入问卷信息"
    width="500px"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form
      ref="surveyFormRef"
      :model="surveyForm"
      :rules="surveyRules"
      label-width="80px"
      class="survey-form"
    >
      <el-form-item label="问卷标题" prop="title">
        <el-input
          v-model="surveyForm.title"
          placeholder="请输入问卷标题"
          clearable
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="问卷备注" prop="description">
        <el-input
          v-model="surveyForm.description"
          type="textarea"
          placeholder="请输入问卷备注（选填）"
          :rows="4"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitSurveyForm" :loading="submitLoading"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { save } from '@/utils/dboperate'
import { updateSurvey } from '@/api/questionnaire'
import type { EditorStore } from '@/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  store: {
    type: Object as () => EditorStore,
    default: () => ({}) as EditorStore,
  },
  isPreview: {
    type: Number,
    default: 0,
  },
  // 外部控制弹窗显示隐藏
  visible: {
    type: Boolean,
    default: false,
  },
  // 编辑场景下的回显数据
  initData: {
    type: Object as () => { title: string; description: string; id: number; userId: number },
    default: () => ({ title: '', description: '' }),
  },
})

// 定义 emit 事件
const emit = defineEmits(['update:visible', 'close', 'success'])

// 内部弹窗状态（解决 props 只读问题）
const innerDialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

const surveyFormRef = ref<InstanceType<typeof ElForm>>()
const submitLoading = ref(false) // 提交加载状态

// 表单数据
const surveyForm = reactive({
  title: '',
  description: '',
})

// 表单校验规则
const surveyRules = reactive({
  title: [
    { required: true, message: '请输入问卷标题', trigger: 'blur' },
    { min: 1, max: 50, message: '标题长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  description: [{ max: 200, message: '描述长度不超过 200 个字符', trigger: 'blur' }],
})

// 监听 props.visible 变化，实现弹窗打开/关闭时的逻辑
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 弹窗打开时，初始化表单数据
      initFormData()
    }
  },
  { immediate: true },
)

/**
 * 初始化表单数据（支持编辑回显）
 */
const initFormData = () => {
  // 重置表单
  resetForm()

  // 如果有初始化数据，进行回显
  if (props.initData && props.initData.title) {
    surveyForm.title = props.initData.title
    surveyForm.description = props.initData.description || ''
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  surveyForm.title = ''
  surveyForm.description = ''
  // 清空表单校验状态
  if (surveyFormRef.value) {
    surveyFormRef.value.clearValidate()
  }
  submitLoading.value = false
}

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  innerDialogVisible.value = false
}

/**
 * 弹窗关闭时的处理
 */
const handleDialogClose = () => {
  resetForm()
  emit('close')
}

/**
 * 提交表单
 */
const submitSurveyForm = async () => {
  // 先校验表单
  if (!surveyFormRef.value) return

  try {
    await surveyFormRef.value.validate() // 表单校验
    submitLoading.value = true

    if (props.isPreview === 0) {
      updateSurvey({
        id: props.initData.id,
        userId: props.initData.userId,
        title: surveyForm.title,
        description: surveyForm.description,
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '更新成功',
        })

        closeDialog()
        emit('success')
      })
      return
    }

    // 调用保存接口
    const id = await save(props.store, {
      title: surveyForm.title,
      description: surveyForm.description,
    })

    closeDialog() // 关闭弹窗
    emit('success', id) // 触发成功事件，传递 id

    // 根据是否预览跳转不同页面
    if (props.isPreview === 1) {
      router.push({
        path: `/preview/${id}`,
        state: { from: 'editor' },
      })
    } else {
      router.push(`/editor/${id}/survey-type`)
    }
  } catch (error) {
    // 表单校验失败
    ElMessage.error('请完善必填的问卷信息')
  } finally {
    submitLoading.value = false
  }
}

// 暴露方法供父组件调用
defineExpose({
  initFormData,
})
</script>

<style scoped lang="scss">
.survey-form {
  padding-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
