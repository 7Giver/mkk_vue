import request from "@/utils/request";

export function listTicketAccount(query) {
  return request({
    url: "/configure/ticketAccount",
    method: "get",
    params: query,
  });
}

export function addTicketAccount(data) {
  return request({
    url: "/configure/ticketAccount",
    method: "post",
    data: data,
  });
}

export function updateTicketAccount(data) {
  return request({
    url: "/configure/ticketAccount",
    method: "put",
    data: data,
  });
}

export function delTicketAccount(id) {
  return request({
    url: "/configure/ticketAccount/" + id,
    method: "delete",
  });
}

export function addByExcel(data) {
  return request({
    url: "/configure/ticketAccount/addByExcel",
    method: "post",
    data: data,
  });
}
