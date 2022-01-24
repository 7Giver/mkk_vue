import request from "@/utils/request";

export function listPayAccount(query) {
  return request({
    url: "/configure/payAccount",
    method: "get",
    params: query,
  });
}

export function addPayAccount(data) {
  return request({
    url: "/configure/payAccount",
    method: "post",
    data: data,
  });
}

export function updatePayAccount(data) {
  return request({
    url: "/configure/payAccount",
    method: "put",
    data: data,
  });
}


export function delPayAccount(id) {
  return request({
    url: "/configure/payAccount/" + id,
    method: "delete",
  });
}

export function listPayChannel(query) {
  return request({
    url: "/configure/payAccount/pageByPayChannel",
    method: "get",
    params: query,
  });
}