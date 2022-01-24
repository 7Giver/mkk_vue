import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/union/user/',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/union/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/union/user',
    method: 'patch',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/union/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(data) {
  return request({
    url: '/union/user/restPassword',
    method: 'patch',
    data: data
  })
}

