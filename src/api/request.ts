import axios, { AxiosError } from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus' // 假设使用 Element Plus 作为UI库
import { getToken, handleUnauthorized } from '@/utils/auth'

// 定义响应数据的通用类型（适配后台系统通用返回格式）
interface ApiResponse<T = any> {
  code: number // 业务状态码（如200成功/401未授权）
  msg: string // 提示信息
  data: T // 实际响应数据
}

// 创建Axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量读取基础接口地址
  timeout: 120000, // 120秒请求超时
  headers: {
    'Content-Type': 'application/json;charset=utf-8', // 默认JSON请求格式
  },
})

// 防止重复弹窗
let isHandling401 = false

// ===================== 请求拦截器 =====================
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    return config
  },
  (error: AxiosError) => {
    ElMessage.error('请求发送失败，请检查网络')
    return Promise.reject(error)
  },
)

// ===================== 响应拦截器 =====================
service.interceptors.response.use(
  async (response: AxiosResponse<ApiResponse>): Promise<AxiosResponse<ApiResponse>> => {
    const res = response.data

    // ===== 业务错误统一处理 =====
    if (res.code !== 200) {
      switch (res.code) {
        case 401:
          if (!isHandling401) {
            isHandling401 = true
            await handleUnauthorized()
            isHandling401 = false
          }
          break

        case 403:
          ElMessage.warning(res.msg || '暂无操作权限')
          break

        case 404:
          ElMessage.error(res.msg || '接口不存在')
          break

        default:
          ElMessage.error(res.msg || '操作失败')
      }

      return Promise.reject(res)
    }

    // ===== 业务成功 =====
    return response
  },
  (error: AxiosError): Promise<AxiosError> => {
    // HTTP网络错误/状态码非2xx的处理
    console.error('【响应拦截器错误】', error)

    let errorMsg = '请求失败'
    // 分类处理不同类型的网络错误
    if (error.code === 'ECONNABORTED') {
      errorMsg = '请求超时，请稍后重试'
    } else if (error.code === 'ERR_NETWORK') {
      errorMsg = '网络异常，请检查网络连接'
    } else if (error.response) {
      // 有响应但状态码非2xx（如500/400）
      const status = error.response.status
      errorMsg = `请求错误 [${status}]：${error.response.statusText}`
    }

    ElMessage.error(errorMsg)
    return Promise.reject(error)
  },
)

// ===================== 通用请求方法封装 =====================
const request = {
  /**
   * 基础请求方法（封装后自动提取data字段，简化使用）
   * @param config Axios请求配置
   * @returns Promise<ApiResponse<T>> 直接返回后端数据
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await service.request<ApiResponse<T>>(config)
      return response.data
    } catch (error) {
      throw error // 抛出错误供业务层捕获处理
    }
  },

  // GET请求快捷方法
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'get', params, ...config })
  },

  // POST请求快捷方法
  post<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'post', data, ...config })
  },

  // PUT请求快捷方法
  put<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'put', data, ...config })
  },

  // DELETE请求快捷方法
  delete<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'delete', params, ...config })
  },
}

// 导出核心对象（按需使用）
export default service // 原始Axios实例（特殊场景使用）
export { request } // 封装后的请求方法（推荐使用）
export type { ApiResponse } // 响应类型（业务层可复用）
