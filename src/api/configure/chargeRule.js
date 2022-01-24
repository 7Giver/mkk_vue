import request from "@/utils/request";

export function listChargeRule(query) {
  return request({
    url: "/configure/chargeRule",
    method: "get",
    params: query,
  });
}

export function delChargeRule(id) {
  return request({
    url: "/configure/chargeRule/" + id,
    method: "delete",
  });
}

//批量导入
export function addByExcel(data) {
  return request({
    url: "/configure/chargeRule/addByExcel",
    method: "post",
    data: data,
  });
}
