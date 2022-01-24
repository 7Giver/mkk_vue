<template>
  <div class="app-container" v-loading="loading">
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
    <policy-form
      ref="policyForm"
      :data="dataList"
      @change="policyFormChange"
      v-if="showPolicy"
    ></policy-form>
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
  name: "editRule",
  components: {
    policyForm,
  },
  data() {
    return {
      copy: 0, // 0编辑 1复制
      loading: true,
      showPolicy: false, //渲染组件
      airlineOptions: [],
      otaOptions: [],
      dataList: [],
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
    // console.log(this.$store);
    let { id, copy } = this.$route.query;
    copy ? (this.copy = copy) : false;
    if (id) {
      this.getRuleDetail(id);
    } else {
      this.$store.commit("SET_DATA", {});
      this.$store.commit("SET_POLICY", []);
      this.showPolicy = true;
      this.loading = false;
    }
    this.getOtaList();
    this.getAirlineList();
  },
  methods: {
    // 查询规则详情
    async getRuleDetail(id) {
      let { data } = await ticketRuleDetail({
        id: id,
      });
      if (!data.policyList) {
        console.log("getRuleDetail请求异常");
        this.loading = false;
        return;
      }
      this.$store.commit("SET_DATA", data);
      this.$store.commit("SET_POLICY", data.policyList);
      this.form = data;
      this.dataList = data.policyList;
      this.showPolicy = true;
      this.loading = false;
    },
    // 添加出票规则
    async goAddRule() {
      // console.log(this.form);
      // return;
      this.loading = true;
      let { data } = await addTicketRule(this.form);
      this.loading = false;
      this.copy ? this.msgSuccess("复制成功") : this.msgSuccess("新增成功");
      setTimeout(() => {
        this.$router.back();
      }, 600);
    },
    // 修改出票规则
    async goEditRule() {
      // console.log(this.form);
      // return;
      this.loading = true;
      let { data } = await updateTicketRule(this.form);
      this.loading = false;
      this.msgSuccess("修改成功");
      // setTimeout(() => {
      //   this.$router.back();
      // }, 600);
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
    reset() {
      this.$refs.policyForm.reset();
      this.resetForm("form");
    },
    policyFormChange(data) {
      console.log("policyFormChange-->", data);
    },
    // 表单提交
    formSubmit() {
      let policyData = this.$refs.policyForm.dataList;
      policyData.length
        ? (this.form.policyList = policyData)
        : this.msgWarning("请设置出票组");
      if (this.form.id && !this.copy) {
        this.goEditRule();
      } else if (this.form.id) {
        this.goAddRule();
      } else if (!this.form.id) {
        this.goAddRule();
      }
    },
  },
};
</script>

<style scoped>
.top-header {
  width: 100%;
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
