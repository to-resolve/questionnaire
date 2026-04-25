<template>
  <div class="auth-wrapper">
    <!-- 动态背景装饰 -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="auth-container">
      <div class="auth-content glass-effect">
        <!-- 左侧装饰宣传区 -->
        <div class="auth-decoration">
          <div class="decoration-inner">
            <div class="logo-wrapper">
              <el-icon class="floating-icon"><Document /></el-icon>
            </div>
            <h1 class="brand-name">易问卷平台</h1>
            <p class="brand-slogan">专业 · 高效 · 智能</p>

            <div class="feature-list">
              <div class="feature-item">
                <div class="icon-box">
                  <el-icon><MagicStick /></el-icon>
                </div>
                <div class="text">
                  <h4>AI 智能辅助</h4>
                  <p>一键生成问卷，节省 80% 时间</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="icon-box">
                  <el-icon><DataLine /></el-icon>
                </div>
                <div class="text">
                  <h4>实时数据分析</h4>
                  <p>多维图表展示，洞察核心价值</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧表单区 -->
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">欢迎回来</h2>
            <p class="auth-desc">登录您的账号以继续</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="auth-form"
            label-position="top"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <template #label>
                <span class="custom-label">用户名</span>
              </template>
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>

            <el-form-item prop="password">
              <template #label>
                <span class="custom-label">密码</span>
              </template>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false" @click="handleForgetPwd"
                >忘记密码？</el-link
              >
            </div>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="auth-btn"
                :loading="isLoading"
                @click="handleLogin"
              >
                登 录
              </el-button>
            </el-form-item>

            <div class="auth-footer">
              还没有账号？
              <el-link type="primary" class="bold-link" @click="handleRegister">立即注册</el-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { userLogin } from '@/api/login'
import { useRouter } from 'vue-router'
import { setToken } from '@/utils/auth'
import { User, Lock, Document, MagicStick, DataLine } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref()
const isLoading = ref<boolean>(false)
const rememberMe = ref<boolean>(false)

const loginForm = reactive({
  username: 'admin',
  password: '@ABCDasd123',
})

const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const handleLogin = async () => {
  if (!loginFormRef.value) return
  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      isLoading.value = true
      userLogin({ username: loginForm.username, password: loginForm.password })
        .then((res: any) => {
          isLoading.value = false
          if (res && res.code === 200) {
            setToken(res.data.token)
            ElMessage.success('欢迎回来！')
            router.push('/')
          } else {
            ElMessage.error(res.message || '登录失败')
          }
        })
        .catch(() => {
          isLoading.value = false
        })
    }
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleForgetPwd = () => ElMessage.info('功能开发中...')
const handleRegister = () => router.push('/register')
</script>

<style lang="scss" scoped>
.auth-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f8;
  overflow: hidden;
}

/* 动态背景装饰 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    z-index: 0;
    opacity: 0.6;
    animation: move 20s infinite alternate;
  }

  .blob-1 {
    width: 400px;
    height: 400px;
    background: #409eff;
    top: -100px;
    right: -100px;
  }

  .blob-2 {
    width: 350px;
    height: 350px;
    background: #7ef1b6;
    bottom: -50px;
    left: -50px;
    animation-delay: -5s;
  }

  .blob-3 {
    width: 300px;
    height: 300px;
    background: #ffcc33;
    top: 40%;
    left: 30%;
    opacity: 0.3;
    animation-delay: -10s;
  }
}

@keyframes move {
  from {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  to {
    transform: translate(100px, 50px) rotate(90deg) scale(1.1);
  }
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

.auth-content {
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  min-height: 600px;
}

/* 左侧装饰区 */
.auth-decoration {
  flex: 1.2;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.9) 0%, rgba(30, 128, 255, 0.9) 100%);
  padding: 60px;
  color: #fff;
  display: flex;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://img.alicdn.com/tfs/TB1S_9Xrvb2gK0jSZKDIuxt7XXa-120-120.png');
    opacity: 0.05;
    pointer-events: none;
  }
}

.decoration-inner {
  position: relative;
  z-index: 1;

  .logo-wrapper {
    margin-bottom: 24px;
    .floating-icon {
      font-size: 48px;
      animation: float 4s ease-in-out infinite;
    }
  }

  .brand-name {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 10px;
    letter-spacing: 2px;
  }

  .brand-slogan {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 50px;
  }
}

.feature-list {
  .feature-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;

    .icon-box {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      font-size: 24px;
    }

    .text {
      h4 {
        font-size: 18px;
        margin: 0 0 5px;
        font-weight: 600;
      }
      p {
        font-size: 14px;
        opacity: 0.8;
        margin: 0;
      }
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* 右侧卡片区 */
.auth-card {
  flex: 1;
  padding: 60px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-header {
  margin-bottom: 40px;
  .auth-title {
    font-size: 28px;
    color: #1a1a1a;
    margin: 0 0 10px;
    font-weight: 700;
  }
  .auth-desc {
    color: #666;
    font-size: 15px;
  }
}

.auth-form {
  .custom-label {
    font-weight: 600;
    color: #444;
  }

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    padding: 5px 15px;
    transition: all 0.3s;
    border: 1px solid transparent;

    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 1px #409eff;
      background: #fff;
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.auth-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(90deg, #409eff, #1e80ff);
  border: none;
  box-shadow: 0 10px 20px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(64, 158, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.auth-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #666;

  .bold-link {
    font-weight: 700;
    margin-left: 5px;
  }
}

/* 响应式 */
@media (max-width: 992px) {
  .auth-content {
    flex-direction: column;
    width: 450px;
    margin: 0 auto;
  }
  .auth-decoration {
    display: none;
  }
  .auth-card {
    padding: 40px;
  }
}

@media (max-width: 480px) {
  .auth-content {
    width: 100%;
    border-radius: 16px;
  }
  .auth-card {
    padding: 30px 20px;
  }
}
</style>
