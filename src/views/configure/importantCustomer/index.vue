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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-folder-add"
          size="mini"
          @click="uploadFun"
          >批量上传
        </el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="560px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="三字码" prop="code">
              <el-input v-model="form.code" placeholder="请输入城市码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市名称" prop="fullName">
              <el-input v-model="form.fullName" placeholder="请输入城市名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="机场名称" prop="airportName">
              <el-input v-model="form.airportName" placeholder="请输入机场名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市类型" prop="cityType">
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
  listCustomer,
  addCustomer,
  updateCustomer,
  delCustomer,
  importBatch,
  customerExample,
} from "@/api/configure/importantCustomer";
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
      statusOptions: [
        {
          dictValue: 0,
          dictLabel: "国内",
        },
        {
          dictValue: 1,
          dictLabel: "国外",
        },
      ],
      // 表单校验
      rules: {
        airportName: [
          { required: true, message: "机场不能为空", trigger: "blur" },
        ],
        cityType: [
          { required: true, message: "类型不能为空", trigger: "blur" },
        ],
        code: [{ required: true, message: "码不能为空", trigger: "blur" }],
        fullName: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // this.loading = false;
    this.getList();
  },
  methods: {
    /** 查询账号列表 */
    async getList() {
      this.loading = true;
      let { data } = await listCustomer(this.queryParams);
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
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
      this.open = true;
      this.title = "添加账号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row);
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
            console.log(this.form);
            updateCustomer(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustomer(this.form).then((response) => {
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
          return delCustomer(roleIds);
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
        this.downloadFile("城市码模板.xlsx");
      });
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
    batchChangeFreeFun(e) {
      this.openFullScreen();
      var fd = new FormData();
      var length = e.target.files.length;
      for (var i = 0; i < length; i++) {
        fd.append("multipartFile", e.target.files[i]);
      }
      addByExcel(fd)
        .then((res) => {
          this.loading.close();
          this.$refs.uploadFun.value = null;
          this.getList();
        })
        .catch((res) => {
          this.loading.close();
          this.$refs.uploadFun.value = null;
          this.getList();
        });
    },
    uploadFun() {
      this.$refs.uploadFun.dispatchEvent(new MouseEvent("click"));
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
