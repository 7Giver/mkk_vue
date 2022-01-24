import request from '@/utils/request'


// 删除设备
export function deleteDeviceById(data) {
  return request({
    url: '/deviceState/deleteDeviceById',
    method: 'post',
    data: data
  })
}

// 设备绑定银联商户或终端
export function deviceBindMerchant(data) {
  return request({
    url: '/deviceState/deviceBindMerchant',
    method: 'post',
    data: data
  })
}

// 查询设备状态
export function listDeviceState(data) {
  return request({
    url: '/deviceState/listDeviceState',
    method: 'post',
    data: data
  })
}

// 根据id查询设备状态
export function listDeviceStateById(data) {
  return request({
    url: '/deviceState/listDeviceStateById',
    method: 'post',
    data: data
  })
}

