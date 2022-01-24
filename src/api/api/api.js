import request from '@/utils/request'

// personSubscribe
export function personSubscribe(data) {
  return request({
    url: '/app/accountSubscribe/personSubscribe',
    method: 'Get',
    params: data
  })
}

export function personSubscribeTop(data) {
  return request({
    url: '/app/accountSubscribe/personSubscribeTop',
    method: 'Get',
    params: data
  })
}

// shuttlebusRecord
export function shuttlebusRecord(data) {
  return request({
    url: '/app/accountSubscribe/shuttlebusRecord',
    method: 'Get',
    params: data
  })
}

//shuttleAndCarInfo
export function shuttleAndCarInfo(data) {
  return request({
    url: '/app/accountSubscribe/shuttleAndCarInfo',
    method: 'get',
    params: data
  })
}

export function subscribeAccount(data) {
  return request({
    url: '/app/accountSubscribe/subscribeAccount',
    method: 'patch',
    data: data
  })
}

//所有站点
export function regionAndSite() {
  return request({
    url: '/app/accountSubscribe/regionAndSite',
    method: 'get',
  })
}

//subscribeDetail
export function subscribeDetail(id) {
  return request({
    url: '/app/accountSubscribe/subscribeDetail/'+id,
    method: 'get',
  })
}

export function subscribeQrCode() {
  return request({
    url: '/app/accountSubscribe/subscribeQrCode',
    method: 'get',
  })
}


export function cancelSubscribe(data) {
  return request({
    url: '/app/accountSubscribe/cancelSubscribe',
    method: 'post',
    data: data
  })
}


export function endSiteListByStartSite(data) {
  return request({
    url: '/app/accountSubscribe/endSiteListByStartSite',
    method: 'get',
    params: data
  })
}

export function shuttlebusAll(){
  return request({
    url: '/app/accountSubscribe/shuttlebus',
    method: 'get',
  })
}

//获取班次二维码
export function getShuttleQrCode(id) {
  return request({
    url: '/app/shuttle/qrCode/'+id,
    method: 'get',
  })
}

