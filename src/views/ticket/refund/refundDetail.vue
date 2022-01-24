<template>
  <div class="app-container" v-loading="loading">
    <div class="title">订单信息</div>
    <el-descriptions :column="4" direction="vertical" border>
      <el-descriptions-item label="订单号">
        {{ order.orderNo }}
      </el-descriptions-item>
      <el-descriptions-item label="政策代码">
        {{ order.outPolicyId || "空" }}
      </el-descriptions-item>
      <el-descriptions-item label="进单时间" v-if="order.createTime">
        <el-tag size="small">{{ order.createTime || "空" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="订单来源">
        {{ order.otaTypeDes || "空" }}
      </el-descriptions-item>
      <el-descriptions-item label="店铺名称">
        {{ order.otaAccountName || "空" }}
      </el-descriptions-item>
      <el-descriptions-item label="航程类型">
        {{ order.tripTypeDes || "空" }}
      </el-descriptions-item>
      <el-descriptions-item label="乘机人">
        {{ order.linkMan || "空" }}
      </el-descriptions-item>
      <el-descriptions-item label="订单完成时间" v-if="order.finishTime">
        <el-tag size="small">{{ order.finishTime || "空" }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <div class="title">航程信息</div>
    <!-- 展示表单 -->
    <el-table :data="segmentList">
      <el-table-column label="航段" prop="routeNo" align="center" />
      <el-table-column label="航空公司" prop="airlineCode" align="center" />
      <el-table-column label="起降机场" prop="startPortDes" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.startPort && scope.row.endPort">
            {{ scope.row.startPort + "-" + scope.row.endPort }}
          </span>
          <span v-else-if="scope.row.startPort || scope.row.endPort">
            {{ scope.row.startPort || scope.row.endPort }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="起飞时间" prop="deptTime" align="center" sortable>
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.deptTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="降落时间" prop="arrTime" align="center" sortable>
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.arrTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="航班号" prop="flightNo" align="center" />
      <el-table-column label="舱位" prop="cabinCode" align="center" />
    </el-table>
    <div class="title">支付信息</div>
    <!-- 支付列表 -->
    <payTable :list="payList" @emit="showPayEdit"></payTable>
    <div class="title">客票退款详情</div>
    <!-- 退票详情列表 -->
    <refund-block
      :list="ticketDetailList"
      @emit="showTicketEdit"
    ></refund-block>
    <div class="title">备注</div>
    <!-- 备注列表 -->
    <notes-block :list="notesList"></notes-block>
    <div class="title">操作区</div>
    <div
      class="footer"
      v-if="account == order.operator && order.lockStatus == 1"
    >
      <el-button
        type="primary"
        size="small"
        v-for="(item, index) in btnList"
        :key="index"
        @click="handleClick(item)"
      >
        {{ item }}
      </el-button>
    </div>
    <div class="footer" v-else-if="order.lockStatus == 0">
      <el-button type="primary" size="small" @click="handleClick('备注')">
        备注
      </el-button>
    </div>
    <div class="footer" v-else>
      <el-button
        type="primary"
        size="small"
        v-for="(item, index) in btnList"
        :key="index"
        @click="handleClick(item)"
        v-if="item != '强制解锁' && item != '备注' && account == order.operator"
      >
        {{ item }}
      </el-button>
      <el-button
        type="primary"
        size="small"
        v-else-if="item == '强制解锁' && order.lockStatus == 1"
        @click="handleClick('强制解锁')"
      >
        强制解锁
      </el-button>
      <el-button
        type="primary"
        size="small"
        v-else-if="item == '备注'"
        @click="handleClick('备注')"
      >
        备注
      </el-button>
    </div>
    <div class="title">日志</div>
    <!-- 日志列表 -->
    <log-block :list="logList"></log-block>
    <!-- 录入等弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :width="dialogWidth"
      :close-on-click-modal="false"
      @close="reset"
    >
      <!-- 支付信息 -->
      <refund-pay-form
        ref="ticketNoForm"
        :list="ticketList"
        :row="payRow"
        v-if="open && status == 0"
      ></refund-pay-form>
      <!-- 票价详情 -->
      <ticket-detail-form
        ref="refundDetailForm"
        :row="payRow"
        v-if="open && status == 1"
      ></ticket-detail-form>
      <refund-stuck ref="refundStuck" v-if="open && status == 2"></refund-stuck>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  refundOrderDetail,
  pullRefundOrder,
  refundOrderLock,
  refundOrderUnLock,
  exportRefundOrder,
  savePayInfo,
  editPayInfo,
  saveTicketDetail,
  refundOrderSum,
  refundOrderLog,
  refundOrderNote,
  pullRefundNote,
  refundBetCharge,
  refundWaiting,
  refundError,
  refundForceComplete,
  refundNotPay,
  refundThirdPay,
  refundTwice,
  refundSpecial,
  refundWaitingChangeSave,
  refundWaitingCheckOrder,
} from "@/api/ticket/refundOrder.js";
import refundPayForm from "./components/refundPayForm.vue";
import refundBlock from "./components/refundBlock.vue";
import logBlock from "../order/components/logBlock.vue";
import notesBlock from "../order/components/notesBlock.vue";
import payTable from "./components/payTable.vue";
import ticketDetailForm from "./components/ticketDetailForm.vue";
import refundStuck from "./components/refundStuck.vue";
export default {
  name: "refundDetail",
  components: {
    refundPayForm,
    refundBlock,
    payTable,
    logBlock,
    notesBlock,
    ticketDetailForm,
    refundStuck,
  },
  data() {
    return {
      orderNo: "",
      status: 0, // 0退票录入/支付信息 1票价详情 2卡点
      dialogWidth: "830px",
      title: "",
      order: {},
      payRow: {}, //支付信息
      loading: false,
      open: false,
      dialogLoading: true,
      segmentList: [], //航程信息
      ticketList: [], //票面信息
      ticketDetailList: [], //退款详情
      payList: [],
      logList: [], //日志信息
      notesList: [], //备注信息
      orderTicketChannel: [], //符合规则的出票渠道
      handOrderList: [], //手动出票渠道组
      btnList: [
        "强制解锁",
        "退票录入",
        "卡点",
        "完成升改待退票",
        "异常",
        "强制完成",
        "待核账",
        "已核账",
        "二次退款",
        "赌退",
        "待升改",
        "挂账",
      ],
    };
  },
  computed: {
    account() {
      return this.$store.getters.account;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const orderNo = this.$route.params && this.$route.params.orderId;
      if (!orderNo) {
        this.msgError("缺少订单号");
        return;
      }
      this.orderNo = orderNo;
      this.getOrderDetail();
      this.getOrderNotes();
      this.getOrderLog();
    },
    // 获取订单详情
    async getOrderDetail() {
      this.loading = true;
      let { data } = await refundOrderDetail({
        id: this.orderNo,
      });
      if (!data.orderNo) {
        this.msgWarning("orderDetail暂无数据");
        return;
      }
      this.order = data;
      this.segmentList = data.segmentList.length ? data.segmentList : [];
      this.ticketList = data.ticketList.length ? data.ticketList : [];
      this.ticketDetailList = data.ticketDetailList.length
        ? data.ticketDetailList
        : [];
      this.payList = data.payList.length ? data.payList : [];
      this.loading = false;
    },
    // 获取订单日志
    async getOrderLog() {
      try {
        let { data } = await refundOrderLog({
          orderNo: this.orderNo,
        });
        this.logList = data.length ? data : [];
      } catch (error) {
        // this.getOrderLog(); // 注意死循环调用
      }
    },
    // 获取订单备注
    async getOrderNotes() {
      try {
        let { data } = await refundOrderNote({
          orderNo: this.orderNo,
        });
        this.notesList = [];
        this.notesList = data.length ? data : [];
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 强制解锁订单（非本人使用）
    async hardUnLockOrder() {
      try {
        let { data } = await refundOrderUnLock({
          id: this.orderNo,
        });
        this.msgSuccess("解锁成功");
        const obj = { path: "/ticket/refund" };
        setTimeout(() => {
          this.$tab.closeOpenPage(obj);
        }, 600);
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 退票录入
    async saveTicketNumber(obj, callback) {
      try {
        let { data } = await savePayInfo(obj);
        this.open = false;
        this.msgSuccess("提交成功！");
        callback();
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 票价详情修改
    async updateTicketDetail(params, callback) {
      try {
        let { data } = await saveTicketDetail(params);
        this.open = false;
        this.msgSuccess("更新成功！");
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 跟新支付信息
    async updatePayInfo(obj, callback) {
      try {
        let { data } = await editPayInfo(obj);
        this.reset();
        this.open = false;
        this.msgSuccess("更新成功！");
        callback();
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 保存备注
    async postOrderTips(value, callback) {
      if (!value) return;
      try {
        let params = {
          message: value,
          operator: this.account,
          orderNo: this.orderNo,
        };
        let { data } = await pullRefundNote(params);
        this.msgSuccess("备注成功");
        this.getOrderNotes();
        callback();
      } catch (error) {
        this.getOrderNotes();
      }
    },
    // 退票卡点
    async postRefundStuck(obj, callback) {
      try {
        let params = {
          id: this.orderNo,
          percentChangeTime: obj.time,
        };
        let { data } = await refundBetCharge(params);
        this.open = false;
        this.msgSuccess("卡点成功");
        callback();
      } catch (error) {
        this.getOrderNotes();
      }
    },
    // 备注验证方法
    inputValidator(value) {
      if (!value) return;
      if (value.length > 200) {
        return false;
      } else {
        return true;
      }
    },
    // 操作区点击事件
    handleClick(event) {
      if (!this.orderNo) {
        this.msgError("缺少订单号");
        return;
      }
      switch (event) {
        case "强制解锁":
          this.handleUnLock();
          break;
        case "退票录入":
          this.handleSaveTicketNo();
          break;
        case "备注":
          this.handleOrderTips();
          break;
        case "卡点":
          this.handleStuck();
          break;
        default:
          this.handleDefault(event);
          break;
      }
    },
    // 操作区默认通用处理
    handleDefault(type) {
      let title = `是否${type}?`;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          mixBeforePost(type);
        })
        .catch(() => {});
      let mixBeforePost = (type) => {
        let params = { id: this.orderNo };
        switch (type) {
          case "完成升改待退票":
            refundWaiting(params).then((res) => this.msgSuccess("请求成功"));
            break;
          case "异常":
            refundError(params).then((res) => this.msgSuccess("请求成功"));
            break;
          case "强制完成":
            refundForceComplete(params).then((res) =>
              this.msgSuccess("请求成功")
            );
            break;
          case "待核账":
            refundNotPay(params).then((res) => this.msgSuccess("请求成功"));
            break;
          case "已核账":
            refundThirdPay(params).then((res) => this.msgSuccess("请求成功"));
            break;
          case "二次退款":
            refundTwice(params).then((res) => this.msgSuccess("请求成功"));
            break;
          case "赌退":
            refundSpecial(params).then((res) => this.msgSuccess("请求成功"));
            break;
          case "待升改":
            refundWaitingChangeSave(params).then((res) =>
              this.msgSuccess("请求成功")
            );
            break;
          case "挂账":
            refundWaitingCheckOrder(params).then((res) =>
              this.msgSuccess("请求成功")
            );
            break;
          default:
            break;
        }
      };
    },
    // 强制解锁处理
    handleUnLock() {
      this.$confirm("是否强制解锁?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.hardUnLockOrder();
        })
        .catch(() => {});
    },
    // 退票录入处理
    handleSaveTicketNo() {
      this.status = 0;
      this.title = "录入支付信息和票号";
      this.dialogWidth = "830px";
      this.open = true;
    },
    // 订单备注处理
    handleOrderTips() {
      this.$prompt("", "备注", {
        inputValidator: this.inputValidator,
        inputPlaceholder: "请输入备注（200字）",
        inputErrorMessage: "最多输入200字",
        inputType: "textarea",
      })
        .then(({ value }) => {
          this.postOrderTips(value, this.getOrderDetail);
        })
        .catch(() => {});
    },
    // 卡点处理
    handleStuck() {
      this.status = 2;
      this.title = "卡点操作";
      this.dialogWidth = "440px";
      this.open = true;
    },
    // 展示支付信息修改
    showPayEdit(index) {
      this.status = 0;
      this.title = "修改支付信息";
      this.payRow = this.payList[index];
      this.open = true;
    },
    //展示票价信息修改
    showTicketEdit(index) {
      this.status = 1;
      this.dialogWidth = "700px";
      this.title = "修改票价详情";
      this.payRow = this.ticketDetailList[index];
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.orderTicketChannel = [];
      this.handOrderList = [];
      this.open = false;
    },
    reset() {
      this.payRow = {};
      switch (this.status) {
        case 0:
          let ticketNoForm = this.$refs.ticketNoForm;
          ticketNoForm.reset();
          break;
        case 1:
          let refundDetailForm = this.$refs.refundDetailForm;
          refundDetailForm.reset();
          break;
        default:
          break;
      }
    },
    // 金额处理
    resultNumber(num) {
      return Math.round(num * 100);
    },
    /** 提交按钮 */
    submitForm() {
      switch (this.status) {
        case 0:
          this.payInfoSubmit();
          break;
        case 1:
          this.ticketDetailSubmit();
          break;
        case 2:
          this.refundStuckSubmit();
          break;
        default:
          this.open = false;
          break;
      }
    },
    // 支付信息提交
    payInfoSubmit() {
      let result = this.$refs.ticketNoForm.getFormData();
      if (!result.valid) return;
      let form = this.deepClone(result.form);
      form.type = 1; //0：出票，1：改期，2：升舱
      form.refundId = this.orderNo;
      form.operator = this.account;
      form.payAmount = this.resultNumber(form.payAmount);
      form.discountAmount = this.resultNumber(form.discountAmount);
      let ticketNoList = form.ticketNoList.filter((item) => item.checked);
      if (ticketNoList.length < 1) {
        this.msgError("至少勾选一位乘客");
        return;
      }
      form.passNameLink = ticketNoList.map((item) => item.passName).join(",");
      this.$delete(form, "ticketNoList");
      // console.log("form", form);
      // return;
      form.id
        ? this.updatePayInfo(form, this.initData)
        : this.saveTicketNumber(form, this.initData);
    },
    // 退款详情修改提交
    ticketDetailSubmit() {
      let result = this.$refs.refundDetailForm.getFormData();
      if (!result.valid) return;
      let form = this.deepClone(result.form);
      form.refundId = this.orderNo;
      form.operator = this.account;
      form.cainCodeAmount = this.resultNumber(form.cainCodeAmount);
      form.cainCodeDisparityAmount = this.resultNumber(
        form.cainCodeDisparityAmount
      );
      form.changeAmount = this.resultNumber(form.changeAmount);
      form.otaAmount = this.resultNumber(form.otaAmount);
      form.otaFee = this.resultNumber(form.otaFee);
      form.profit = this.resultNumber(form.profit);
      form.purchaseAmount = this.resultNumber(form.purchaseAmount);
      form.purchaseMayAmount = this.resultNumber(form.purchaseMayAmount);
      // console.log("ticketDetail form -->", form);
      // return;
      this.updateTicketDetail(form, this.initData);
    },
    // 退款卡点提交
    refundStuckSubmit() {
      const result = this.$refs.refundStuck.getFormData();
      if (!result.valid) return;
      const form = this.deepClone(result.form);
      form.id = this.orderNo;
      // console.log("form", form);
      this.postRefundStuck(form, this.initData);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 30px 20px 0;
}
.app-container {
  padding: 0 20px 20px;
}
.title {
  color: #303133;
  font-size: 16px;
  text-align: left;
  font-weight: bold;
  margin: 20px auto;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f9;
  padding: 12px 0;
  margin-bottom: 20px;
}
</style>
