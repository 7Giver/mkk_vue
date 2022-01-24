<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="" prop="roleName">
        <el-input
          v-model="queryParams.nameValue"
          placeholder="请输入渠道名称"
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
          >搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form> -->

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

    <!-- 展示表单 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
    >
      <el-table-column
        label="渠道名称"
        prop="fullName"
        align="left"
        width="200"
        header-align="center"
      />
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
            v-if="scope.row.type !== 0"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            v-if="scope.row.type !== 0"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form
        class="my-form"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-form-item label="渠道类型" prop="type" v-if="!form.id">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">出票渠道</el-radio>
              <el-radio :label="2">支付渠道</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="出票组"
            prop="groupType"
            v-if="!form.id && form.type == 1"
          >
            <el-select
              class="row-select"
              v-model="form.groupType"
              :default-first-option="true"
              placeholder="请选择渠道"
              filterable
            >
              <el-option
                v-for="dict in channelList"
                :key="dict.ids"
                :label="dict.fullName"
                :value="dict.ids"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="出票渠道"
            prop="ticketChannelIdList"
            v-if="form.type == 2"
          >
            <el-cascader
              v-model="form.ticketChannelIdList"
              :options="ticketList"
              :props="{ label: 'fullName', value: 'id', multiple: true }"
              placeholder="请选择渠道"
              clearable
              @change="channelChange"
            ></el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="渠道名称" prop="fullName">
            <el-input v-model="form.fullName" placeholder="请输入渠道名称" />
          </el-form-item>
        </el-row>
        <el-row v-if="form.id && form.type == 1">
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
  listChannel,
  addChannelPay,
  addChannelTicket,
  updateChannelPay,
  updateChannelTicket,
  delChannelPay,
  delChannelTicket,
  listChannelTicket,
  listTicketGroup,
  payChannelDetail,
} from "@/api/configure/channel.js";
export default {
  name: "channel",
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
      dataList: [],
      channelList: [],
      ticketList: [],
      resultChannelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        nameValue: undefined,
        type: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fullName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        groupType: [{ required: true, message: "选择总渠道", trigger: "blur" }],
        ticketChannelIdList: [
          { required: true, message: "选择出票渠道", trigger: "blur" },
        ],
        type: [{ required: true, message: "选择渠道类型", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    // this.getAllTicket();
    this.getChannelList();
    this.getTicketGroup();
  },
  methods: {
    /** 查询渠道列表 */
    async getList() {
      this.loading = true;
      let { data } = await listChannel(this.queryParams);
      if (!data.length) {
        this.loading = false;
        return;
      }
      this.dataList = data;
      this.loading = false;
    },
    /** 查询出票渠道列表 */
    async getChannelList() {
      let { data } = await listChannel({
        type: 1,
      });
      this.ticketList = data.length ? data : [];
    },
    // 获取出票组
    async getTicketGroup() {
      let { data } = await listTicketGroup();
      if (!data.length) {
        console.log("暂无渠道");
        return;
      }
      let list = data.map((item) => {
        return {
          ids: item.id,
          fullName: item.fullName,
        };
      });
      this.channelList = list;
    },
    // 获取所有出票渠道
    async getAllTicket() {
      let { data } = await listChannelTicket();
      if (!data.length) {
        console.log("getAllTicket暂无数据");
        return;
      }
      let list = data.map((item) => {
        return {
          id: item.id,
          fullName: `${item.groupName}-${item.fullName}`,
        };
      });
      this.ticketList = list;
    },
    // 获取支付渠道详情
    async getPayDetail(id) {
      let { data } = await payChannelDetail({
        id: id,
      });
      if (!data.length) {
        console.log("getPayDetail暂无数据");
        return;
      }
      let arr = data.map((item) => {
        return [item.groupType, item.id];
      });
      this.$set(this.form, "ticketChannelIdList", arr);
      this.open = true;
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        fullName: undefined,
        groupType: undefined,
        id: undefined,
        ticketChannelIdList: undefined,
        type: 1,
      };
      this.resetForm("form");
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
      switch (row.type) {
        case 1:
          this.title = "修改出票渠道";
          this.form = {
            fullName: row.fullName,
            id: row.id,
            type: row.type,
            interfaceName: row.extraStr,
          };
          this.open = true;
          break;
        case 2:
          this.title = "修改支付渠道";
          this.form = {
            fullName: row.fullName,
            id: row.extraInt,
            ticketChannelIdList: row.ticketChannelIdList,
            type: row.type,
          };
          this.getPayDetail(row.extraInt);
          break;
        default:
          break;
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let copyForm = JSON.parse(JSON.stringify(this.form));
          this.form.type == 2 &&
            Object.assign(copyForm, {
              ticketChannelIdList: this.resultChannelList,
            });
          this.form.id
            ? this.updateChannel(copyForm)
            : this.addChannel(copyForm);
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.type == 1 ? row.id : row.extraInt;
      const fullNames = row.fullName;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return row.type == 1
            ? delChannelTicket(roleIds)
            : delChannelPay(roleIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 请求修改渠道 (type 1出票 2支付)
    async updateChannel(data) {
      let params = JSON.parse(JSON.stringify(data));
      this.$delete(params, "type");
      if (data.type == 1) {
        let { data } = await updateChannelTicket(params);
        this.msgSuccess("修改成功");
        this.open = false;
        this.getChannelList();
        this.getList();
      } else if (data.type == 2) {
        let { data } = await updateChannelPay(params);
        this.msgSuccess("修改成功");
        this.open = false;
        this.getList();
      }
    },
    // 请求新增渠道 (type 1出票 2支付)
    async addChannel(data) {
      let params = JSON.parse(JSON.stringify(data));
      this.$delete(params, "type");
      if (data.type == 1) {
        let { data } = await addChannelTicket(params);
        this.msgSuccess("新增成功");
        this.open = false;
        this.getChannelList();
        this.getList();
      } else if (data.type == 2) {
        let { data } = await addChannelPay(params);
        this.msgSuccess("新增成功");
        this.open = false;
        this.getList();
      }
    },
    // 出票渠道选择监听
    channelChange(e) {
      // console.log(e);
      if (!e) return;
      if (e.length) {
        this.resultChannelList = e.map((item) => {
          return item[item.length - 1];
        });
      }
    },
  },
};
</script>

<style scoped>
.el-cascader {
  display: block;
}
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
