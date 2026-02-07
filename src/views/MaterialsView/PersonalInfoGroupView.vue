<template>
  <Layout>
    <RouterLink
      class="link-item mb-15"
      exact-active-class="link-item-active"
      to="/personal-info-gender"
      >性别
    </RouterLink>
    <RouterLink
      class="link-item mb-15"
      exact-active-class="link-item-active"
      to="/personal-info-education"
      >学历
    </RouterLink>
  </Layout>
</template>

<script lang="ts" setup>
import Layout from './Layout.vue'
</script>

<style scoped lang="scss"></style>
