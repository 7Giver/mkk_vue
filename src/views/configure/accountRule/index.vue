<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
      <el-form-item label="规则类型" prop="ruleType">
        <el-select
          v-model="queryParams.ruleType"
          :default-first-option="true"
          placeholder="请选择规则"
          clearable
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="航司" prop="airlineId">
        <el-select
          v-model="queryParams.airlineId"
          :default-first-option="true"
          placeholder="请选择/检索航司"
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
      <el-form-item label="店铺" prop="otaAccountId">
        <el-select
          v-model="queryParams.otaAccountId"
          placeholder="请选择/检索店铺"
          filterable
          clearable
        >
          <el-option
            v-for="dict in otaOptions"
            :key="dict.id"
            :label="dict.fullName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="政策代码" prop="policyCodeStr">
        <el-input
          v-model="queryParams.policyCodeStr"
          placeholder="请输入政策代码"
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column
        label="店铺名称"
        prop="otaAccountName"
        width="120"
        align="center"
      />
      <el-table-column
        label="航司名称"
        prop="airlineName"
        :show-overflow-tooltip="true"
        width="140"
        align="center"
      />
      <el-table-column
        label="二字码"
        prop="airlineCode"
        width="100"
        align="center"
      />
      <el-table-column
        label="仓位"
        prop="cabinCodeStr"
        width="100"
        align="center"
      />
      <el-table-column
        label="政策"
        prop="policyCodeStr"
        width="100"
        align="center"
      />
      <el-table-column
        label="规则类型"
        prop="ruleTypeDes"
        width="140"
        align="center"
      ></el-table-column>
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="550px"
      @closed="reset"
    >
      <el-form
        class="my-form"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="店铺" prop="otaAccountId">
              <el-select
                class="row-select"
                v-model="form.otaAccountId"
                placeholder="请选择/检索店铺"
                filterable
                clearable
              >
                <el-option
                  v-for="dict in otaOptions"
                  :key="dict.id"
                  :label="dict.fullName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仓位" prop="cabinCodeStr">
              <el-input
                v-model="form.cabinCodeStr"
                placeholder="多个仓位用英文逗号分割"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="政策开头" prop="policyCodeStr">
              <el-input
                v-model="form.policyCodeStr"
                placeholder="多个政策用英文逗号分割"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规则类型" prop="ruleType">
              <el-radio-group v-model="form.ruleType">
                <el-radio
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="状态" prop="status">
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
  listRule,
  addRule,
  updateRule,
  delRule,
} from "@/api/configure/accountRule";
import { listAccountAll } from "@/api/configure/otaAccount";
import { listAirlineAll } from "@/api/configure/airline";

export default {
  name: "accountRule",
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
      // 规则表格数据
      dataList: [],
      airlineOptions: [],
      otaOptions: [],
      statusOptions: [],
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
        policyCodeStr: undefined,
        otaAccountId: undefined,
        airlineId: undefined,
        ruleType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        otaAccountId: [
          { required: true, message: "店铺不能为空", trigger: "blur" },
        ],
        airlineId: [
          { required: true, message: "航司不能为空", trigger: "blur" },
        ],
        ruleType: [
          { required: true, message: "规则不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initData();
    this.getList();
    this.getOtaList();
    this.getAirlineList();
  },
  methods: {
    initData() {
      this.getStatusOptionsFun();
      this.queryParams.ruleType = 0;
    },
    //返回显示状态的可选
    getStatusOptionsFun() {
      this.typeOptions = [
        {
          dictValue: 0,
          dictLabel: "拉单规则",
        },
        {
          dictValue: 1,
          dictLabel: "退票规则",
        },
        {
          dictValue: 2,
          dictLabel: "改签规则",
        },
      ];
    },
    /** 查询规则列表 */
    async getList() {
      this.loading = true;
      let { data } = await listRule(this.queryParams);
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
    },
    // 获取店铺列表
    async getOtaList() {
      let { data } = await listAccountAll();
      this.otaOptions = data.length ? data : [];
    },
    // 获取航司列表
    async getAirlineList() {
      let { data } = await listAirlineAll();
      this.airlineOptions = data.length ? data : [];
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
      // console.log(this.form);
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
      this.title = "添加规则";
      this.form = {
        cabinCodeStr: "*",
        policyCodeStr: "*",
        // ruleType: 0,
        status: 0,
      };
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const roleId = row.id || this.ids;
      let copy = this.deepClone(row);
      this.form = {
        id: copy.id,
        otaAccountId: copy.otaAccountId,
        airlineId: copy.airlineId,
        cabinCodeStr: copy.cabinCodeStr,
        policyCodeStr: copy.policyCodeStr,
        ruleType: copy.ruleType,
        status: copy.status,
      };
      this.title = "修改规则";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          if (this.form.id) {
            updateRule(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRule(this.form).then((response) => {
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
      const fullNames = row.otaAccountName;
      this.$confirm('是否确认删除名称为"' + fullNames + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delRule(roleIds);
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
.my-form {
  padding: 0 16px;
}
</style>
