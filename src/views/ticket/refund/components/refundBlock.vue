<template>
  <div>
    <el-table :data="list">
      <el-table-column label="乘机人" prop="passName" align="center" />
      <el-table-column label="平台手续费" prop="realOtaFee" align="center" />
      <el-table-column label="平台应退金额" prop="realOtaAmount" align="center" />
      <el-table-column label="原舱退票费" prop="realCainCodeAmount" align="center" />
      <el-table-column label="舱位差价退票" prop="realCainCodeDisparityAmount" align="center" />
      <el-table-column label="采购预估退款" prop="realPurchaseMayAmount" align="center" />
      <el-table-column label="采购实际退款" prop="realPurchaseAmount" align="center" />
      <el-table-column label="改签后退款" prop="realChangeAmount" align="center" />
      <el-table-column label="采购预估退款" prop="realPurchaseMayAmount" align="center" />
      <el-table-column label="毛利" prop="realProfit" align="center" />
      <el-table-column label="升舱支付流水" prop="upgradePayNo" align="center" />
      <el-table-column label="采购退票单号" prop="purchaseRefundNo" align="center" />
      <el-table-column label="采购退款单号" prop="purchaseRefundPayNo" align="center" />
      <el-table-column label="支付渠道" prop="payChannelDetail" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="goEdit(scope.$index)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "refundBlock",
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  methods: {
    goEdit(index) {
      this.$emit("emit", index);
    },
  },
};
</script>

<style></style>
