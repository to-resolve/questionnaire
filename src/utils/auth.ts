import { ElMessageBox } from 'element-plus'
import router from '@/router'

const TOKEN_KEY = 'ACCESS_TOKEN'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 解析 JWT Token，提取 Payload 中的用户id
 * @returns { id: number, username: string } | null
 */
export const parseToken = () => {
  const token = getToken()
  if (!token) return null
  try {
    // 去掉 Bearer 前缀
    const pureToken = token.startsWith('Bearer ') ? token.slice(7) : token
    // JWT 结构：header.payload.signature，解码 payload 部分
    const payload = pureToken.split('.')[1]
    // Base64 解码（注意：浏览器原生 atob 不支持 Unicode，需处理）
    const decoded = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(decoded).id
  } catch (error) {
    console.error('Token 解析失败', error)
    return null
  }
}

let isRelogin = false

export const handleUnauthorized = async () => {
  if (isRelogin) return
  isRelogin = true

  try {
    await ElMessageBox.alert('登录状态已失效，请重新登录', '提示', {
      confirmButtonText: '重新登录',
      type: 'warning',
      closeOnClickModal: false,
      closeOnPressEscape: false,
    })
  } finally {
    removeToken()
    router.replace('/login')
    isRelogin = false
  }
}
