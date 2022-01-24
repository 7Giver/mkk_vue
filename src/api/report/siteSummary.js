import request from '@/utils/request'


export function exportSiteSummary(data) {
  return request({
    url: '/excel/siteSummary/exportSiteSummary',
    method: 'Get',
    params: data
  })
}


export function pageSiteSummary(data) {
  return request({
    url: '/excel/siteSummary/pageSiteSummary',
    method: 'get',
    params: data
  })
}

