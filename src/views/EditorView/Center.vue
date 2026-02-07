<template>
  <div ref="centerContainer" class="center-container">
    <draggable v-model="store.coms" item-key="index" @start="draStart">
      <template #item="{ element, index }">
        <div
          class="content mb-10 relative"
          :class="{
            active: store.currentComponentIndex === index,
          }"
          @click="clickHandle(index)"
          :key="element.id"
          :ref="(el) => (componentsRefs[index] = el)"
        >
          <component :is="element.type" :status="element.status" :serialNum="serialNum[index]" />
          <div class="absolute delete-btn" v-show="store.currentComponentIndex === index">
            <el-button
              type="danger"
              size="small"
              circle
              class="ml-10"
              :icon="Close"
              @click.stop="removeCom(index)"
            />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { computed, nextTick, ref, type ComponentPublicInstance } from 'vue'
import { useEditorStore } from '@/stores/useEditor'
const store = useEditorStore()
import EventBus from '@/utils/eventBus'
// 拖动组件
import draggable from 'vuedraggable'

import { useSurveyNo } from '@/utils/hooks'
import { ElMessage, ElMessageBox } from 'element-plus'
const serialNum = computed(() => useSurveyNo(store.coms).value)

const centerContainer = ref<HTMLElement | null>(null)
const componentsRefs = ref<(Element | ComponentPublicInstance | null)[]>([])

const scrollToButtom = () => {
  nextTick(() => {
    const container = centerContainer.value
    if (container) {
      // console.log('111')
      window.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      })
    }
  })
}

const scrollToCenter = (index: number) => {
  nextTick(() => {
    const element = componentsRefs.value[index]
    if (element instanceof HTMLElement) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  })
}

EventBus.on('scrollToButtom', scrollToButtom)
EventBus.on('scrollToCenter', scrollToCenter)

const clickHandle = (index: number) => {
  if (store.currentComponentIndex === index) {
    store.setCurrentComponentIndex(-1)
  } else {
    store.setCurrentComponentIndex(index)
  }
}

const draStart = () => {
  store.setCurrentComponentIndex(-1)
}

const removeCom = (index: number) => {
  ElMessageBox.confirm('确定删除该题目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store.removeCom(index)
      store.setCurrentComponentIndex(-1)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
</script>

<style scoped>
.center-container {
  width: 50%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  margin: 70px auto;
  padding: 20px;
  background: var(--white);
  position: relative;
  .content {
    cursor: pointer;
    padding: 10px;
    background-color: var(--white);
    border-radius: var(--border-radius-sm);
    &:hover {
      transform: scale(1.01);
      transition: 0.5s;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  }
}
.active {
  transform: scale(1.01);
  transition: 0.5s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.delete-btn {
  right: -5px;
  top: -10px;
}
</style>
