<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 右侧区域 -->
    <el-container direction="vertical" class="main-container">
      <!-- 顶栏 -->
      <el-header class="header">
        <Header :isEditor="isEditor" :id="editorId" />
      </el-header>

      <!-- 主内容 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Header from '@/components/Common/Header.vue'

const route = useRoute()
const isEditor = computed(() => route.path.startsWith('/editor'))
const editorId = computed(() => (route.params.id ? String(route.params.id) : undefined))
</script>

<style scoped>
.layout {
  height: 100vh;
  width: 100vw;
  min-width: 1200px;
  overflow: hidden;
}

/* 打印样式 */
@media print {
  .layout {
    min-width: 0 !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* 完全隐藏侧边栏和头部 */
  .aside,
  .header,
  .el-aside,
  .el-header {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    left: -9999px !important;
    top: -9999px !important;
  }

  /* 调整主容器布局 */
  .main-container {
    width: 100% !important;
    height: auto !important;
  }

  .el-container {
    height: auto !important;
  }

  .main {
    height: auto !important;
    overflow: visible !important;
  }
}

.el-container {
  height: 100%;
  width: 100%;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header {
  padding: 0;
  height: 60px !important;
  line-height: 50px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.main {
  padding: 20px;
  background: #f5f7fa;
  overflow: auto;
  flex: 1;
  height: calc(100vh - 50px);
}

:deep(.el-main) {
  padding: 0;
  height: 100%;
}

/* 主内容区域滚动条样式 */
.main::-webkit-scrollbar {
  width: 6px;
}

.main::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.main::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
