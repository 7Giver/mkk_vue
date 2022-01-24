import request from "@/utils/request";

export function listTicketChannel(query) {
  return request({
    url: "/configure/ticketChannel",
    method: "get",
    params: query,
  });
}

export function addTicketChannel(data) {
  return request({
    url: "/configure/ticketChannel",
    method: "post",
    data: data,
  });
}

export function updateTicketChannel(data) {
  return request({
    url: "/configure/ticketChannel",
    method: "put",
    data: data,
  });
}

export function delTicketChannel(id) {
  return request({
    url: "/configure/ticketChannel/" + id,
    method: "delete",
  });
}

//所有出票渠道（不分页）
export function AllTicketChannel(query) {
  return request({
    url: "/configure/ticketChannel/ticketAll",
    method: "get",
    params: query,
  });
}

export function ticketChannelByGroup(query) {
  return request({
    url: "/configure/ticketChannel/listByGroupType",
    method: "get",
    params: query,
  });
}
