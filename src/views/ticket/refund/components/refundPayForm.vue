<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-row
      class="ticket-wrap"
      v-for="(item, index) in form.ticketNoList"
      :key="index"
      :gutter="10"
    >
      <el-col :span="4">
        <el-checkbox v-model="item.checked"></el-checkbox>
      </el-col>
      <el-col :span="10">
        <el-form-item
          label="乘客姓名"
          :prop="`ticketNoList.${index}.passName`"
          :rules="rules.passName"
        >
          <div class="name">{{ item.passName }}</div>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="10">
        <el-form-item
          label="票号"
          :prop="`ticketNoList.${index}.ticketNo`"
          :rules="rules.ticketNo"
        >
          <el-input v-model="item.ticketNo" placeholder="请输入票号" />
        </el-form-item>
      </el-col> -->
    </el-row>
    <div class="title">支付信息</div>
    <div class="content-wrap">
      <el-form-item
        label="支付渠道"
        prop="payChannelId"
        :rules="rules.payChannelId"
      >
        <el-select
          class="row-select"
          placeholder="请选择支付渠道"
          v-model="form.payChannelId"
          :default-first-option="true"
          @change="payChannelChange"
          filterable
        >
          <el-option
            v-for="dict in payChannel"
            :key="dict.id"
            :label="dict.fullName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="支付账号"
        prop="payChannelId"
        :rules="rules.payAccountId"
      >
        <el-select
          class="row-select"
          placeholder="请选择支付账号"
          v-model="form.payAccountId"
          :default-first-option="true"
          filterable
        >
          <el-option
            v-for="dict in payAccount"
            :key="dict.id"
            :label="dict.account"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付流水号" prop="payNo" :rules="rules.payNo">
        <el-input v-model="form.payNo" placeholder="请输入支付流水号" />
      </el-form-item>
      <el-form-item label="支付金额" prop="payAmount" :rules="rules.payAmount">
        <el-input
          type="number"
          v-model.number="form.payAmount"
          placeholder="请输入支付金额"
        />
      </el-form-item>
      <el-form-item
        label="优惠金额"
        prop="discountAmount"
        :rules="rules.discountAmount"
      >
        <el-input
          type="number"
          v-model.number="form.discountAmount"
          placeholder="请输入优惠金额"
        />
      </el-form-item>
    </div>
    <div class="title">额外信息</div>
    <div class="content-wrap">
      <el-form-item label="适用舱位" prop="cabinCode" :rules="rules.cabinCode">
        <el-input v-model="form.cabinCode" placeholder="舱位代码，逗号拼接" />
      </el-form-item>
      <el-form-item label="适用航班" prop="flightNo" :rules="rules.flightNo">
        <el-input v-model="form.flightNo" placeholder="航班代码，逗号拼接" />
      </el-form-item>
      <el-form-item
        label="采购流水号"
        prop="consumerNo"
        :rules="rules.consumerNo"
      >
        <el-input v-model="form.consumerNo" placeholder="请输入采购流水号" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { listByPayChannel } from "@/api/configure/channel.js";
import { AllPayChannel } from "@/api/configure/payChannel.js";
export default {
  name: "refundPayForm",
  props: {
    list: {
      type: Array,
      default: [],
    },
    row: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      payChannel: [],
      payAccount: [],
      form: {
        ticketNoList: [],
      },
      rules: {
        ticketNo: [
          { required: false, message: "票号不能为空", trigger: "blur" },
        ],
        payChannelId: [
          { required: true, message: "支付渠道不能为空", trigger: "blur" },
        ],
        payAccountId: [
          { required: true, message: "支付账号不能为空", trigger: "blur" },
        ],
        payAmount: [
          { required: true, message: "支付金额不能为空", trigger: "blur" },
          {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: "小数点保留两位",
            trigger: "blur",
          },
        ],
        payNo: [
          { required: true, message: "支付流水不能为空", trigger: "blur" },
        ],
        cabinCode: [
          { required: true, message: "适用舱位不能为空", tigger: "blur" },
        ],
        flightNo: [
          { required: true, message: "适用航班不能为空", tigger: "blur" },
        ],
        consumerNo: [
          { required: true, message: "采购流水号不能为空", tigger: "blur" },
        ],
        discountAmount: [
          {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: "小数点保留两位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // console.log(this.list);
    this.initData();
    this.getPayChannel();
  },
  methods: {
    initData() {
      if (!this.list.length) return;
      this.form.ticketNoList = this.list.map((item) => {
        return {
          id: item.id,
          passName: item.passName,
          ticketNo: item.ticketNo,
          checked: false,
        };
      });
      if (!this.row.id) return;
      let row = this.deepClone(this.row);
      row.payChannelId && this.getPayAccount(row.payChannelId);
      this.form = {
        id: row.id,
        cabinCode: row.cabinCode,
        consumerNo: row.consumerNo,
        flightNo: row.flightNo,
        operator: row.operator,
        payChannelId: row.payChannelId,
        payAccountId: row.payChannelId ? row.payAccountId : undefined,
        payNo: row.payNo,
        discountAmount: row.realDiscountAmount,
        payAmount: row.realPayAmount,
        ticketNoList: this.resultChecked(row.passNameLink),
      };
    },
    // 获取支付渠道
    async getPayChannel(id) {
      let { data } = await AllPayChannel();
      this.payChannel = data.length ? data : [];
    },
    // 获取支付账号
    async getPayAccount(id) {
      let { data } = await listByPayChannel({
        id: id,
      });
      this.payAccount = data.length ? data : [];
    },
    payChannelChange(e) {
      if (!e) return;
      this.getPayAccount(e);
    },
    reset() {
      this.form = {};
      this.resetForm("form");
      // this.$forceUpdate();
    },
    // 输出选中数组
    resultChecked(str) {
      let list = str.split(",");
      let target = this.deepClone(this.form.ticketNoList);
      try {
        list.forEach((el) => {
          target.map((item) => {
            item.passName == el
              ? (item.checked = true)
              : (item.checked = false);
          });
        });
      } catch (error) {
        console.log("resultChecked error -->", error);
        target = [];
      }
      return target;
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

<style lang="scss" scoped>
.el-form {
  padding-left: 20px;
  height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.ticket-wrap {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  .el-form-item {
    margin-bottom: 0;
  }
  .el-checkbox {
    zoom: 1.45;
  }
  .name {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    color: #606266;
    padding: 0 20px;
    font-size: 14px;
    border-radius: 4px;
  }
}
.title {
  color: #333;
  font-size: 16px;
  margin: 10px auto 26px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6ebf5;
}
.content-wrap {
  padding: 0 16%;
}
</style>
