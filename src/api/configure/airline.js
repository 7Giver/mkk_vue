import request from '@/utils/request'

// 查询航司列表
export function listAirline(query) {
  return request({
    url: '/configure/airline',
    method: 'get',
    params: query
  })
}

// 新增航司
export function addAirline(data) {
  return request({
    url: '/configure/airline',
    method: 'post',
    data: data
  })
}

// 修改航司
export function updateAirline(data) {
  return request({
    url: '/configure/airline',
    method: 'put',
    data: data
  })
}

// 删除航司
export function delAirline(userId) {
  return request({
    url: '/configure/airline/' + userId,
    method: 'delete'
  })
}

export function listAirlineAll() {
  return request({
    url: "/configure/airline/all",
    method: "get",
  });
}