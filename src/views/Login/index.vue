<template>
  <div class="login-container">
    <!-- 登录卡片 -->
    <el-card class="login-card">
      <div class="login-header">
        <h2 class="login-title">问卷星平台</h2>
        <p class="login-desc">欢迎登录，开始创建您的问卷</p>
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            size="large"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            size="large"
            show-password
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item prop="captcha" v-if="showCaptcha">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              prefix-icon="el-icon-s-tools"
              size="large"
              style="width: 70%"
            />
            <div class="captcha-img" @click="refreshCaptcha">
              <!-- 验证码图片占位，实际项目中替换为真实接口 -->
              {{ captchaCode }}
            </div>
          </div>
        </el-form-item>

        <el-form-item class="form-actions">
          <el-link type="primary" @click="handleForgetPwd">忘记密码？</el-link>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="isLoading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="register-link">
          还没有账号？
          <el-link type="primary" @click="handleRegister">立即注册</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { userLogin } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import { setToken } from '@/utils/auth'
const router = useRouter()
const route = useRoute()

// 表单引用
const loginFormRef = ref()

// 加载状态
const isLoading = ref<boolean>(false)

// 是否显示验证码（可根据业务逻辑控制）
const showCaptcha = ref<boolean>(false)

// 验证码（实际项目中从后端获取）
const captchaCode = ref<string>('8A9S')

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: '@ABCDasd123',
  captcha: '',
})

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名/手机号', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' },
  ],
})

// 刷新验证码
const refreshCaptcha = () => {
  // 实际项目中调用验证码接口
  const chars = '0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaCode.value = code
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  // 表单验证
  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      isLoading.value = true

      userLogin({ username: loginForm.username, password: loginForm.password })
        .then((res: any) => {
          isLoading.value = false
          if (res && res.code === 200) {
            setToken(res.data.token)
            ElMessage.success('登录成功！')
            router.push('/')
          } else {
            ElMessage.error('登录失败')
          }
        })
        .catch(() => {
          isLoading.value = false
        })
    }
  } catch (error) {
    console.error('表单验证失败：', error)
  }
}

// 忘记密码
const handleForgetPwd = () => {
  ElMessage.info('跳转到忘记密码页面')
  // 实际项目中添加路由跳转逻辑
}

// 注册账号
const handleRegister = () => {
  ElMessage.info('跳转到注册页面')
  // 实际项目中添加路由跳转逻辑
}
</script>

<style scoped>
/* 登录页面容器 */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

/* 登录头部 */
.login-header {
  text-align: center;
  padding: 30px 0 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.login-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 登录表单 */
.login-form {
  padding: 0 30px 30px;
}

/* 验证码容器 */
.captcha-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.captcha-img {
  width: 28%;
  height: 50px;
  background-color: #f5f7fa;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #666;
  cursor: pointer;
  user-select: none;
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .login-card {
    margin: 0 10px;
  }

  .login-header {
    padding: 20px 0 15px;
  }

  .login-form {
    padding: 0 20px 20px;
  }
}
</style>
