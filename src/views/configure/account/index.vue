<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="店铺名称" prop="roleName">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="请输入店铺名称"
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountList">
      <el-table-column
        label="店铺名称"
        prop="fullName"
        :show-overflow-tooltip="true"
        width="180"
        align="center"
      />
      <el-table-column label="账号" prop="account" width="160" align="center" />
      <el-table-column
        label="来源"
        prop="otaTypeDes"
        width="140"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="statusDes"
        width="140"
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

    <!-- 添加或修改账号配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="580px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="店铺名称" prop="fullName">
              <el-input v-model="form.fullName" placeholder="请输入店铺名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="otaType">
              <el-select v-model="form.otaType" placeholder="请选择类型">
                <el-option
                  v-for="dict in typeOptions"
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
            <el-form-item label="代号" prop="otaOrder">
              <el-input v-model="form.otaOrder" placeholder="请输入代号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <!-- <el-radio-group v-model="form.status" size="small">
                <el-radio-button label="0">正常</el-radio-button>
                <el-radio-button label="1">停用</el-radio-button>
              </el-radio-group> -->
              <el-switch
                v-model="form.status"
                :active-value="0"
                :inactive-value="1"
              >
              </el-switch>
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
  listAccount,
  addAccount,
  updateAccount,
  delAccount,
} from "@/api/configure/otaAccount";

export default {
  name: "account",
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
      // 账号表格数据
      accountList: [],
      typeOptions: [],
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
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        fullName: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        otaType: [{ required: true, message: "类型不能为空", trigger: "blur" }],
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
      this.typeOptions = [
        {
          dictValue: 0,
          dictLabel: "同程",
        },
        {
          dictValue: 1,
          dictLabel: "携程",
        },
        {
          dictValue: 2,
          dictLabel: "去哪儿",
        },
      ];
    },
    /** 查询账号列表 */
    getList() {
      this.loading = true;
      listAccount(this.queryParams).then((response) => {
        this.accountList = response.data.dataList;
        this.total = response.data.totalPage;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        otaType: undefined,
        password: undefined,
        fullName: undefined,
        status: undefined,
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
      this.title = "新增店铺";
      this.form.status = 0;
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row);
      this.reset();
      const roleId = row.id || this.ids;
      this.form = this.deepClone(row);
      this.title = "修改店铺";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            // console.log(this.form);
            // return;
            updateAccount(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccount(this.form).then((response) => {
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
          return delAccount(roleIds);
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
