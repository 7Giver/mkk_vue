import request from "@/utils/request";

const tips = "/configure";

export function listChannel(query) {
  return request({
    url: "/configure/channelConfigure",
    method: "get",
    params: query,
  });
}

export function listChannelTicket() {
  return request({
    url: "/configure/ticketChannel",
    method: "get",
  });
}

export function listChannelPay() {
  return request({
    url: "/configure/payChannel/payAll",
    method: "get",
  });
}

export function addChannelPay(data) {
  return request({
    url: "/configure/payChannel",
    method: "post",
    data: data,
  });
}

export function addChannelTicket(data) {
  return request({
    url: "/configure/ticketChannel",
    method: "post",
    data: data,
  });
}

export function updateChannelPay(data) {
  return request({
    url: "/configure/payChannel",
    method: "put",
    data: data,
  });
}

export function updateChannelTicket(data) {
  return request({
    url: "/configure/ticketChannel",
    method: "put",
    data: data,
  });
}

export function delChannelPay(id) {
  return request({
    url: "/configure/payChannel" + id,
    method: "delete",
  });
}

export function delChannelTicket(id) {
  return request({
    url: "/configure/ticketChannel/" + id,
    method: "delete",
  });
}

export function listTicketGroup() {
  return request({
    url: "/configure/channelConfigure/ticketGroup",
    method: "get",
  });
}

export function payChannelDetail(data) {
  return request({
    url: "/configure/channelConfigure/payDetail/",
    method: "get",
    params: data,
  });
}

// 出票组下对应的出票渠道
export function listByGroupType(query) {
  return request({
    url: "/configure/ticketChannel/listByGroupType",
    method: "get",
    params: query,
  });
}

// 出票渠道下的出票账号
export function listByTicketChannel(query) {
  return request({
    url: "/configure/ticketAccount/listByChannel",
    method: "get",
    params: query,
  });
}

// 出票渠道对应的支付渠道
export function payListByTicketChannel(query) {
  return request({
    url: "/configure/channelConfigure/payListByTicketChannel",
    method: "get",
    params: query,
  });
}

// 支付渠道下对应支付账号
export function listByPayChannel(query) {
  return request({
    url: "/configure/payAccount/listByChannel",
    method: "get",
    params: query,
  });
}
