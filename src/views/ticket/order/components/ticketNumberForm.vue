<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-row
      class="ticket-wrap"
      v-for="(item, index) in form.ticketNoList"
      :key="index"
      :gutter="10"
    >
      <el-col :span="2">
        <el-checkbox v-model="item.checked"></el-checkbox>
      </el-col>
      <el-col :span="10">
        <el-form-item
          label="乘客姓名"
          :prop="`ticketNoList.${index}.passName`"
          :rules="rules.passName"
        >
          <!-- <el-input
            v-model="item.passName"
            placeholder="请输入乘客姓名"
            disabled
          /> -->
          <div class="name">{{ item.passName }}</div>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item
          label="票号"
          :prop="`ticketNoList.${index}.ticketNo`"
          :rules="rules.ticketNo"
        >
          <el-input v-model="item.ticketNo" placeholder="请输入票号" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="title">出票信息</div>
    <div class="content-wrap">
      <el-form-item label="出票组" prop="groupType" :rules="rules.groupType">
        <el-select
          class="row-select"
          placeholder="请选择出票组"
          v-model="form.groupType"
          :default-first-option="true"
          @change="ticketGroupChange"
          filterable
        >
          <el-option
            v-for="dict in ticketGroup"
            :key="dict.id"
            :label="dict.fullName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="出票渠道"
        prop="ticketChannelId"
        :rules="rules.ticketChannelId"
      >
        <el-select
          class="row-select"
          placeholder="请选择出票渠道"
          v-model="form.ticketChannelId"
          :default-first-option="true"
          @change="ticketChannelChange"
          filterable
        >
          <el-option
            v-for="dict in ticketChannel"
            :key="dict.id"
            :label="dict.fullName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="出票账号"
        prop="ticketAccountId"
        :rules="rules.ticketAccountId"
      >
        <el-select
          class="row-select"
          placeholder="请选择出票账号"
          v-model="form.ticketAccountId"
          :default-first-option="true"
          filterable
        >
          <el-option
            v-for="dict in ticketAccount"
            :key="dict.id"
            :label="dict.account"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="采购流水号"
        prop="createOrderNo"
        :rules="rules.createOrderNo"
      >
        <el-input v-model="form.createOrderNo" placeholder="请输入采购流水号" />
      </el-form-item>
    </div>
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
      <el-form-item label="支付金额" prop="payPrice" :rules="rules.payPrice">
        <el-input
          type="number"
          v-model.number="form.payPrice"
          placeholder="请输入支付金额"
        />
      </el-form-item>
      <el-form-item
        label="优惠金额"
        prop="discountPrice"
        :rules="rules.discountPrice"
      >
        <el-input
          type="number"
          v-model.number="form.discountPrice"
          placeholder="请输入优惠金额"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status" :rules="rules.status">
        <el-radio-group v-model="form.status" size="small">
          <el-radio-button label="0">有效</el-radio-button>
          <el-radio-button label="1">无效</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import {
  listTicketGroup,
  listByGroupType,
  listByTicketChannel,
  payListByTicketChannel,
  listByPayChannel,
} from "@/api/configure/channel.js";
export default {
  name: "ticketNumberForm",
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
      ticketGroup: [],
      ticketChannel: [],
      ticketAccount: [],
      payChannel: [],
      payAccount: [],
      form: {
        ticketNoList: [],
      },
      rules: {
        passName: [
          { required: false, message: "乘客姓名不能为空", trigger: "blur" },
        ],
        ticketNo: [
          { required: false, message: "票号不能为空", trigger: "blur" },
        ],
        groupType: [
          { required: true, message: "出票组不能为空", trigger: "blur" },
        ],
        ticketChannelId: [
          { required: true, message: "出票渠道不能为空", trigger: "blur" },
        ],
        ticketAccountId: [
          { required: true, message: "出票账号不能为空", trigger: "blur" },
        ],
        payChannelId: [
          { required: true, message: "支付渠道不能为空", trigger: "blur" },
        ],
        payAccountId: [
          { required: true, message: "支付账号不能为空", trigger: "blur" },
        ],
        payPrice: [
          { required: true, message: "支付金额不能为空", trigger: "blur" },
          {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: "小数点保留两位",
            trigger: "blur",
          },
        ],
        payNo: [
          { required: true, message: "支付流水号不能为空", tigger: "blur" },
        ],
        createOrderNo: [
          { required: true, message: "采购流水号不能为空", tigger: "blur" },
        ],
        discountPrice: [
          {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: "小数点保留两位",
            trigger: "blur",
          },
        ],
        status: [{ validator: this.checkStatus, trigger: "blur" }],
      },
    };
  },
  created() {
    // console.log(this.list);
    this.initData();
    this.getTicketGroup();
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
      row.groupType && this.getTicketChannel(row.groupType);
      row.ticketChannelId && this.getTicketAccount(row.ticketChannelId);
      row.ticketChannelId && this.getPayChannel(row.ticketChannelId);
      row.payChannelId && this.getPayAccount(row.payChannelId);
      this.form = {
        id: row.id,
        createOrderNo: row.createOrderNo,
        discountPrice: row.realDiscountPrice,
        orderNo: row.orderNo,
        groupType: row.groupType,
        ticketChannelId: row.groupType ? row.ticketChannelId : undefined,
        ticketAccountId: row.ticketChannelId ? row.ticketAccountId : undefined,
        payNo: row.payNo,
        payPrice: row.realPayPrice,
        payChannelId: row.ticketChannelId ? row.payChannelId : undefined,
        payAccountId: row.payChannelId ? row.payAccountId : undefined,
        status: row.status,
      };
    },
    // 获取出票组
    async getTicketGroup() {
      let { data } = await listTicketGroup();
      this.ticketGroup = data.length ? data : [];
    },
    // 获取出票渠道
    async getTicketChannel(id) {
      let { data } = await listByGroupType({
        id: id,
      });
      this.ticketChannel = data.length ? data : [];
    },
    // 获取出票账号
    async getTicketAccount(id) {
      let { data } = await listByTicketChannel({
        id: id,
      });
      this.ticketAccount = data.length ? data : [];
    },
    // 获取支付渠道
    async getPayChannel(id) {
      let { data } = await payListByTicketChannel({
        id: id,
      });
      this.payChannel = data.length ? data : [];
    },
    // 获取支付账号
    async getPayAccount(id) {
      let { data } = await listByPayChannel({
        id: id,
      });
      this.payAccount = data.length ? data : [];
    },
    ticketGroupChange(e) {
      // console.log(e);
      if (!e) return;
      this.getTicketChannel(e);
    },
    ticketChannelChange(e) {
      if (!e) return;
      this.getTicketAccount(e);
      this.getPayChannel(e);
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
    checkStatus(rule, value, callback) {
      if (value == null || value == undefined) {
        return callback(new Error("状态不能为空"));
      } else {
        return callback();
      }
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
