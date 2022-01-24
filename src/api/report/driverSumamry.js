import request from '@/utils/request'


export function exportDriverSummary(data) {
  return request({
    url: '/excel/driverSumamry/exportDriverSummary',
    method: 'Get',
    params: data
  })
}


export function pageDriverSummary(data) {
  return request({
    url: '/excel/driverSumamry/pageDriverSummary',
    method: 'get',
    params: data
  })
}

