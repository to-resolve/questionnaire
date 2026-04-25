<template>
  <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
    <div class="logo">
      <span v-if="!isCollapse">易问卷平台</span>
      <span v-else>问卷</span>
    </div>

    <el-menu
      :collapse="isCollapse"
      :default-active="currentRoute"
      router
      background-color="#ffffff"
      text-color="#303133"
      active-text-color="#409eff"
      class="menu"
    >
      <el-menu-item index="/home">
        <el-icon><House /></el-icon>
        <template #title>首页</template>
      </el-menu-item>

      <el-sub-menu index="materials-market">
        <template #title>
          <el-icon><Grid /></el-icon>
          <span>资源市场</span>
        </template>
        <el-menu-item index="/materials">
          <el-icon><Briefcase /></el-icon>
          <template #title>组件市场</template>
        </el-menu-item>
        <el-menu-item index="/market">
          <el-icon><Shop /></el-icon>
          <template #title>问卷市场</template>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="questionnaire">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>问卷管理</span>
        </template>
        <el-menu-item index="/editor/survey-type">
          <el-icon><Plus /></el-icon>
          <template #title>创建问卷</template>
        </el-menu-item>
        <el-menu-item index="/home">
          <el-icon><Tickets /></el-icon>
          <template #title>问卷列表</template>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/aiSurvey">
        <el-icon><MagicStick /></el-icon>
        <template #title>智能问卷</template>
      </el-menu-item>

      <el-menu-item index="/personal">
        <el-icon><User /></el-icon>
        <template #title>个人中心</template>
      </el-menu-item>

      <el-menu-item index="/user-management" v-if="userInfo.username === 'admin'">
        <el-icon><Setting /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
    </el-menu>

    <div class="user-info" v-if="!isCollapse">
      <el-avatar :size="40" :src="userInfo.avatar" />
      <div class="user-details">
        <div class="username">{{ userInfo.username }}</div>
        <div class="role">{{ userInfo.nickname }}</div>
      </div>
    </div>

    <div class="collapse-btn" @click="toggle">
      <el-icon>
        <ArrowLeft v-if="!isCollapse" />
        <ArrowRight v-else />
      </el-icon>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  House,
  Grid,
  Document,
  Plus,
  Tickets,
  User,
  MagicStick,
  Setting,
  Shop,
  Briefcase,
} from '@element-plus/icons-vue'
import { getUserInfoByUserId } from '@/api/user'
import { parseToken } from '@/utils/auth'

const route = useRoute()
// 从 LocalStorage 读取初始状态，默认为 false
const isCollapse = ref(localStorage.getItem('sidebarCollapse') === 'true')

// 当前激活的路由
const currentRoute = computed(() => {
  return route.path
})

// 用户信息
const userInfo = ref({
  username: '',
  nickname: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
})

// 获取用户信息
const getUserInfo = async () => {
  const response = await getUserInfoByUserId(parseToken())
  if (response && response.code === 200) {
    userInfo.value.avatar = response.data.avatar
    userInfo.value.username = response.data.username
    userInfo.value.nickname = response.data.nickname
  }
}

const toggle = () => {
  isCollapse.value = !isCollapse.value
  // 保存状态到 LocalStorage
  localStorage.setItem('sidebarCollapse', isCollapse.value.toString())
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.aside {
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  border-right: 1px solid #ebeef5;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #409eff;
  border-bottom: 1px solid #ebeef5;
}

.menu {
  border: none;
  flex: 1;
}

.menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

.menu :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #ebeef5;
}

.user-details {
  margin-left: 10px;
  overflow: hidden;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-btn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid #ebeef5;
  color: #909399;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

/* 打印样式 */
@media print {
  .aside {
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
}
</style>
