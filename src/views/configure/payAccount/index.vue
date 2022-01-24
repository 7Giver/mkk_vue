<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
      <el-form-item label="支付渠道" prop="id">
        <el-select
          v-model="queryParams.id"
          placeholder="请选择支付渠道"
          clearable
        >
          <el-option
            v-for="item in payChannel"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号名称" prop="nameValue">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="请输入账号名称"
          clearable
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
          >新增账号</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column
        label="账号"
        prop="account"
        :show-overflow-tooltip="true"
        width="140"
        align="center"
      />
      <el-table-column
        label="账户用途"
        prop="useTypeDes"
        width="140"
        align="center"
      />
      <!-- <el-table-column
          label="账号名称"
          prop="fullName"
          width="120"
          align="center"
        /> -->
      <el-table-column label="状态" prop="statusDes" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            disabled
          ></el-switch>
        </template>
      </el-table-column>
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除
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

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="580px">
      <el-form
        class="my-form"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="支付渠道" prop="payChannelId" v-if="!form.id">
              <el-select
                v-model="form.payChannelId"
                placeholder="请选择支付渠道"
                clearable
              >
                <el-option
                  v-for="item in payChannel"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="账号名称" prop="fullName">
              <el-input v-model="form.fullName" placeholder="请输入账号名称" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="账号密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="账户用途" prop="useType">
              <el-radio-group v-model="form.useType">
                <el-radio :label="0">人工使用</el-radio>
                <el-radio :label="1">系统自用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="账号状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
        </el-col>
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
  listPayAccount,
  addPayAccount,
  updatePayAccount,
  delPayAccount,
} from "@/api/configure/payAccount";
import { AllPayChannel, payChannelStatus } from "@/api/configure/payChannel.js";
export default {
  name: "ticketAccount",
  data() {
    return {
      // 选中的渠道id
      targetId: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 账号表格数据
      dataList: [],
      payChannel: [],
      // 弹出层标题
      title: "",
      contentHeight: undefined,
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      statusOptions: [
        {
          dictValue: 0,
          dictLabel: "人工使用",
        },
        {
          dictValue: 1,
          dictLabel: "系统自用",
        },
      ],
      // 查询参数
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: undefined,
        sid: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
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
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
  },
  created() {
    this.getAllPayChannel();
  },
  methods: {
    /** 查询账号列表 */
    async getList() {
      let { data } = await listPayAccount(this.queryParams);
      if (!data.dataList) {
        this.loading = false;
        return;
      }
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 获取所有支付渠道
    async getAllPayChannel() {
      let { data } = await AllPayChannel();
      if (!data.length) return;
      this.payChannel = data.length ? data : [];
      let firstId = data[0].id;
      if (!firstId) {
        console.log("缺少渠道首id");
        return;
      }
      this.queryParams.id = firstId;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        account: undefined,
        password: undefined,
        useType: undefined,
        status: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "新增账号";
      this.$set(this.form, "status", 0);
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.id || this.ids;
      this.form = this.deepClone(row);
      this.title = "修改账号";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          if (this.form.id) {
            updatePayAccount(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPayAccount(this.form).then((response) => {
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
      const roleIds = row.extraInt || this.ids;
      const fullNames = row.fullName || row.account;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delPayAccount(roleIds);
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

<style scoped>
.el-select {
  display: block;
}
.my-form {
  padding: 0 16px;
}
</style>
