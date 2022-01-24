import request from "@/utils/request";

export function listOrder(data) {
  return request({
    url: "/ticket/order",
    method: "post",
    data: data,
  });
}

//订单详情
export function orderDetail(id) {
  return request({
    url: "/ticket/order/detail/" + id,
    method: "get",
  });
}

//订单日志
export function orderLog(query) {
  return request({
    url: "/ticket/orderLog",
    method: "get",
    params: query,
  });
}

//订单备注
export function orderNotes(query) {
  return request({
    url: "/ticket/orderLog/note",
    method: "get",
    params: query,
  });
}

//手动拉单
export function pullOrder(data) {
  return request({
    url: "/ticket/order/lyPullOrder",
    method: "post",
    data: data,
  });
}

//手动锁单
export function orderLock(data) {
  return request({
    url: "/ticket/order/lock",
    method: "patch",
    data: data,
  });
}

//解锁订单
export function orderUnLock(data) {
  return request({
    url: "/ticket/order/unLock",
    method: "patch",
    data: data,
  });
}

//录入票号
export function saveTicketNo(data) {
  return request({
    url: "/ticket/orderPay/saveTicketNo",
    method: "post",
    data: data,
  });
}

//更新支付信息
export function orderPay(data) {
  return request({
    url: "/ticket/orderPay",
    method: "post",
    data: data,
  });
}

//回填完成订单
export function sendTicketNo(data) {
  return request({
    url: "/ticket/order/sendTicketNo",
    method: "post",
    data: data,
  });
}

//保存订单备注
export function addOrderNote(data) {
  return request({
    url: "/ticket/orderLog/addNote",
    method: "post",
    data: data,
  });
}

//重置订单获取渠道
export function ticketChannelByOrder(query) {
  return request({
    url: "/ticket/order/ticketChannelListByRestOrder",
    method: "get",
    params: query,
  });
}

//重置订单
export function resetOrder(data) {
  return request({
    url: "/ticket/order/orderConsumeByRestOrder",
    method: "post",
    data: data,
  });
}

//手动下单获取价格
export function flightPrice(query) {
  return request({
    url: "/ticket/order/flightPriceByManConsume",
    method: "get",
    params: query,
  });
}

//手动下单出票
export function handOrder(data) {
  return request({
    url: "/ticket/order/manConsume",
    method: "post",
    data: data,
  });
}

//导出订单
export function exportOrders(data) {
  return request({
    url: "/ticket/order/export",
    method: "post",
    data: data,
  });
}
