import request from "@/utils/request";

export function listCustomerRule(query) {
  return request({
    url: "/ticket/importantCustomerRule",
    method: "get",
    params: query,
  });
}

export function addCustomerRule(data) {
  return request({
    url: "/ticket/importantCustomerRule",
    method: "post",
    data: data,
  });
}

export function updateCustomerRule(data) {
  return request({
    url: "/ticket/importantCustomerRule",
    method: "put",
    data: data,
  });
}

export function delCustomerRule(id) {
  return request({
    url: "/ticket/importantCustomerRule/" + id,
    method: "delete",
  });
}
