<template>
  <div class="app-container">
    <!-- 表单 -->
    <el-form :model="form" ref="form" :rules="rules" :inline="true">
      <el-form-item label="政策代码" prop="policyCodeStr">
        <el-input
          v-model="form.policyCodeStr"
          placeholder="输入政策代码，逗号隔开"
          clearable
        />
      </el-form-item>
      <el-form-item label="店铺" prop="otaAccountId">
        <el-select
          v-model="form.otaAccountId"
          placeholder="请选择/检索店铺"
          filterable
          clearable
        >
          <el-option
            v-for="dict in otaOptions"
            :key="dict.id"
            :label="dict.fullName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="航司" prop="airlineId">
        <el-select
          v-model="form.airlineId"
          :default-first-option="true"
          placeholder="请选择/检索航司"
          filterable
          clearable
        >
          <el-option
            v-for="dict in airlineOptions"
            :key="dict.id"
            :label="dict.completeName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="换编码出票" prop="isChangeCode">
        <el-select
          v-model="form.isChangeCode"
          placeholder="是否换编码出票"
          clearable
        >
          <el-option label="是" :value="0"></el-option>
          <el-option label="否" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="top-header">
      <div class="title">规则明细</div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-check"
          size="mini"
          @click="formSubmit"
        >
          确定
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reset">
          重置
        </el-button>
      </div>
    </div>
    <!-- 规则明细 -->
    <policy-form ref="policyForm"></policy-form>
  </div>
</template>

<script>
import {
  addTicketRule,
  updateTicketRule,
  ticketRuleDetail,
} from "@/api/configure/ticketRule.js";
import { listAccountAll } from "@/api/configure/otaAccount";
import { listAirlineAll } from "@/api/configure/airline";
import policyForm from "./policyForm.vue";
export default {
  name: "addRule",
  components: {
    policyForm,
  },
  data() {
    return {
      loading: true,
      airlineOptions: [],
      otaOptions: [],
      form: {
        id: undefined,
        airlineId: undefined, //航司主键
        isChangeCode: undefined, //换编码出票：0，是、1，否
        otaAccountId: undefined, //店铺账户主键
        policyCodeStr: undefined, //政策包含代码，逗号隔开
        policyList: [],
      },
      rules: {
        otaAccountId: [
          { required: true, message: "店铺不能为空", trigger: "blur" },
        ],
        airlineId: [
          { required: true, message: "航司不能为空", trigger: "blur" },
        ],
        isChangeCode: [
          { required: true, message: "编码出票不能为空", trigger: "blur" },
        ],
        policyCodeStr: [
          { required: true, message: "政策编码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // this.getRuleDetail();
    this.getOtaList();
    this.getAirlineList();
  },
  methods: {
    // 查询规则详情
    async getRuleDetail() {
      let { data } = await ticketRuleDetail(this.form);
      if (!data.dataList) {
        console.log("ticketRuleDetail请求异常");
        this.loading = false;
        return;
      }
      this.dataList = data.dataList.length ? data.dataList : [];
      this.loading = false;
    },
    // 添加出票规则
    async goAddRule() {
      let { data } = await addTicketRule(this.form);
      this.msgSuccess("新增成功");
    },
    // 获取店铺列表
    async getOtaList() {
      let { data } = await listAccountAll();
      this.otaOptions = data.length ? data : [];
    },
    // 获取航司列表
    async getAirlineList() {
      let { data } = await listAirlineAll();
      this.airlineOptions = data.length ? data : [];
    },
    reset() {},
    formSubmit() {
      // console.log(this.$refs.policyForm);
      let policyData = this.$refs.policyForm.resultData;
      this.form.policyList = policyData;
      console.log(this.form);
      this.goAddRule();
    },
  },
};
</script>

<style scoped>
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-bottom: 6px;
  margin-bottom: 12px;
}
.title {
  font-size: 15px;
  font-weight: 700;
  color: #606266;
  line-height: 40px;
}
</style>
