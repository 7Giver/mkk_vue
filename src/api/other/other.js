import request from '@/utils/request'
//车号二维码
export function qrCode(id) {
  return request({
    url: '/other/qrCode/' + id,
    method: 'get'
  })
}

//班次和车辆
export function shuttlebusAndCar() {
  return request({
    url: '/other/shuttlebusAndCar',
    method: 'get'
  })
}

export function allCar() {
  return request({
    url: '/other/allCar',
    method: 'get'
  })
}

