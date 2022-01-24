import request from '@/utils/request'


export function summary(data) {
  console.log(data)
  return request({
    url: '/excel/excelSummary/summary/'+data,
    method: 'Get',

  })
}



