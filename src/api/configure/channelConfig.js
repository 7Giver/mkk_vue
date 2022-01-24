import request from "@/utils/request";

// 出票组列表
export function listTicketGroup(query) {
  return request({
    url: "/configure/channelConfigure/ticketGroup",
    method: "get",
    params: query,
  });
}

// 支付渠道关联的出票渠道
export function payChannelDetail(data) {
  return request({
    url: "/configure/channelConfigure/payDetail",
    method: "get",
    params: data,
  });
}