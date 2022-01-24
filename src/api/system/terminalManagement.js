import request from '@/utils/request'

// 删除银联终端
export function deleteUnionPayTerminal(data) {
  return request({
    url: '/unionPayTerminal/deleteUnionPayTerminal',
    method: 'post',
    data: data
  })
}


// 生成银联终端二维码
export function generateUnionPayTerminalQRCode(data) {
  return request({
    url: '/unionPayTerminal/generateUnionPayTerminalQRCode',
    method: 'post',
    data: data
  })
}

// 批量导入银联终端
export function importUnionPayTerminal(data) {
  return request({
    url: '/unionPayTerminal/importUnionPayTerminal',
    method: 'post',
    data: data
  })
}

// 获取可以绑定的终端
export function listAvailableUnionPayTerminal(data) {
  return request({
    url: '/unionPayTerminal/listAvailableUnionPayTerminal',
    method: 'post',
    data: data
  })
}

// 分页获取银联终端
export function listPageUnionPayTerminal(data) {
  return request({
    url: '/unionPayTerminal/listPageUnionPayTerminal',
    method: 'post',
    data: data
  })
}

// 保存银联终端
export function submitUnionPayTerminal(data) {
  return request({
    url: '/unionPayTerminal/submitUnionPayTerminal',
    method: 'post',
    data: data
  })
}

