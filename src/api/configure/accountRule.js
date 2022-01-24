import request from "@/utils/request";

export function listRule(query) {
  return request({
    url: "/configure/otaAccountRule",
    method: "get",
    params: query,
  });
}

export function addRule(data) {
  return request({
    url: "/configure/otaAccountRule",
    method: "post",
    data: data,
  });
}

export function updateRule(data) {
  return request({
    url: "/configure/otaAccountRule",
    method: "put",
    data: data,
  });
}

export function delRule(userId) {
  return request({
    url: "/configure/otaAccountRule/" + userId,
    method: "delete",
  });
}
