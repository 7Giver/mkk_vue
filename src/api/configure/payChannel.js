import request from "@/utils/request";

export function listPayChannel(query) {
  return request({
    url: "/configure/payChannel",
    method: "get",
    params: query,
  });
}

export function addPayChannel(data) {
  return request({
    url: "/configure/payChannel",
    method: "post",
    data: data,
  });
}

export function updatePayChannel(data) {
  return request({
    url: "/configure/payChannel",
    method: "put",
    data: data,
  });
}

export function delPayChannel(id) {
  return request({
    url: "/configure/payChannel/" + id,
    method: "delete",
  });
}

// 修改支付渠道状态
export function payChannelStatus(data) {
  return request({
    url: "/configure/payChannel",
    method: "patch",
    data: data,
  });
}

// 所有支付渠道(不分页)
export function AllPayChannel(query) {
  return request({
    url: "/configure/payChannel/payAll",
    method: "get",
    params: query,
  });
}
