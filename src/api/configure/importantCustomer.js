import request from "@/utils/request";

export function listCustomer(query) {
  return request({
    url: "/ticket/importantCustomer",
    method: "get",
    params: query,
  });
}

export function addCustomer(data) {
  return request({
    url: "/ticket/importantCustomer",
    method: "post",
    data: data,
  });
}

export function updateCustomer(data) {
  return request({
    url: "/ticket/importantCustomer",
    method: "put",
    data: data,
  });
}

export function delCustomer(id) {
  return request({
    url: "/ticket/importantCustomer/" + id,
    method: "delete",
  });
}

//批量导入
export function importBatch(data) {
  return request({
    url: "/ticket/importantCustomer/importBatch",
    method: "post",
    data: data,
  });
}

//文件样例
export function customerExample(query) {
  return request({
    url: "/ticket/importantCustomer/example",
    method: "get",
    params: query,
  });
}
