<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="乘机人" prop="passName">
      <el-input v-model="form.passName" />
    </el-form-item>
    <el-form-item label="支付渠道名" prop="payChannelDetail">
      <el-input v-model="form.payChannelDetail" />
    </el-form-item>
    <el-form-item label="原舱退票费" prop="cainCodeAmount">
      <el-input v-model="form.cainCodeAmount" />
    </el-form-item>
    <el-form-item label="舱位差价退票费" prop="cainCodeDisparityAmount">
      <el-input v-model="form.cainCodeDisparityAmount" />
    </el-form-item>
    <el-form-item label="改签退款" prop="changeAmount">
      <el-input v-model="form.changeAmount" />
    </el-form-item>
    <el-form-item label="平台应退" prop="otaAmount">
      <el-input v-model="form.otaAmount" />
    </el-form-item>
    <el-form-item label="平台手续费" prop="otaFee">
      <el-input v-model="form.otaFee" />
    </el-form-item>
    <el-form-item label="毛利" prop="profit">
      <el-input v-model="form.profit" />
    </el-form-item>
    <el-form-item label="采购预估退款" prop="purchaseMayAmount">
      <el-input v-model="form.purchaseMayAmount" />
    </el-form-item>
    <el-form-item label="采购实际退款" prop="purchaseAmount">
      <el-input v-model="form.purchaseAmount" />
    </el-form-item>
    <el-form-item label="采购退款单" prop="purchaseRefundNo">
      <el-input v-model="form.purchaseRefundNo" />
    </el-form-item>
    <el-form-item label="采购退款支付单" prop="purchaseRefundPayNo">
      <el-input v-model="form.purchaseRefundPayNo" />
    </el-form-item>
    <el-form-item label="升舱订单号" prop="upgradePayNo">
      <el-input v-model="form.upgradePayNo" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "ticketDetailForm",
  props: {
    row: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      form: {},
      rules: {
        passName: [
          { required: true, message: "请填写乘机人", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.row.id) {
        this.msgWarning("缺少退款详情Id");
        return;
      }
      const row = this.deepClone(this.row);
      this.form = {
        id: row.id,
        cainCodeAmount: row.realCainCodeAmount ? row.realCainCodeAmount : null,
        cainCodeDisparityAmount: row.realCainCodeDisparityAmount
          ? row.realCainCodeDisparityAmount
          : null,
        changeAmount: row.realChangeAmount ? row.realChangeAmount : null,
        otaAmount: row.realOtaAmount ? row.realOtaAmount : null,
        otaFee: row.realOtaFee ? row.realOtaFee : null,
        passName: row.passName,
        payChannelDetail: row.payChannelDetail,
        profit: row.realProfit ? row.realProfit : null,
        purchaseAmount: row.realPurchaseAmount ? row.realPurchaseAmount : null,
        purchaseMayAmount: row.realPurchaseMayAmount
          ? row.realPurchaseMayAmount
          : null,
        purchaseRefundNo: row.purchaseRefundNo,
        purchaseRefundPayNo: row.purchaseRefundPayNo,
        upgradePayNo: row.upgradePayNo,
      };
    },
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    getFormData() {
      const ret = {
        valid: false,
        form: {},
      };
      this.$refs.form.validate((valid) => {
        ret.valid = valid ? valid : false;
        ret.form = this.form;
      });
      return ret;
    },
  },
};
</script>

<style></style>
