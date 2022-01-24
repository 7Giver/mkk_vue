<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
      <el-form-item label="出票渠道" prop="nameValue">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="渠道名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="出票组" prop="id">
        <el-select
          class="row-select"
          v-model="queryParams.id"
          :default-first-option="true"
          placeholder="请选择出票组"
          filterable
          clearable
        >
          <el-option
            v-for="dict in ticketChannel"
            :key="dict.id"
            :label="dict.fullName"
            :value="dict.id"
          />
        </el-select>
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

    <el-table v-loading="loading" :data="dataList">
      <el-table-column
        label="渠道名称"
        prop="fullName"
        align="center"
        width="280"
      />
      <el-table-column
        label="出票组"
        prop="groupName"
        align="center"
        width="260"
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
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-form-item label="出票组" prop="groupType" v-if="!form.id">
            <el-select
              class="row-select"
              v-model="form.groupType"
              :default-first-option="true"
              placeholder="请选择出票组"
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
        </el-row>
        <el-row>
          <el-form-item label="渠道名称" prop="fullName">
            <el-input v-model="form.fullName" placeholder="请输入渠道名称" />
          </el-form-item>
        </el-row>
        <el-row v-if="form.id">
          <el-form-item label="接口名称" prop="interfaceName">
            <el-input
              v-model="form.interfaceName"
              placeholder="请输入接口名称"
            />
          </el-form-item>
          <div class="tips">
            <i class="el-icon-warning-outline icon"></i>
            <span>该字段仅后台人员填写</span>
          </div>
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
  listTicketChannel,
  addTicketChannel,
  updateTicketChannel,
  delTicketChannel,
  ticketChannelByGroup,
} from "@/api/configure/ticketChannel.js";
import { listTicketGroup } from "@/api/configure/channelConfig.js";

export default {
  name: "ticketChannel",
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 查询参数
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: undefined,
        id: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fullName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        groupType: [{ required: true, message: "选择总渠道", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getTicketGroup();
  },
  methods: {
    /** 查询渠道列表 */
    async getList() {
      this.loading = true;
      let { data } = await listTicketChannel(this.queryParams);
      const dataList = data.dataList;
      if (!dataList.length) {
        this.loading = false;
        return;
      }
      this.dataList = dataList;
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 获取出票组
    async getTicketGroup() {
      let { data } = await listTicketGroup();
      if (!data.length) {
        console.log("暂无渠道");
        return;
      }
      this.ticketChannel = data.length ? data : [];
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      this.reset();
      this.title = "添加渠道";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.id;
      this.form = this.deepClone(row);
      this.title = "修改渠道";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateTicketChannel(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTicketChannel(this.form).then((response) => {
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
      const fullNames = row.fullName;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTicketChannel(roleIds);
        })
        .then(() => {
          this.msgSuccess("删除成功");
          this.getList();
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.tips {
  position: absolute;
  left: 18%;
  bottom: 0;
  color: #ff4949;
  font-size: 14px;
}
.tips span {
  font-size: 13px;
  margin-left: 5px;
  font-weight: normal;
}
</style>
