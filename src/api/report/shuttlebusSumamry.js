import request from '@/utils/request'


export function exportShuttlebusSummary(data) {
  return request({
    url: '/excel/shuttlebusSumamry/exportShuttlebusSummary',
    method: 'Get',
    params: data
  })
}


export function pageShuttlebusSummary(data) {
  return request({
    url: '/excel/shuttlebusSumamry/pageShuttlebusSummary',
    method: 'get',
    params: data
  })
}

