import request from "@/utils/request";

export function listChargeNotice(query) {
  return request({
    url: "/configure/announcementRule",
    method: "get",
    params: query,
  });
}

export function addChargeNotice(data) {
  return request({
    url: "/configure/announcementRule",
    method: "post",
    data: data,
  });
}

export function updateChargeNotice(data) {
  return request({
    url: "/configure/announcementRule",
    method: "put",
    data: data,
  });
}

export function delChargeNotice(id) {
  return request({
    url: "/configure/announcementRule/" + id,
    method: "delete",
  });
}
