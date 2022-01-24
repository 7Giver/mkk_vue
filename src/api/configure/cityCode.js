import request from "@/utils/request";

export function listCityCode(query) {
  return request({
    url: "/configure/cityCode",
    method: "get",
    params: query,
  });
}

export function addCityCode(data) {
  return request({
    url: "/configure/cityCode",
    method: "post",
    data: data,
  });
}

export function updateCityCode(data) {
  return request({
    url: "/configure/cityCode",
    method: "put",
    data: data,
  });
}

export function delCityCode(userId) {
  return request({
    url: "/configure/cityCode/" + userId,
    method: "delete",
  });
}

export function addByExcel(data) {
  return request({
    url: "/configure/cityCode/addByExcel",
    method: "post",
    data: data,
  });
}
