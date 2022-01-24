import request from "@/utils/request";

export function listRefundOrder(data) {
  return request({
    url: "/refund/order/page",
    method: "post",
    data: data,
  });
}

export function refundOrderDetail(query) {
  return request({
    url: "/refund/order/detail",
    method: "get",
    params: query,
  });
}

//退票日志列表
export function refundOrderLog(query) {
  return request({
    url: "/refund/orderLog",
    method: "get",
    params: query,
  });
}

//退票备注列表
export function refundOrderNote(query) {
  return request({
    url: "/refund/orderLog/note",
    method: "get",
    params: query,
  });
}

//退票提交备注
export function pullRefundNote(data) {
  return request({
    url: "/refund/orderLog/addNote",
    method: "post",
    data: data,
  });
}

//退票拉单
export function pullRefundOrder(data) {
  return request({
    url: "/refund/order/lyPullOrder",
    method: "post",
    data: data,
  });
}

//退票锁单
export function refundOrderLock(data) {
  return request({
    url: "/refund/order/lock",
    method: "patch",
    data: data,
  });
}

//解锁退票订单
export function refundOrderUnLock(data) {
  return request({
    url: "/refund/order/unLock",
    method: "patch",
    data: data,
  });
}

//导出退票订单
export function exportRefundOrder(data) {
  return request({
    url: "/refund/order/export",
    method: "post",
    data: data,
  });
}

//支付信息录入
export function savePayInfo(data) {
  return request({
    url: "/refund/order/savePayInfo",
    method: "post",
    data: data,
  });
}

//支付信息修改
export function editPayInfo(data) {
  return request({
    url: "/refund/order/payInfo",
    method: "put",
    data: data,
  });
}

//票价详情录入
export function saveTicketDetail(data) {
  return request({
    url: "/refund/order/saveTicketDetail",
    method: "put",
    data: data,
  });
}

//数量统计
export function refundOrderSum() {
  return request({
    url: "/refund/order/summary",
    method: "get",
  });
}

//退票卡点
export function refundBetCharge(data) {
  return request({
    url: "/refund/orderRelated/betCharge",
    method: "post",
    data: data,
  });
}

//完成升改待退票
export function refundWaiting(data) {
  return request({
    url: "/refund/orderRelated/changeCompleteWaitingRefund",
    method: "post",
    data: data,
  });
}

//退票异常
export function refundError(data) {
  return request({
    url: "/refund/orderRelated/error",
    method: "post",
    data: data,
  });
}

//退票强制完成
export function refundForceComplete(data) {
  return request({
    url: "/refund/orderRelated/forceComplete",
    method: "post",
    data: data,
  });
}

//退票待转账
export function refundNotPay(data) {
  return request({
    url: "/refund/orderRelated/otaRefundNotPay",
    method: "post",
    data: data,
  });
}

//退票已核账
export function refundThirdPay(data) {
  return request({
    url: "/refund/orderRelated/otaRefundThirdPay",
    method: "post",
    data: data,
  });
}

//退票二次退款
export function refundTwice(data) {
  return request({
    url: "/refund/orderRelated/secondRefund",
    method: "post",
    data: data,
  });
}

//退票赌退
export function refundSpecial(data) {
  return request({
    url: "/refund/orderRelated/specialOrder",
    method: "post",
    data: data,
  });
}

//退票待升改
export function refundWaitingChangeSave(data) {
  return request({
    url: "/refund/orderRelated/waitingChangeSave",
    method: "post",
    data: data,
  });
}

//退票挂账
export function refundWaitingCheckOrder(data) {
  return request({
    url: "/refund/orderRelated/waitingCheckOrder",
    method: "post",
    data: data,
  });
}
