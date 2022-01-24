import request from "@/utils/request";

// 查询账号列表
export function listAccount(query) {
  return request({
    url: "/configure/otaAccount",
    method: "get",
    params: query,
  });
}

export function typeAccount(id) {
  return request({
    url: "/configure/otaAccount/type/" + id,
    method: "get",
  });
}

// 新增账号
export function addAccount(data) {
  return request({
    url: "/configure/otaAccount",
    method: "post",
    data: data,
  });
}

// 修改账号
export function updateAccount(data) {
  return request({
    url: "/configure/otaAccount",
    method: "put",
    data: data,
  });
}

// 删除账号
export function delAccount(userId) {
  return request({
    url: "/configure/otaAccount/" + userId,
    method: "delete",
  });
}

// 查询店铺不分页
export function listAccountAll() {
  return request({
    url: "/configure/otaAccount/all",
    method: "get",
  });
}
