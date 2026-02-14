import { request } from './request'

// 登录
export async function userLogin(loginData: { username: string; password: string }) {
  const data = await request.post<{
    id: Number
    username: String
    nickname: String
    token: string
  }>('/login', loginData)
  return data
}
