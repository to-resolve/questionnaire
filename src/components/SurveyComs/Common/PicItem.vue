<template>
  <div @click.stop>
    <div class="container mb-10">
      <div class="top flex justify-content-center align-items-center">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          name="image"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else>
            <el-icon><Upload /></el-icon>
            添加图片
          </div>
        </el-upload>
      </div>
      <div
        class="bottom flex justify-content-center align-items-center flex-direction-column font-weight-500"
      >
        <div class="item">{{ picTitle }}</div>
        <div class="desc mt-5 mb-5">{{ picDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import type { GetLink } from '@/types'
import { getToken } from '@/utils/auth'
const props = defineProps({
  picTitle: {
    type: String,
    default: '选项',
  },
  picDesc: {
    type: String,
    default: '说明（选填，限24字）',
  },
  value: {
    type: String,
    default: null,
  },
  index: {
    type: Number,
    default: 0,
  },
})
const imageUrl = ref('')
// 预览的时候不会有注入，所以需要设置默认值
const getPicLink = inject<GetLink>('getPicLink', () => {})

// 添加请求头
const uploadHeaders = ref({
  Authorization: `Bearer ${getToken()}`,
})

watch(
  () => props.value,
  (newVal) => {
    if (newVal) {
      imageUrl.value = newVal
    } else {
      imageUrl.value = ''
    }
  },
  { immediate: true },
)

const handleAvatarSuccess: UploadProps['onSuccess'] = async (response) => {
  if (response.code === 200) {
    if (getPicLink)
      getPicLink({
        index: props.index,
        link: response.data,
      })
    ElMessage.success('图片上传成功！')
  } else {
    ElMessage.error(response.message || '图片上传失败')
  }
}

// 图片上传失败回调
const handleAvatarError = () => {
  ElMessage.error('图片上传失败，请稍后重试！')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请选择图片格式的文件（jpg/png/gif 等）！')
    return false
  }
  const isLt5M = rawFile.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB！')
    return false
  }
  return true
}
</script>

<style scoped>
.container {
  width: 200px;
  height: 300px;
  border: 1px solid var(--font-color-lightest);
  border-radius: var(--border-radius-md);
  color: var(--font-color-light);
  > .top {
    width: 100%;
    height: 200px;
    background-color: var(--font-color-lightest);
  }
  > .bottom {
    height: 100px;
    font-size: var(--font-size-lg);
    > .desc {
      font-size: var(--font-size-base);
      color: var(--font-color-light);
    }
  }
}
.avatar {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
