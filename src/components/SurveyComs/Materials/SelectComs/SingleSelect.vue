<template>
  <div :class="{ 'text-center': computedStatus.position }">
    <MaterialsHeader
      :title="computedStatus.title"
      :serialNum="serialNum"
      :desc="computedStatus.desc"
      :titleSize="computedStatus.titleSize"
      :descSize="computedStatus.descSize"
      :titleWeight="computedStatus.titleWeight"
      :descWeight="computedStatus.descWeight"
      :titleItalic="computedStatus.titleItalic"
      :descItalic="computedStatus.descItalic"
      :titleColor="computedStatus.titleColor"
      :descColor="computedStatus.descColor"
    />
    <div class="radio-group">
      <el-radio-group>
        <el-radio v-for="(item, index) in computedStatus.options" :value="item" :key="index">{{
          item
        }}</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import MaterialsHeader from '@/components/SurveyComs/Common/MaterialsHeader.vue'
import type { OptionsStatus } from '@/types'
import {
  getTextStatus,
  getStringStatus,
  getCurrentStatus,
  getStringStatusByCurrentStatus,
} from '@/utils'
const props = defineProps<{
  serialNum: number
  status: OptionsStatus
}>()

const computedStatus = computed(() => ({
  title: getTextStatus(props.status.title),
  desc: getTextStatus(props.status.desc),
  options: getStringStatus(props.status.options),
  position: getCurrentStatus(props.status.position),
  titleSize: getStringStatusByCurrentStatus(props.status.titleSize),
  descSize: getStringStatusByCurrentStatus(props.status.descSize),
  titleWeight: getCurrentStatus(props.status.titleWeight),
  descWeight: getCurrentStatus(props.status.descWeight),
  titleItalic: getCurrentStatus(props.status.titleItalic),
  descItalic: getCurrentStatus(props.status.descItalic),
  titleColor: getTextStatus(props.status.titleColor),
  descColor: getTextStatus(props.status.descColor),
}))
</script>

<style lang="sass" scoped></style>
