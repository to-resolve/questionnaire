import { request } from './request'

// 根据用户id查询用户信息
export async function getUserInfoByUserId(userId: number) {
  const data = await request.get('/user', { userId })
  return data
}

// 修改用户信息
export async function updateUserInfoByUserId(param) {
  const data = await request.put('/user', param)
  return data
}
