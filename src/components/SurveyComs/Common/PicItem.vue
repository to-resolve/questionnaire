<template>
  <div @click.stop>
    <div class="container mb-10">
      <div class="top flex justify-content-center align-items-center">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          name="image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
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
import { Upload } from '@element-plus/icons-vue'
import { ref, inject, watch } from 'vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { GetLink } from '@/types'
const props = defineProps({
  picTitle: {
    type: String,
    default: '',
  },
  picDesc: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  index: {
    type: Number,
    default: 0,
  },
})

const getLink = inject<GetLink>('getLink', () => {})
const imageUrl = ref('')

watch(
  () => props.value,
  async (newVal) => {
    if (newVal) {
      const response = await fetch(newVal)
      const blob = await response.blob()
      const file = new File([blob], 'image.jpg', { type: blob.type })
      imageUrl.value = URL.createObjectURL(file)
    } else {
      imageUrl.value = ''
    }
  },
  {
    immediate: true,
  },
)
const handleAvatarSuccess: UploadProps['onSuccess'] = async (response) => {
  if (getLink) {
    getLink({
      index: props.index,
      link: response.imageUrl,
    })
  }
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不要超过2MB!')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
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
