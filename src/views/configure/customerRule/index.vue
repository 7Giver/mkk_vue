<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
      <el-form-item label="大客户名" prop="nameValue">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="请输入大客户名"
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
        >
          新增
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="航司" prop="code" width="100" align="center" />
      <el-table-column
        label="城市名称"
        prop="fullName"
        width="140"
        align="center"
      />
      <el-table-column
        label="机场名称"
        prop="airportName"
        :show-overflow-tooltip="true"
        width="140"
        align="center"
      />
      <el-table-column
        label="城市类型"
        prop="cityTypeDes"
        width="120"
        align="center"
      ></el-table-column>
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

    <!-- 添加或修改账号配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="730px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="航司" prop="airlineId">
          <el-select
            class="row-select"
            v-model="form.airlineId"
            :default-first-option="true"
            placeholder="请选择航司"
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
        <el-form-item label="大客户组名" prop="codeName">
          <el-input v-model="form.codeName" placeholder="请输入大客户组名" />
        </el-form-item>
        <el-form-item label="舱位集合" prop="cabinCodeListStr">
          <el-input
            v-model="form.cabinCodeListStr"
            placeholder="舱位代码，逗号隔开"
          />
        </el-form-item>
        <el-form-item label="政策代码" prop="policyCodeStr">
          <el-input
            v-model="form.policyCodeStr"
            placeholder="政策代码，逗号隔开"
          />
        </el-form-item>
        <el-form-item label="票面上限" prop="maxFacePrice">
          <el-input
            v-model.number="form.maxFacePrice"
            placeholder="请输入票面上限"
          />
        </el-form-item>
        <el-form-item label="票面下限" prop="minFacePrice">
          <el-input
            v-model.number="form.minFacePrice"
            placeholder="请输入票面下限"
          />
        </el-form-item>
        <el-form-item label="排除航线" prop="excludeFlightList">
          <el-input v-model="form.excludeFlightList" placeholder="排除航线" />
        </el-form-item>
        <el-form-item label="适用航线" prop="flightList">
          <el-input v-model="form.flightList" placeholder="适用航线" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" size="small">
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
  listCustomerRule,
  addCustomerRule,
  updateCustomerRule,
  delCustomerRule,
} from "@/api/configure/customerRule.js";
import { listAirlineAll } from "@/api/configure/airline";
export default {
  name: "cityCode",
  data() {
    return {
      // 下载链接
      downloadURL: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 账号表格数据
      dataList: [],
      typeOptions: [],
      airlineOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    // this.loading = false;
    this.getList();
    this.getAirlineList();
  },
  methods: {
    /** 查询账号列表 */
    async getList() {
      this.loading = true;
      let { data } = await listCustomerRule(this.queryParams);
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 获取航司列表
    async getAirlineList() {
      let { data } = await listAirlineAll();
      this.airlineOptions = data.length ? data : [];
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.fullNames = selection.map((item) => item.fullName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "新增大客户规则";
      this.form.status = 0;
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row);
      this.reset();
      const roleId = row.id || this.ids;
      this.form = this.deepClone(row);
      this.title = "修改大客户规则";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = this.deepClone(this.form);
          params.maxFacePrice = Math.round(params.maxFacePrice * 100);
          params.minFacePrice = Math.round(params.minFacePrice * 100);
          console.log("params", params);
          if (this.form.id) {
            updateCustomerRule(params).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            // return;
            addCustomerRule(params).then((response) => {
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
      const roleIds = row.id || this.ids;
      const fullNames = row.fullName || this.fullNames;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delCustomerRule(roleIds);
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

<style scoped lang="scss">
.upload-btn-box {
  margin-bottom: 10px;
  button {
    margin-right: 10px;
  }
  input[type="file"] {
    display: none;
  }
}
</style>
