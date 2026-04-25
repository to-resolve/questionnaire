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
            <h1 class="brand-name">加入我们</h1>
            <p class="brand-slogan">开启您的智能调研之旅</p>

            <div class="feature-list">
              <div class="feature-item">
                <div class="icon-box">
                  <el-icon><CircleCheckFilled /></el-icon>
                </div>
                <div class="text">
                  <h4>免费使用</h4>
                  <p>基础功能永久免费，即刻开始调研</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="icon-box">
                  <el-icon><Monitor /></el-icon>
                </div>
                <div class="text">
                  <h4>快捷制作问卷</h4>
                  <p>AI智能建卷，一键导入</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧表单区 -->
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">创建账号</h2>
            <p class="auth-desc">填入信息以完成注册</p>
          </div>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="auth-form"
            label-position="top"
            @submit.prevent="handleRegister"
          >
            <el-form-item prop="username">
              <template #label>
                <span class="custom-label">用户名</span>
              </template>
              <el-input
                v-model="registerForm.username"
                placeholder="建议包含字母与数字"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>

            <el-form-item prop="password">
              <template #label>
                <span class="custom-label">密码</span>
              </template>
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入登录密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <template #label>
                <span class="custom-label">确认密码</span>
              </template>
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次确认密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="auth-btn"
                :loading="isLoading"
                @click="handleRegister"
              >
                注 册
              </el-button>
            </el-form-item>

            <div class="auth-footer">
              已有账号？
              <el-link type="primary" class="bold-link" @click="goToLogin">立即登录</el-link>
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
import { useRouter } from 'vue-router'
import { User, Lock, Document, CircleCheckFilled, Monitor } from '@element-plus/icons-vue'
import { registerUser } from '../../api/user'

const router = useRouter()
const registerFormRef = ref()
const isLoading = ref<boolean>(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
})

const handleRegister = async () => {
  if (!registerFormRef.value) return
  try {
    const valid = await registerFormRef.value.validate()
    if (valid) {
      isLoading.value = true
      try {
        await registerUser({
          username: registerForm.username,
          password: registerForm.password,
        })
        ElMessage.success('注册成功！正在跳转至登录页...')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } catch (error: any) {
        ElMessage.error(error.message || '注册失败，请稍后重试')
      } finally {
        isLoading.value = false
      }
    }
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const goToLogin = () => router.push('/login')
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
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.9) 0%, rgba(64, 158, 255, 0.9) 100%);
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
