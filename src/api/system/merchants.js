import request from '@/utils/request'

// 删除银联商户
export function deleteUnionPayMerchant(data) {
  return request({
    url: '/unionPayMerchant/deleteUnionPayMerchant',
    method: 'post',
    data: data
  })
}

// 设备绑定银联商户或终端
export function deviceBindMerchant(data) {
  return request({
    url: '/unionPayMerchant/deviceBindMerchant',
    method: 'post',
    data: data
  })
}

// 生成银联商户二维码
export function generateUnionPayMerchantQRCode(data) {
  return request({
    url: '/unionPayMerchant/generateUnionPayMerchantQRCode',
    method: 'post',
    data: data
  })
}

// 获取组织下所有银联商户
export function listAllUnionPayMerchant(data) {
  return request({
    url: '/unionPayMerchant/listAllUnionPayMerchant',
    method: 'post',
    data: data
  })
}

// 分页获取银联商户
export function listPageUnionPayMerchant(data) {
  return request({
    url: '/unionPayMerchant/listPageUnionPayMerchant',
    method: 'post',
    data: data
  })
}

// 保存银联商户
export function submitUnionPayMerchant(data) {
  return request({
    url: '/unionPayMerchant/submitUnionPayMerchant',
    method: 'post',
    data: data
  })
}
