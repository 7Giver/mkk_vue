<template>
  <div class="refund-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="'所有退款' + labelNum1" name="first">
        <all-refund
          v-if="activeName == 'first'"
          @change="getRefundOrderSum"
        ></all-refund>
      </el-tab-pane>
      <el-tab-pane :label="'待处理退款' + labelNum2" name="second">
        <el-excel
          v-if="activeName == 'second'"
          @change="getRefundOrderSum"
        ></el-excel>
      </el-tab-pane>
      <el-tab-pane label="疑问订单" name="third"> 33 </el-tab-pane>
      <el-tab-pane label="改签留票" name="fourth"> 44 </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import allRefund from "./allRefund.vue";
import elExcel from "./elExcel.vue";
import { refundOrderSum } from "@/api/ticket/refundOrder.js";
export default {
  name: "refundOrders",
  components: {
    allRefund,
    elExcel,
  },
  data() {
    return {
      activeName: "first",
      labelNum1: "",
      labelNum2: "",
    };
  },
  created() {
    // this.getRefundOrderSum();
  },
  methods: {
    async getRefundOrderSum() {
      let { data } = await refundOrderSum();
      this.labelNum1 = data.defaultCount ? `(${data.defaultCount})` : "";
      this.labelNum2 = data.waitingCheckOrder
        ? `(${data.waitingCheckOrder})`
        : "";
      // this.labelNum2 = data.secondLabel ? data.secondLabel : "";
      // this.labelNum3 = data.thirdLabel ? data.thirdLabel : "";
      // this.labelNum4 = data.thirdLabel ? data.thirdLabel : "";
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>

<style scoped>
.refund-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  padding: 0;
}
.el-tabs {
  border: none;
  height: 100%;
  overflow-y: scroll;
}
::v-deep .el-tabs__content {
  padding: 20px;
}
</style>
