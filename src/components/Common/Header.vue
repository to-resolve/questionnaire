<template>
  <div>
    <div class="container flex self-start align-items-center border-box">
      <div class="left flex justify-content-center align-items-center">
        <el-button type="primary" plain :icon="ArrowLeft" circle size="small" @click="goToHome" />
      </div>
      <div class="center flex align-items-center space-between pl-15 pr-15">
        <div v-if="isEditor">
          <div v-if="id">
            <el-button type="warning" size="small" @click="updateSurvey">更新问卷</el-button>
          </div>
          <div v-else>
            <el-button type="danger" size="small" @click="reset">重置问卷</el-button>
            <el-button type="success" size="small" @click="saveSurvey">保存问卷</el-button>
          </div>
        </div>
        <div>
          <el-button type="primary" size="small" @click="preview">预览</el-button>
        </div>
      </div>
      <div class="right flex justify-content-center align-items-center">
        <el-avatar :size="30" :src="avatar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/useEditor'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const store = useEditorStore()

const props = defineProps({
  isEditor: {
    type: Boolean,
    requirde: true,
  },
  id: {
    type: String,
    default: '',
  },
})

const goToHome = () => {
  localStorage.setItem('activeView', 'home')
  router.push('/')
}
const avatar = ref('https://avatars.githubusercontent.com/u/12345678?v=4')

const reset = () => {
  ElMessageBox.confirm('确定要重置问卷吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store.resetComs()
      ElMessage.success('重置问卷成功')
    })
    .catch(() => {
      ElMessage.info('已取消重置')
    })
}

const saveSurvey = (date?: string) => {
  if (date) {
    ElMessageBox.prompt('请输入要保存的问卷标题', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    })
      .then(({ value }) => {
        const surveyToSave = {
          createDate: new Date().getTime(),
          updateDate: new Date().getTime(),
          title: value,
          surveyCount: store.surveyCount,
          coms: JSON.parse(JSON.stringify(store.coms)),
        }
        store
          .saveComs(surveyToSave)
          .then((id) => {
            router.push({
              path: `/preview/${id}`,
              state: { from: 'editor' },
            })
            ElMessage.success('保存问卷成功')
          })
          .catch(() => {
            ElMessage.error('保存问卷失败')
          })
      })
      .catch(() => {
        ElMessage.info('已取消保存')
      })
  } else {
    ElMessageBox.prompt('请输入要保存的问卷标题', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    })
      .then(({ value }) => {
        const surveyToSave = {
          createDate: new Date().getTime(),
          updateDate: new Date().getTime(),
          title: value,
          surveyCount: store.surveyCount,
          coms: JSON.parse(JSON.stringify(store.coms)),
        }
        store
          .saveComs(surveyToSave)
          .then((id) => {
            router.push(`/editor/${id}/survey-type`)
            ElMessage.success('保存问卷成功')
          })
          .catch(() => {
            ElMessage.error('保存问卷失败')
          })
      })
      .catch(() => {
        ElMessage.info('已取消保存')
      })
  }
}

const updateSurvey = () => {
  ElMessageBox.confirm('是否确定更新问卷?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store
        .updateComs(Number(props.id), {
          updateDate: new Date().getTime(),
          surveyCount: store.surveyCount,
          coms: JSON.parse(JSON.stringify(store.coms)),
        })
        .then(() => {
          ElMessage.success('更新问卷成功')
        })
        .catch(() => {
          ElMessage.error('更新问卷失败')
        })
    })
    .catch(() => {
      ElMessage.error('更新问卷失败')
    })
}

const preview = () => {
  ElMessageBox.confirm('预览会保存问卷，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      if (props.id) {
        router.push({
          path: `/preview/${props.id}`,
          state: { from: 'editor' },
        })
        store
          .updateComs(Number(props.id), {
            updateDate: new Date().getTime(),
            surveyCount: store.surveyCount,
            coms: JSON.parse(JSON.stringify(store.coms)),
          })
          .then(() => {
            ElMessage.success('保存问卷成功')
          })
          .catch(() => {
            ElMessage.error('保存问卷失败')
          })
      } else {
        saveSurvey('editor')
      }
    })
    .catch(() => {
      ElMessage.info('已取消预览')
    })
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--border-color);
  .left {
    width: 60px;
    height: 100%;
  }
  .center {
    flex: 1;
    height: 100%;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  .right {
    width: 80px;
    height: 100%;
  }
}
</style>
