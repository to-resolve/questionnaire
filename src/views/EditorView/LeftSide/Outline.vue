<template>
  <div v-if="store.surveyCount">
    <draggable v-model="store.coms" item-key="index" @start="draStart">
      <template #item="{ element, index }">
        <div
          class="mb-10"
          v-show="isSurveyComName(element.name)"
          @click="clickHandle(index)"
          :class="{
            active: store.currentComponentIndex === index,
          }"
        >
          <div class="item">
            {{ serialNum[index] }}.
            {{
              element.status.title.status.length > 10
                ? element.status.title.status.substring(0, 9) + '...'
                : element.status.title.status
            }}
          </div>
        </div>
      </template>
    </draggable>
  </div>
  <div v-else class="tip flex align-items-center justify-content-center">请添加题目</div>
</template>

<script setup lang="ts">
import EventBus from '@/utils/eventBus'
import { isSurveyComName } from '@/types'
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useEditorStore } from '@/stores/useEditor'
const store = useEditorStore()

import { useSurveyNo } from '@/utils/hooks'
const serialNum = computed(() => useSurveyNo(store.coms).value)

const draStart = () => {
  store.setCurrentComponentIndex(-1)
}

const clickHandle = (index: number) => {
  if (store.currentComponentIndex === index) {
    store.setCurrentComponentIndex(-1)
  } else {
    store.setCurrentComponentIndex(index)
    EventBus.emit('scrollToCenter', index)
  }
}
</script>

<style scoped>
.item {
  /* outline: 1px solid black; */
  color: var(--font-color-light);
  font-size: var(--font-size-base);
  padding: 10px;
  cursor: pointer;
}
.tip {
  height: calc(100% - 50px);
}
.active {
  transform: scale(1.04);
  transition: 0.5s;
  background-color: var(--border-color);
  border-radius: var(--border-radius-lg);
}
</style>
