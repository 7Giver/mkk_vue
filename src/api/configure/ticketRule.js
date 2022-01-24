import request from "@/utils/request";

export function listTicketRule(query) {
  return request({
    url: "/ticket/ticketRule",
    method: "get",
    params: query,
  });
}

export function ticketRuleDetail(query) {
  return request({
    url: "/ticket/ticketRule/detail",
    method: "get",
    params: query,
  });
}

export function addTicketRule(data) {
  return request({
    url: "/ticket/ticketRule",
    method: "post",
    data: data,
  });
}

export function updateTicketRule(data) {
  return request({
    url: "/ticket/ticketRule",
    method: "put",
    data: data,
  });
}

export function delTicketRule(id) {
  return request({
    url: "/ticket/ticketRule/" + id,
    method: "delete",
  });
}

// 出票规则获取出票组
export function listTicketGroup(query) {
  return request({
    url: "/configure/channelConfigure/ticketGroup",
    method: "get",
    params: query,
  });
}

// 出票组对应的出票渠道
export function ticketList(data) {
  return request({
    url: "/configure/channelConfigure/ticketListByTicketGroup",
    method: "post",
    data: data,
  });
}

export function ListTicketChannel(query) {
  return request({
    url: "/ticket/ticketRule/ticketChannelIdList",
    method: "get",
    params: query,
  });
}
