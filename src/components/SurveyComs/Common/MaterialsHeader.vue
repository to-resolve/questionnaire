<template>
  <div>
    <div class="container mb-15">
      <h2 class="title font-weight-400" :style="{ fontSize: titleSize + 'px', color: titleColor }">
        <span class="mr-10">{{ serialNum }}.</span>
        <span
          :class="{
            'font-bold': !titleWeight,
            'font-italic': !titleItalic,
          }"
          >{{ title }}</span
        >
      </h2>
      <div
        class="desc"
        :class="{
          'font-bold': !descWeight,
          'font-italic': !descItalic,
        }"
        :style="{ fontSize: descSize + 'px', color: descColor }"
      >
        {{ desc }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  serialNum: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  titleSize: {
    type: String,
    default: '22',
  },
  descSize: {
    type: String,
    default: '16',
  },
  titleWeight: {
    type: Number,
    default: 1,
  },
  descWeight: {
    type: Number,
    default: 1,
  },
  titleItalic: {
    type: Number,
    default: 1,
  },
  descItalic: {
    type: Number,
    default: 1,
  },
  titleColor: {
    type: String,
    default: '',
  },
  descColor: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss">
.container {
  > h2 {
    font-size: 20px;
  }
}
.desc {
  font-size: var(--font-size-base);
  color: var(--font-color-light);
  text-indent: 5px;
}
</style>
