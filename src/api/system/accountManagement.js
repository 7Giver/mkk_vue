import request from '@/utils/request'
import request2 from '@/utils/request2'
// 用户批量删除
export function accountListDelete(data) {
  return request({
    url: '/account/accountListDelete',
    method: 'post',
    data: data
  })
}

// 账户注册
export function accountRegister(data) {
  return request({
    url: '/account/accountRegister',
    method: 'post',
    data: data
  })
}

// 账户详情
export function accountTagDetail(data) {
  return request({
    url: '/account/accountTagDetail',
    method: 'post',
    data: data
  })
}

// 人脸注册
export function faceRegister(data) {
  return request({
    url: '/account/faceRegister',
    method: 'post',
    data: data
  })
}

// 人脸批量注册
export function faceRegisterBatch(data) {
  return request({
    url: '/account/faceRegisterBatch',
    method: 'post',
    data: data
  })
}

// 导入账户信息
export function importFileAccountInfo(data) {
  return request({
    url: '/account/importFileAccountInfo',
    method: 'post',
    data: data
  })
}

// 人脸录入分页查询
export function listAccountPageByOrg(data) {
  return request({
    url: '/account/listAccountPageByOrg',
    method: 'post',
    data: data
  })
}

// 添加或修改账户
export function submitAccountInfo(data) {
  return request({
    url: '/account/submitAccountInfo',
    method: 'post',
    data: data
  })
}

export function timeLimitFileListUpload(fd) {
  return request2({
    url: '/timeLimitFileListUpload',
    method: 'post',
    data: fd,
    baseURL: 'http://172.19.242.52:4000/fileServer/',
  });
}
