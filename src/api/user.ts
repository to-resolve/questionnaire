import { request } from './request'

// 根据用户id查询用户信息
export async function getUserInfoByUserId(userId: number) {
  const data = await request.get('/user', { userId })
  return data
}

// 修改用户信息
export async function updateUserInfoByUserId(param: {}) {
  const data = await request.put('/user', param)
  return data
}

// 获取用户列表
export async function getUserList(params?: any) {
  const data = await request.get('/user/list', params)
  return data
}

// 添加用户
export async function addUser(param: any) {
  const data = await request.post('/user', param)
  return data
}

// 删除用户
export async function deleteUser(userId: number) {
  const data = await request.delete(`/user/${userId}`)
  return data
}

// 用户注册
export async function registerUser(param: { username: string; password: string }) {
  const data = await request.post('/register', param)
  return data
}
