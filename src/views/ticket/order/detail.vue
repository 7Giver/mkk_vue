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
          <span v-if="scope.row.startPortDes && scope.row.endPortDes">
            {{ scope.row.startPortDes + "-" + scope.row.endPortDes }}
          </span>
          <span v-else-if="scope.row.startPortDes || scope.row.endPortDes">
            {{ scope.row.startPortDes || scope.row.endPortDes }}
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
    <div class="title">票价信息</div>
    <el-table :data="ticketList">
      <el-table-column label="乘客姓名" prop="passName" align="center" />
      <el-table-column label="乘客类型" prop="passTypeDes" align="center" />
      <el-table-column
        label="出生日期"
        prop="birthDay"
        align="center"
        sortable
      />
      <el-table-column label="PNR" prop="pnr" align="center" />
      <el-table-column
        label="证件号"
        prop="certNo"
        align="center"
        width="170"
        sortable
      />
      <el-table-column label="证件类型" prop="certTypeDes" align="center" />
      <el-table-column
        label="票面价"
        prop="realFacePrice"
        align="center"
        sortable
      />
      <el-table-column label="票号" prop="ticketNo" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.ticketNo || "空" }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="应付票价"
        prop="realTicketPrice"
        align="center"
        sortable
      />
    </el-table>
    <div class="title">支付信息</div>
    <!-- 支付列表 -->
    <payTable :list="payList" @emit="showPayEdit"></payTable>
    <div class="title">备注</div>
    <!-- 备注列表 -->
    <notes-block :list="notesList"></notes-block>
    <div class="title">操作区</div>
    <!-- <div class="footer">
      <el-button
        type="primary"
        size="small"
        v-for="(item, index) in btnList"
        :key="index"
        @click="handleClick(item)"
      >
        {{ item }}
      </el-button>
    </div> -->
    <div
      class="footer"
      v-if="account == order.operator && order.handleStatus == 1"
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
    <div class="footer" v-else-if="order.handleStatus == 2">
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
        v-else-if="item == '强制解锁' && order.handleStatus == 1"
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
      @close="reset"
    >
      <!-- 支付信息 -->
      <ticket-number-form
        ref="ticketNoForm"
        :list="ticketList"
        :row="payRow"
        v-if="open && status == 0"
      ></ticket-number-form>
      <!-- 重置订单 -->
      <ticket-channel-reset
        ref="ticketChannelReset"
        :list="orderTicketChannel"
        v-if="open && status == 1"
      ></ticket-channel-reset>
      <!-- 手动下单 -->
      <hand-order-form
        ref="handOrderForm"
        :loading="dialogLoading"
        :list="handOrderList"
        @emit="sendTicket"
        v-if="open && status == 2"
      ></hand-order-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  orderDetail,
  saveTicketNo,
  sendTicketNo,
  resetOrder,
  orderUnLock,
  addOrderNote,
  orderNotes,
  orderLog,
  orderPay,
  handOrder,
  flightPrice,
  ticketChannelByOrder,
} from "@/api/ticket/order";
import ticketNumberForm from "./components/ticketNumberForm.vue";
import ticketChannelReset from "./components/ticketChannelReset.vue";
import handOrderForm from "./components/handOrderForm.vue";
import logBlock from "./components/logBlock.vue";
import notesBlock from "./components/notesBlock.vue";
import payTable from "./components/payTable.vue";
export default {
  name: "orderDetail",
  components: {
    ticketNumberForm,
    ticketChannelReset,
    handOrderForm,
    payTable,
    logBlock,
    notesBlock,
  },
  data() {
    return {
      orderNo: "",
      status: 0, // 0录入票号/支付信息 1重置订单 2手动下单
      dialogWidth: "830px",
      title: "",
      order: {},
      payRow: {}, //支付信息
      loading: true,
      open: false,
      dialogLoading: true,
      segmentList: [], //航程信息
      ticketList: [], //票价信息
      payList: [],
      logList: [], //日志信息
      notesList: [], //备注信息
      orderTicketChannel: [], //符合规则的出票渠道
      handOrderList: [], //手动出票渠道组
      btnList: [
        "强制解锁",
        "录入票号",
        "重置订单",
        "完成订单",
        "手动下单",
        "备注",
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
      let { data } = await orderDetail(this.orderNo);
      if (!data.orderNo) {
        this.msgWarning("orderDetail暂无数据");
        return;
      }
      this.order = data;
      this.segmentList = data.segmentList.length ? data.segmentList : [];
      this.ticketList = data.ticketList.length ? data.ticketList : [];
      this.payList = data.payList.length ? data.payList : [];
      this.loading = false;
    },
    // 获取订单日志
    async getOrderLog() {
      try {
        let { data } = await orderLog({
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
        let { data } = await orderNotes({
          orderNo: this.orderNo,
        });
        this.notesList = [];
        this.notesList = data.length ? data : [];
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 获取符合规则的出票渠道
    async getOrderTicketChannel() {
      try {
        let { data } = await ticketChannelByOrder({
          orderNo: this.orderNo,
        });
        this.orderTicketChannel = data.length ? data : [];
        this.open = true;
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 回填完成订单
    async completeOrder() {
      try {
        let { data } = await sendTicketNo({
          id: this.orderNo,
        });
        this.msgSuccess("票号回填成功");
        this.initData();
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 强制解锁订单（非本人使用）
    async hardUnLockOrder() {
      try {
        let { data } = await orderUnLock({
          id: this.orderNo,
        });
        this.msgSuccess("解锁成功");
        const obj = { path: "/ticket/order" };
        setTimeout(() => {
          this.$tab.closeOpenPage(obj);
        }, 600);
        this.initData();
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 录入票号
    async saveTicketNumber(obj, callback) {
      try {
        let { data } = await saveTicketNo(obj);
        this.open = false;
        this.msgSuccess("提交成功！");
        callback();
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 重置订单
    async postOrderReset(params, callback) {
      try {
        let { data } = await resetOrder(params);
        this.open = false;
        this.msgSuccess("重置成功");
        callback();
      } catch (error) {
        this.getOrderLog();
      }
    },
    // 跟新支付信息
    async updateOrderPay(obj, callback) {
      try {
        let { data } = await orderPay(obj);
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
        let { data } = await addOrderNote(params);
        this.msgSuccess("备注成功");
        this.getOrderNotes();
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
        case "录入票号":
          this.handleSaveTicketNo();
          break;
        case "重置订单":
          this.handleOrderReset();
          break;
        case "完成订单":
          this.handleOrderDone();
          break;
        case "手动下单":
          this.handleOrderPlace();
          break;
        case "备注":
          this.handleOrderTips();
          break;
        default:
          break;
      }
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
    // 录入票号处理
    handleSaveTicketNo() {
      this.status = 0;
      this.title = "填写支付信息和票号";
      this.dialogWidth = "830px";
      this.open = true;
    },
    // 重置订单处理
    handleOrderReset() {
      this.status = 1;
      this.dialogWidth = "500px";
      this.title = "重置订单";
      // this.$confirm("是否重置订单?", "系统提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      //     this.getOrderTicketChannel();
      //   })
      //   .catch(() => {});
      this.getOrderTicketChannel();
    },
    // 完成订单处理
    handleOrderDone() {
      this.$confirm("是否确认完成订单?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.completeOrder();
        })
        .catch(() => {});
    },
    // 手动下单处理
    handleOrderPlace() {
      this.dialogLoading = true;
      this.status = 2;
      this.title = "手动下单";
      this.dialogWidth = "880px";
      this.open = true;
      flightPrice({ orderNo: this.orderNo })
        .then((res) => {
          let data = res.data;
          this.handOrderList = data.length ? data : [];
          this.dialogLoading = false;
        })
        .catch((error) => {
          this.getOrderLog();
        });
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
    // 请求出票
    sendTicket(id) {
      let params = {
        orderNo: this.orderNo,
        ticketChannelId: id,
      };
      handOrder(params)
        .then((res) => {
          this.msgSuccess("出票成功");
        })
        .catch((error) => {
          this.getOrderLog();
        });
    },
    // 展示支付信息修改
    showPayEdit(index) {
      this.status = 0;
      this.title = "修改支付信息";
      this.payRow = this.payList[index];
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
      let ticketNoForm = this.$refs.ticketNoForm;
      ticketNoForm.reset();
    },
    /** 提交按钮 */
    submitForm() {
      if (this.status == 0) {
        let result = this.$refs.ticketNoForm.getFormData();
        if (!result.valid) return;
        let form = this.deepClone(result.form);
        form.orderNo = this.orderNo;
        form.payPrice = Math.round(form.payPrice * 100);
        form.discountPrice = Math.round(form.discountPrice * 100);
        if (form.ticketNoList) {
          let ticketNoList = form.ticketNoList.filter((item) => item.checked);
          form.ticketNoList = ticketNoList;
        }
        // console.log("form", form);
        // return;
        form.id
          ? this.updateOrderPay(form, this.initData)
          : this.saveTicketNumber(form, this.initData);
      } else if (this.status == 1) {
        let result = this.$refs.ticketChannelReset.getData();
        result.orderNo = this.orderNo;
        // console.log("result", result);
        this.postOrderReset(result, this.initData);
      } else {
        this.open = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
.tips-table {
  // max-height: 170px;
  // overflow-y: scroll;
}
</style>
