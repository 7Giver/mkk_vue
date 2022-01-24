<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
      <el-form-item label="公告名称" prop="nameValue">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="请输入公告名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="航司二字码" prop="airlineCode">
        <el-input
          v-model="queryParams.airlineCode"
          placeholder="航司二字码，逗号拼接"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
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
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column
        label="公告名称"
        prop="fullName"
        width="140"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        label="航空公司"
        prop="airlineCodeLink"
        width="140"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        label="适用航程"
        prop="flightLink"
        width="140"
        align="center"
      />
      <el-table-column
        label="适用舱位"
        prop="cabinCodeLink"
        width="140"
        align="center"
      />
      <el-table-column
        label="航班日期"
        prop="flightDateLink"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        label="出票日期"
        prop="ticketDateLink"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.perPage"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="公告名称" prop="fullName">
          <el-input
            v-model="form.fullName"
            placeholder="请输入公告名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="航司二字码" prop="airlineCodeLink">
          <el-input
            v-model="form.airlineCodeLink"
            placeholder="航司二字码，逗号拼接"
            clearable
          />
        </el-form-item>
        <el-form-item label="适用航程" prop="flightLink">
          <el-input
            v-model="form.flightLink"
            placeholder="适用航程，逗号拼接"
            clearable
          />
        </el-form-item>
        <el-form-item label="适用舱位" prop="cabinCodeLink">
          <el-input
            v-model="form.cabinCodeLink"
            placeholder="适用舱位，逗号拼接"
            clearable
          />
        </el-form-item>
        <el-form-item label="航班日期" prop="flightDateLink">
          <el-input
            v-model="form.flightDateLink"
            placeholder="航班日期，逗号拼接"
            clearable
          />
        </el-form-item>
        <el-form-item label="出票日期" prop="ticketDateLink">
          <el-input
            v-model="form.ticketDateLink"
            placeholder="出票日期，逗号拼接"
            clearable
          />
        </el-form-item>
        <el-form-item label="适用改期" prop="isChange">
          <el-radio-group v-model="form.isChange" size="small">
            <el-radio-button :label="0">启用</el-radio-button>
            <el-radio-button :label="1">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listChargeNotice,
  addChargeNotice,
  updateChargeNotice,
  delChargeNotice,
} from "@/api/configure/chargeNotice";
export default {
  name: "chargeNotice",
  data() {
    return {
      // 遮罩层
      loading: false,
      single: true,
      showSearch: true,
      total: 0,
      dataList: [],
      title: "",
      open: false,
      // 日期范围
      dateRange: [],
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: undefined,
      },
      form: {},
      rules: {
        airlineCodeLink: [
          { required: true, message: "航司不能为空", trigger: "blur" },
        ],
        flightDateLink: [
          { required: true, message: "航班日期不能为空", trigger: "blur" },
        ],
        ticketDateLink: [
          { required: true, message: "出票日期不能为空", trigger: "blur" },
        ],
        flightLink: [
          { required: true, message: "适用航程不能为空", trigger: "blur" },
        ],
        cabinCodeLink: [
          { required: true, message: "适用舱位不能为空", trigger: "blur" },
        ],
        fullName: [
          { required: true, message: "公告名称不能为空", trigger: "blur" },
        ],
        isChange: [
          { required: true, message: "适用改期订单不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询规则列表 */
    async getList() {
      this.loading = true;
      let { data } = await listChargeNotice(this.queryParams);
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.title = "添加公告";
      this.$set(this.form, "isChange", 0);
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const roleId = row.id;
      this.form = this.deepClone(row);
      this.title = "修改公告";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          if (this.form.id) {
            updateChargeNotice(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChargeNotice(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id;
      this.$confirm("是否确认删除该数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delChargeNotice(roleIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 20px 20px 0;
}
</style>
