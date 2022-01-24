<template>
  <div class="app-container">
    <el-form
      :model="searchParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="" prop="roleName">
        <el-input
          v-model="searchParams.nameValue"
          placeholder="请输入账号名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        > -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增规则</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleEdit"
          >修改规则</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column
        label="店铺"
        prop="otaAccountName"
        width="160"
        align="center"
      />
      <!-- <el-table-column label="店铺" prop="account" width="140" align="center">
        <template slot-scope="scope">
          <div
            class="my-label"
            v-for="(item, index) in scope.row.account"
            :key="index"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        label="航司"
        prop="airlineId"
        width="140"
        align="center"
      />
      <el-table-column
        label="政策包含"
        prop="policyCodeStr"
        width="140"
        align="center"
      />
      <!-- <el-table-column label="状态" prop="statusDes" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            disabled
          ></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-copy"
            @click="handleCopy(scope.row)"
            >复制
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.perPage"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listTicketRule, delTicketRule } from "@/api/configure/ticketRule.js";
export default {
  name: "ticketRule",
  data() {
    return {
      startDate: "",
      endDate: "",
      search: "",
      loading: true,
      ids: [], // 选中数组
      showSearch: true,
      total: 0,
      dataList: [
        // {
        //   account: ["测试", "哈哈", "店铺"],
        //   airline: "测试机场",
        //   useTypeDes: "HIDSF",
        //   statusDes: "启用",
        // },
      ],
      copyList: [],
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: undefined,
      },
      searchParams: {
        nameValue: undefined,
      },
      form: {},
      rules: {
        payChannelId: [
          { required: true, message: "渠道不能为空", trigger: "blur" },
        ],
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        useType: [
          { required: true, message: "账户用途不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.loading = false;
  },
  methods: {
    async getList() {
      Object.assign(this.queryParams, this.searchParams);
      let { data } = await listTicketRule(this.queryParams);
      if (!data.dataList) {
        console.log("listTicketRule请求异常");
        this.loading = false;
        return;
      }
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    handleQuery() {
      this.queryParams.page = 1;
      // this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.$router.push({ path: "editRule" });
      // this.$router.push({ path: "detail", query: { order: order } });
    },
    handleEdit() {
      this.$router.push({ path: "editRule" });
    },
    handleUpdate(row) {
      // console.log(row);
      if (!row.id) {
        this.msgWarning("缺少规则ID");
        return;
      }
      this.$router.push({ path: "editRule", query: { id: row.id } });
    },
    handleCopy(row) {
      if (!row.id) {
        this.msgWarning("缺少规则ID");
        return;
      }
      this.$router.push({ path: "editRule", query: { id: row.id, copy: 1 } });
    },
    handleDelete(row) {
      const roleIds = row.id || this.ids;
      const fullNames = row.fullName || row.account;
      this.$confirm("是否确认删除该数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTicketRule(roleIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    dateChange(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped>
.my-label {
  line-height: 20px;
}
</style>
