import request from '@/utils/request'


export function exportShuttlebusRecord(data) {
  return request({
    url: '/excel/shuttlebusRecord/exportShuttlebusRecord',
    method: 'Get',
    params: data
  })
}


export function pageShuttlebusRecord(data) {
  return request({
    url: '/excel/shuttlebusRecord/pageShuttlebusRecord',
    method: 'get',
    params: data
  })
}

