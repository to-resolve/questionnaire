<template>
  <div class="flex align-items-center space-between">
    <div class="flex align-items-center">
      <div class="mr-20">{{ title }}</div>
      <div class="currentStatus">{{ status }}</div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.currentStatus {
  color: var(--info-color);
  font-size: var(--font-size-base);
}
</style>
