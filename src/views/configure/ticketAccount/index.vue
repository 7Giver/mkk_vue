<template>
  <div class="app-container">
    <el-form
      :model="searchParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="" prop="nameValue">
        <el-input
          v-model="searchParams.nameValue"
          placeholder="请输入账号"
          clearable
          size="small"
          style="width: 220px"
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
          >新增账号</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-folder-add"
          size="mini"
          @click="uploadFun"
          >批量上传
        </el-button>
        </file-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleFile"
          plain
          >模板下载</el-button
        >
      </el-col>
      <!-- 上传文件节点 -->
      <div class="upload-btn-box">
        <input
          @change="batchChangeFreeFun($event)"
          ref="uploadFun"
          type="file"
          accept="xls,xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        />
      </div>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <div class="content" ref="boxContent">
      <div class="card-wrap" :style="{ 'max-height': contentHeight }">
        <div class="header">
          <div v-if="!showInnerSearch">
            <span>出票渠道</span>
            <i
              class="el-icon-search"
              :style="{ color: theme }"
              @click="showInnerSearch = true"
            ></i>
          </div>
          <div v-else>
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入渠道名称"
              clearable
              @change="searchChange"
              @blur="showInnerSearch = false"
              @clear="showInnerSearch = false"
            />
          </div>
        </div>
        <div class="body" v-if="ticketList.length">
          <!-- 测试数据 -->
          <!-- <div
            v-for="item in testData"
            :key="item.id"
            class="text item"
            :class="{ on: targetId == item.id }"
            @click="getList(item.id, 'card')"
          >
            {{ item.fullName }}
          </div> -->
          <el-tree
            node-key="id"
            :data="ticketList"
            :props="{ label: 'fullName', children: 'children' }"
            :highlight-current="true"
            :expand-on-click-node="true"
            :default-expand-all="true"
            :current-node-key="targetId"
            empty-text="空节点"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>

      <el-table v-loading="loading" :data="dataList">
        <el-table-column
          label="账号"
          prop="account"
          :show-overflow-tooltip="true"
          width="200"
          align="center"
        />
        <el-table-column
          label="联系人"
          prop="contact"
          :show-overflow-tooltip="true"
          width="140"
          align="center"
        />
        <!-- <el-table-column
          label="账号名称"
          prop="fullName"
          width="140"
          align="center"
        /> -->
        <el-table-column
          label="状态"
          prop="statusDes"
          width="140"
          align="center"
        >
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
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.perPage"
      @pagination="getList"
    />

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px">
      <el-form
        class="my-form"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="出票渠道" prop="ticketChannelId">
              <el-cascader
                v-model="form.ticketChannelId"
                :options="ticketList"
                :props="{ label: 'fullName', value: 'id' }"
                @change="channelChange"
                placeholder="请选择出票渠道"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!dialogType">
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
        <el-row :gutter="10" v-if="!dialogType">
          <el-col :span="12">
            <el-form-item label="账号密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="!dialogType">
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="contactNumber">
              <el-input
                v-model="form.contactNumber"
                placeholder="请输入联系人电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乘机人电话" prop="phoneNumber">
              <el-input
                v-model="form.phoneNumber"
                placeholder="请输入乘机人电话"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="!dialogType">
          <el-col :span="12">
            <el-form-item label="代号" prop="orderNumber">
              <el-input v-model="form.orderNumber" placeholder="请输入代号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="!dialogType">
          <el-col :span="24">
            <el-form-item label="账号状态">
              <el-switch
                v-model="form.status"
                :active-value="0"
                :inactive-value="1"
              />
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
  listTicketAccount,
  addTicketAccount,
  updateTicketAccount,
  delTicketAccount,
  addByExcel,
} from "@/api/configure/ticketAccount";
import { listChannel } from "@/api/configure/channel";

export default {
  name: "ticketAccount",
  data() {
    return {
      // 弹窗类型 0新增 1导入
      dialogType: 0,
      // 渠道搜索字段
      search: "",
      // 显示渠道搜索
      showInnerSearch: false,
      // 选中的渠道id
      targetId: undefined,
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
      copyList: [],
      // 出票账号数组
      ticketList: [],
      // 支付账号数组
      payList: [],
      // 弹出层标题
      title: "",
      contentHeight: undefined,
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
        ticketChannelId: undefined,
      },
      // 搜索参数
      searchParams: {
        nameValue: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ticketChannelId: [
          { required: true, message: "渠道不能为空", trigger: "blur" },
        ],
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        // fullName: [
        //   { required: true, message: "名称不能为空", trigger: "blur" },
        // ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    testData() {
      let arr = [];
      for (let index = 0; index < 20; index++) {
        arr.push({
          id: index + 1,
          fullName: "出票渠道" + (index + 1),
        });
      }
      return arr;
    },
  },
  created() {
    this.getChannel();
  },
  mounted() {
    let height = this.$refs.boxContent.clientHeight
      ? this.$refs.boxContent.clientHeight
      : 500;
    this.contentHeight = height + "px";
    // console.log(this.contentHeight);
  },
  methods: {
    /** 查询账号列表 */
    async getList() {
      Object.assign(this.queryParams, this.searchParams);
      let { data } = await listTicketAccount(this.queryParams);
      if (!data.dataList) {
        this.loading = false;
        return;
      }
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 获取渠道树形
    async getChannel() {
      let { data } = await listChannel();
      if (!data.length) {
        console.log("getChannel暂无数据");
        return;
      }
      this.ticketList = data.length ? data : [];
      this.copyList = JSON.parse(JSON.stringify(this.ticketList));
      if (data[0].children.length) {
        let targetId = data[0].children[0].id;
        if (!targetId) {
          console.log("缺少首屏子项id");
          return;
        }
        this.queryParams.ticketChannelId = targetId;
        this.targetId = targetId;
        this.getList();
      }
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
        status: undefined,
        ticketChannelId: undefined,
      };
      this.dialogType = 0;
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
      // this.fullNames = selection.map((item) => item.fullName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.dialogType = 0;
      this.title = "添加账号";
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
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateTicketAccount(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if (this.dialogType == 1) {
              this.$refs.uploadFun.dispatchEvent(new MouseEvent("click"));
              this.open = false;
            } else {
              addTicketAccount(this.form).then((response) => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id || this.ids;
      const fullNames = row.fullName || row.account;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTicketAccount(roleIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleFile() {
      this.$confirm("是否确认导出所有?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.downloadFile("出票账户模板.xls");
      });
    },
    // 渠道选择监听
    channelChange(e) {
      // console.log(e);
      if (!e) return;
      this.form.ticketChannelId = e[1];
    },
    // 搜索方法
    searchChange(val) {
      if (val) {
        //val存在
        this.ticketList = this.copyList.filter((item) => {
          if (
            !!~item.fullName.indexOf(val) ||
            !!~item.fullName.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.ticketList = this.copyList;
      }
    },
    // 树形点击方法
    handleNodeClick(data) {
      console.log(data);
      this.queryParams.ticketChannelId = data.id;
      this.getList();
    },
    // 全屏展示loading
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "文件上传中Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    // 点击文件上传
    uploadFun() {
      // this.$refs.uploadFun.dispatchEvent(new MouseEvent("click"));
      this.dialogType = 1;
      this.title = "导入表格"
      this.open = true;
    },
    // 上传前处理
    batchChangeFreeFun(e) {
      this.openFullScreen();
      var fd = new FormData();
      var length = e.target.files.length;
      for (var i = 0; i < length; i++) {
        fd.append("multipartFile", e.target.files[i]);
      }
      fd.append("ticketChannelId", this.form.ticketChannelId);
      addByExcel(fd)
        .then((res) => {
          this.msgWarning("上传成功");
          this.loading.close();
          this.$refs.uploadFun.value = null;
          this.getList();
        })
        .catch((res) => {
          this.msgWarning("上传失败");
          this.loading.close();
          this.$refs.uploadFun.value = null;
          this.getList();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

::v-deep .el-form-item__label{
  white-space: nowrap;
}

.upload-btn-box {
  margin-bottom: 10px;
  button {
    margin-right: 10px;
  }
  input[type="file"] {
    display: none;
  }
}

.content {
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.el-table {
  border-left: 1px solid #e6ebf5;
  border-right: 1px solid #e6ebf5;
}

.el-cascader {
  display: block;
}

.my-form {
  padding: 0 16px;
}

.card-wrap {
  display: flex;
  flex-direction: column;
  width: 240px;
  min-height: 420px;
  margin-right: 16px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  transition: 0.3s;
  .header {
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .body {
    flex: 1;
    overflow-y: scroll;
  }
}

.el-icon-search {
  font-weight: bold;
  float: right;
  padding: 3px 0;
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 6px;
  height: 1px;
}
::-webkit-scrollbar-thumb {
  //滑块部分
  border-radius: 4px;
  background-color: rgba(144, 147, 153, 0.3);
  transition: background-color 0.3s;
}
::-webkit-scrollbar-track {
  //轨道部分
  // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  // background: #ededed;
  background: transparent;
}
</style>
