<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
      <el-form-item label="出票渠道" prop="id">
        <el-select
          v-model="queryParams.id"
          placeholder="请选择出票渠道"
          clearable
        >
          <el-option
            v-for="item in ticketChannel"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付渠道" prop="nameValue">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="渠道名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"handleQuery
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
        label="渠道名称"
        prop="fullName"
        align="center"
        width="280"
      />
      <el-table-column
        label="状态"
        prop="statusDes"
        align="center"
        width="260"
        v-if="hasTicketChannel"
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
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >
            删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleStatus(scope.row)"
            v-hasPermi="['system:role:remove']"
            v-if="hasTicketChannel"
          >
            状态
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

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form
        class="my-form"
        ref="form"
        v-loading="dialogLoading"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="出票渠道" prop="ticketChannelIdList">
          <el-select
            v-model="form.ticketChannelIdList"
            placeholder="请选择出票渠道"
            clearable
            multiple
          >
            <el-option
              v-for="item in ticketChannel"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入渠道名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改支付状态 -->
    <el-dialog title="修改支付状态" :visible.sync="openEdit" width="560px">
      <el-form
        class="my-form"
        ref="statusForm"
        :model="targetRow"
        :rules="statusRules"
        label-width="80px"
      >
        <el-row>
          <el-form-item label="出票渠道" prop="ticketChannelId">
            <el-select
              v-model="targetRow.ticketChannelId"
              placeholder="请选择出票渠道"
            >
              <el-option
                v-for="item in ticketChannel"
                :key="item.id"
                :label="item.fullName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付状态" prop="status">
            <el-radio-group v-model="targetRow.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusCancel">取 消</el-button>
        <el-button type="primary" @click="submitStatus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPayChannel,
  addPayChannel,
  updatePayChannel,
  delPayChannel,
  payChannelStatus,
} from "@/api/configure/payChannel.js";
import { AllTicketChannel } from "@/api/configure/ticketChannel.js";
import { payChannelDetail } from "@/api/configure/channelConfig.js";
export default {
  name: "payChannel",
  data() {
    return {
      // 遮罩层
      loading: true,
      dialogLoading: false,
      // 是否选择渠道
      hasTicketChannel: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 渠道表格数据
      dataList: [],
      ticketChannel: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openEdit: false,
      targetRow: {},
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
        ticketChannelIdList: [
          { required: true, message: "请选择渠道", trigger: "blur" },
        ],
      },
      statusRules: {
        ticketChannelId: [
          { required: true, message: "请选择渠道", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getAllTicketChannel();
  },
  methods: {
    /** 查询渠道列表 */
    async getList() {
      this.loading = true;
      let { data } = await listPayChannel(this.queryParams);
      const dataList = data.dataList;
      if (!dataList.length) {
        this.loading = false;
        return;
      }
      this.dataList = dataList;
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 获取所有出票渠道
    async getAllTicketChannel() {
      let { data } = await AllTicketChannel();
      this.ticketChannel = data.length ? data : [];
    },
    // 获取支付渠道对应的出票渠道
    async getPayChannelDetail(id) {
      this.dialogLoading = true;
      let { data } = await payChannelDetail({
        id: id,
      });
      this.dialogLoading = false;
      if (!data || !data.length) {
        return;
      }
      this.form.ticketChannelIdList = data.map((item) => {
        return item.id;
      });
    },
    // 删除渠道
    async deletePayChannel(id) {
      this.loading = true;
      let { data } = await delPayChannel(id);
      this.loading = false;
      this.msgSuccess("删除成功");
      this.getList();
    },
    // 请求修改支付渠道状态
    async updatePayChannelStatus() {
      let params = {
        payChannelId: this.targetRow.id,
        ticketChannelId: this.targetRow.ticketChannelId,
        status: this.targetRow.status,
      };
      let { data } = await payChannelStatus(params);
      this.msgSuccess("修改成功");
      this.openEdit = false;
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
    },
    // 取消按钮
    statusCancel() {
      this.statusReset();
      this.openEdit = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        fullName: undefined,
        ticketChannelIdList: [],
      };
      this.resetForm("form");
    },
    statusReset() {
      this.targetRow = {
        payChannelId: undefined,
        ticketChannelId: undefined,
        status: undefined,
      };
      this.resetForm("statusForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.hasTicketChannel = this.queryParams.id ? true : false;
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
      this.title = "新增渠道";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.id;
      let copyRow = this.deepClone(row);
      this.form = {
        id: copyRow.id,
        fullName: copyRow.fullName,
        ticketChannelIdList: [],
      };
      this.getPayChannelDetail(roleId);
      this.title = "修改渠道";
      this.open = true;
    },
    // 修改支付状态
    handleStatus(row) {
      this.statusReset();
      this.targetRow = this.deepClone(row);
      let ticketChannelId = this.queryParams.id;
      this.targetRow.ticketChannelId = ticketChannelId ? ticketChannelId : "";
      this.openEdit = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updatePayChannel(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPayChannel(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitStatus() {
      this.$refs["statusForm"].validate((valid) => {
        if (valid) {
          this.updatePayChannelStatus();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id;
      const fullNames = row.fullName;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deletePayChannel(roleIds);
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
