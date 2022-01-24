<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="二字码" prop="roleName">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="请输入二字码"
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="airlineList">
      <el-table-column
        label="航司名称"
        prop="fullName"
        :show-overflow-tooltip="true"
        width="140"
        align="center"
      />
      <el-table-column label="二字码" prop="code" width="100" align="center" />
      <el-table-column
        label="票证代码"
        prop="accountCode"
        width="120"
        align="center"
      />
      <el-table-column
        label="城市类型"
        prop="cityType"
        :formatter="visibleFormat"
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
            v-hasPermi="['system:role:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改航司配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="580px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="航司名称" prop="fullName">
              <el-input v-model="form.fullName" placeholder="请输入航司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航司类型" prop="cityType">
              <el-select v-model="form.cityType" placeholder="请选择">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="二字码" prop="code">
              <el-input v-model="form.code" placeholder="请输入二字码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票证码" prop="accountCode">
              <el-input v-model="form.accountCode" placeholder="请输入票证码" />
            </el-form-item>
          </el-col>
        </el-row>
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
  listAirline,
  addAirline,
  updateAirline,
  delAirline,
} from "@/api/configure/airline";

export default {
  name: "airline",
  data() {
    return {
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
      // 航司表格数据
      airlineList: [],
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
        fullName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "二字码不能为空", trigger: "blur" },
          { pattern: /^[A-Za-z0-9]{1,2}$/, message: "只能英文和数字(1~2位)" },
        ],
        accountCode: [
          { required: false, message: "票证码不能为空", trigger: "blur" },
          { pattern: /^[A-Za-z0-9]{1,3}$/, message: "只能英文和数字(1~3位)" },
        ],
        cityType: [
          { required: true, message: "类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getStatusOptionsFun();
  },
  methods: {
    //返回显示状态的可选
    getStatusOptionsFun() {
      this.statusOptions = [
        {
          dictValue: 0,
          dictLabel: "国内",
        },
        {
          dictValue: 1,
          dictLabel: "国外",
        },
      ];
    },
    // 显示状态
    visibleFormat(row, column) {
      if (row.cityType == 0) {
        return "国内";
      } else {
        return "国外";
      }
    },
    /** 查询航司列表 */
    getList() {
      this.loading = true;
      // console.log(this.queryParams);
      // return
      if (!this.queryParams.nameValue) {
        this.$delete(this.queryParams, "nameValue");
      }
      listAirline(this.queryParams).then((response) => {
        this.airlineList = response.data.dataList;
        this.total = response.data.totalPage;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cityType: undefined, // 0-国内 1-国外,
        code: undefined,
        fullName: undefined,
        id: undefined,
      };
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
      this.open = true;
      this.title = "添加航司";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      const roleId = row.id || this.ids;
      this.form = this.deepClone(row);
      this.open = true;
      this.title = "修改航司";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            console.log(this.form);
            updateAirline(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAirline(this.form).then((response) => {
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
          return delAirline(roleIds);
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
