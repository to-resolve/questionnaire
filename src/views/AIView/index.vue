<template>
  <div class="ai-chat-container">
    <!-- 头部区域 (可选，Gemini 也有简洁的头部) -->
    <div class="chat-header" v-if="messages.length === 0">
      <div class="welcome-section">
        <el-icon class="ai-icon"><MagicStick /></el-icon>
        <h1 class="main-title">AI 智能建卷</h1>
        <p class="sub-title">描述您的需求，AI 为您一键生成专业问卷</p>
      </div>
    </div>

    <!-- 对话展示区 -->
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(msg, index) in messages" :key="index" :class="['message-item', msg.role]">
        <div class="message-avatar">
          <el-icon v-if="msg.role === 'ai'"><MagicStick /></el-icon>
          <el-avatar
            v-else
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
        </div>
        <div class="message-content">
          <!-- 用户消息 -->
          <div v-if="msg.role === 'user'" class="user-text">
            {{ msg.content }}
          </div>

          <!-- AI 消息 - 加载中 -->
          <div v-else-if="msg.status === 'loading'" class="ai-loading">
            <div class="typing-indicator"><span></span><span></span><span></span></div>
            <div class="loading-steps">
              <div
                v-for="(step, sIdx) in loadingSteps"
                :key="sIdx"
                :class="['step-item', { active: activeStep >= sIdx }]"
              >
                {{ step }}
              </div>
            </div>
          </div>

          <!-- AI 消息 - 生成结果 -->
          <div v-else-if="msg.role === 'ai' && msg.data" class="ai-response">
            <el-card class="preview-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <div class="header-left">
                    <el-icon><View /></el-icon>
                    <span class="header-text">生成结果预览</span>
                  </div>
                  <div class="header-actions">
                    <el-button type="primary" link :icon="Check" @click="importToEditor(msg.data)">
                      导入并设计
                    </el-button>
                  </div>
                </div>
              </template>

              <div class="preview-content">
                <div class="survey-info">
                  <h2 class="survey-title">{{ msg.data.title }}</h2>
                  <p class="survey-desc">{{ msg.data.description }}</p>
                </div>

                <div class="question-list">
                  <div v-for="(q, qIdx) in msg.data.questions" :key="qIdx" class="question-item">
                    <div class="q-header">
                      <span class="q-num">{{ qIdx + 1 }}.</span>
                      <span class="q-title">{{ q.title }}</span>
                      <el-tag size="small" type="info" class="q-type">{{ q.type }}</el-tag>
                    </div>
                    <div class="q-options" v-if="q.options && q.options.length > 0">
                      <div v-for="(opt, optIndex) in q.options" :key="optIndex" class="opt-item">
                        <div class="opt-indicator"></div>
                        <span>{{ opt }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div :class="['input-section', { 'is-empty': messages.length === 0 }]">
      <div class="input-container">
        <!-- 预设建议 -->
        <div class="suggestions-wrapper" v-if="messages.length === 0">
          <div class="suggestion-tags">
            <div
              v-for="tag in suggestions"
              :key="tag"
              class="suggestion-tag"
              @click="useSuggestion(tag)"
            >
              {{ tag }}
            </div>
          </div>
        </div>

        <div class="input-wrapper">
          <el-input
            v-model="prompt"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 6 }"
            placeholder="问问 AI，帮您创建问卷..."
            resize="none"
            @keydown.enter.prevent="handleEnter"
            :disabled="generating"
          />
          <div class="input-actions">
            <el-tooltip effect="light" content="发送" placement="top">
              <el-button
                type="primary"
                circle
                :loading="generating"
                :icon="MagicStick"
                @click="generateSurvey"
                :disabled="!prompt.trim()"
              />
            </el-tooltip>
          </div>
        </div>
        <div class="input-tip">AI 可能会产生错误。请检查重要信息。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { MagicStick, View, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/useEditor'
import { ElMessage } from 'element-plus'
import { getAiSurvey } from '@/api/aiSurvey'
import { defaultStatusMap } from '@/configs/defaultStatus/defaultStatusMap'

const router = useRouter()
const editorStore = useEditorStore()

const prompt = ref('')
const generating = ref(false)
const activeStep = ref(0)
const messageContainer = ref<HTMLElement | null>(null)

interface Question {
  title: string
  type: string
  options?: string[]
}

interface SurveyData {
  title: string
  description: string
  questions: Question[]
}

interface Message {
  role: 'user' | 'ai'
  content?: string
  status?: 'loading' | 'success' | 'error'
  data?: SurveyData
}

const messages = ref<Message[]>([])

const suggestions = [
  '帮我出一份关于员工福利满意度的调查表',
  '我想做一个咖啡消费习惯的市场调研',
  '针对大学生网课质量的反馈问卷',
  '新产品内测阶段的用户体验调查',
]

const loadingSteps = ['正在分析需求...', '正在规划结构...', '正在编写题目...']

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTo({
      top: messageContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

const useSuggestion = (tag: string) => {
  prompt.value = tag
}

const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) return
  generateSurvey()
}

const generateSurvey = async () => {
  if (!prompt.value.trim() || generating.value) return

  const userContent = prompt.value
  messages.value.push({ role: 'user', content: userContent })
  prompt.value = ''
  generating.value = true
  activeStep.value = 0

  // 添加 AI 加载状态消息
  messages.value.push({ role: 'ai', status: 'loading' })
  await scrollToBottom()

  // 模拟进度
  const interval = setInterval(() => {
    if (activeStep.value < 2) {
      activeStep.value++
    }
  }, 1000)

  try {
    const res = await getAiSurvey({ content: userContent })
    if (res.code === 200) {
      // 更新最后一条 AI 消息
      const lastMsg = messages.value[messages.value.length - 1]
      lastMsg.status = 'success'
      lastMsg.data = res.data
      activeStep.value = 3
    }
  } catch (error) {
    console.error('AI生成失败:', error)
    const lastMsg = messages.value[messages.value.length - 1]
    lastMsg.status = 'error'
    lastMsg.content = '抱歉，生成问卷时遇到了错误，请稍后再试。'
  } finally {
    clearInterval(interval)
    generating.value = false
    await scrollToBottom()
  }
}

const typeMap: Record<string, string> = {
  单选题: 'single-select',
  多选题: 'multi-select',
  下拉选择: 'option-select',
  单选图片: 'single-pic-select',
  多选图片: 'multi-pic-select',
  单行输入: 'text-input',
  多行输入: 'text-input',
  评分: 'rate-score',
  日期: 'date-time',
  备注: 'text-note',
  radio: 'single-select',
  checkbox: 'multi-select',
  select: 'option-select',
  input: 'text-input',
  rate: 'rate-score',
  date: 'date-time',
  note: 'text-note',
}

const importToEditor = (data: any) => {
  editorStore.initStore()

  if (editorStore.coms[0]?.status.title) {
    editorStore.coms[0].status.title.status = data.title
  }
  if (editorStore.coms[1]?.status.desc) {
    editorStore.coms[1].status.desc.status = data.description
    editorStore.coms[1].status.desc.isShow = true
  }

  data.questions.forEach((q: any) => {
    let typeKey = q.type
    if (!defaultStatusMap[typeKey as keyof typeof defaultStatusMap]) {
      typeKey = typeMap[q.type] || q.type
    }

    const createStatus = defaultStatusMap[typeKey as keyof typeof defaultStatusMap]
    if (createStatus) {
      const newCom = createStatus()
      if (newCom.status.title) {
        newCom.status.title.status = q.title
      }
      if (q.options && q.options.length > 0 && newCom.status.options) {
        newCom.status.options.status = [...q.options]
        if (typeKey === 'rate-score') {
          newCom.status.options.isUse = true
        }
      }
      editorStore.addCom(editorStore.coms, newCom)
    }
  })

  ElMessage.success('导入成功')
  router.push({
    path: '/editor/survey-type',
    query: { source: 'ai' },
  })
}
</script>

<style scoped lang="scss">
.ai-chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f4f9; // 区分侧边栏和头部的背景色
  position: relative;
  overflow: hidden;

  .chat-header {
    flex-shrink: 0;
    padding: 6vh 20px 2vh; // 减少内边距，确保一屏显示
    display: flex;
    justify-content: center;

    .welcome-section {
      text-align: center;
      max-width: 600px;

      .ai-icon {
        font-size: 48px;
        color: #4285f4;
        margin-bottom: 16px;
      }

      .main-title {
        font-size: 32px;
        font-weight: 500;
        color: #1f1f1f;
        margin: 0 0 12px;
      }

      .sub-title {
        font-size: 16px;
        color: #444746;
      }
    }
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4f9;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 4px;
    }

    .message-item {
      width: 100%;
      max-width: 800px;
      padding: 24px 20px;
      display: flex;
      gap: 16px;
      animation: fadeIn 0.3s ease-out;

      &.user {
        background-color: transparent;
      }

      &.ai {
        background-color: transparent;
      }

      .message-avatar {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          font-size: 24px;
          color: #4285f4;
        }
      }

      .message-content {
        flex: 1;
        font-size: 16px;
        line-height: 1.6;
        color: #1f1f1f;

        .user-text {
          white-space: pre-wrap;
          padding-top: 4px;
        }

        .ai-loading {
          .typing-indicator {
            display: flex;
            gap: 4px;
            margin-bottom: 12px;
            span {
              width: 8px;
              height: 8px;
              background: #4285f4;
              border-radius: 50%;
              opacity: 0.4;
              animation: blink 1.4s infinite both;
              &:nth-child(2) {
                animation-delay: 0.2s;
              }
              &:nth-child(3) {
                animation-delay: 0.4s;
              }
            }
          }
          .loading-steps {
            font-size: 14px;
            color: #707070;
            .step-item {
              margin-bottom: 4px;
              opacity: 0.5;
              transition: all 0.3s;
              &.active {
                opacity: 1;
                color: #4285f4;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }

  .input-section {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(transparent, #f0f4f9 30%); // 与新背景色匹配
    pointer-events: none;

    &.is-empty {
      position: relative;
      background: transparent;
      padding-top: 0;
      margin-top: auto; // 确保在中间时有一定的间距
    }

    .input-container {
      width: 100%;
      max-width: 800px;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .suggestions-wrapper {
        .suggestion-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;

          .suggestion-tag {
            padding: 8px 16px;
            background: #fff;
            border: 1px solid #dee1e5;
            border-radius: 100px;
            font-size: 14px;
            color: #444746;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background: #f1f3f4;
              border-color: #bdc1c6;
            }
          }
        }
      }

      .input-wrapper {
        background: #fff;
        border-radius: 28px;
        padding: 8px 8px 8px 24px;
        display: flex;
        align-items: flex-end;
        transition: box-shadow 0.2s;

        &:focus-within {
          box-shadow:
            0 1px 2px 0 rgba(60, 64, 67, 0.3),
            0 1px 3px 1px rgba(60, 64, 67, 0.15);
        }

        :deep(.el-textarea__inner) {
          border: none;
          background: transparent;
          box-shadow: none;
          padding: 8px 0;
          font-size: 16px;
          color: #1f1f1f;
          &::placeholder {
            color: #444746;
          }
        }

        .input-actions {
          padding-bottom: 4px;
          padding-right: 4px;
          .el-button {
            width: 40px;
            height: 40px;
            border: none;
            background: transparent;
            color: #4285f4;
            font-size: 24px;
            &:hover {
              background: rgba(66, 133, 244, 0.1);
            }
            &.is-disabled {
              color: #bdc1c6;
            }
          }
        }
      }

      .input-tip {
        text-align: center;
        font-size: 12px;
        color: #707070;
        margin-bottom: 8px;
      }
    }
  }

  .preview-card {
    border: 1px solid #dee1e5;
    border-radius: 16px;
    overflow: hidden;

    :deep(.el-card__header) {
      background-color: #f8fafd;
      padding: 12px 20px;
      border-bottom: 1px solid #dee1e5;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: #1f1f1f;
      }
    }

    .preview-content {
      max-height: 500px;
      overflow-y: auto;
      padding: 20px;

      .survey-info {
        margin-bottom: 24px;
        .survey-title {
          font-size: 20px;
          margin: 0 0 8px;
        }
        .survey-desc {
          font-size: 14px;
          color: #444746;
        }
      }

      .question-item {
        margin-bottom: 20px;
        .q-header {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          .q-num {
            font-weight: bold;
          }
          .q-title {
            flex: 1;
            font-weight: 500;
          }
        }
        .q-options {
          padding-left: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          .opt-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            .opt-indicator {
              width: 14px;
              height: 14px;
              border: 1px solid #bdc1c6;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
