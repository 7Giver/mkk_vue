<template>
  <!-- 我的订单 -->
  <div class="mine-orders">
    <show-more :showHeight="110" v-show="showSearch">
      <el-form
        :model="queryParams"
        ref="queryForm"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="订单号" prop="order">
              <el-input
                v-model="queryParams.orderNo"
                placeholder="请输入订单号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购单号" prop="orderNum">
              <el-input
                v-model="queryParams.orderNum"
                placeholder="请输入采购单号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付渠道" prop="payChannel">
              <el-select
                v-model="queryParams.payChannel"
                placeholder="请选择支付渠道"
                clearable
              >
                <el-option
                  v-for="dict in payChannelList"
                  :key="dict.id"
                  :label="dict.fullName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付流水号" prop="payNo">
              <el-input
                v-model="queryParams.payNo"
                placeholder="请输入支付流水号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="进单时间" prop="insertRange">
              <el-date-picker
                v-model="insertRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="insertDateChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="政策代码" prop="outPolicyId">
              <el-input
                v-model="queryParams.outPolicyId"
                placeholder="请输入政策代码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="航司码" prop="airlineId">
              <el-input
                v-model="queryParams.airlineId"
                placeholder="请输入航司二字码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="乘客姓名" prop="passNameLink">
              <el-input
                v-model="queryParams.passNameLink"
                placeholder="请输入姓名"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="票号" prop="ticketNo">
              <el-input
                v-model="queryParams.ticketNo"
                placeholder="票号长度为10位"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="起飞时间" prop="beginDepTime">
              <el-date-picker
                v-model="queryParams.beginDepTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="舱位" prop="cabinCodeLink">
              <el-input
                v-model="queryParams.cabinCodeLink"
                placeholder="请输入舱位"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </show-more>

    <el-row :gutter="10" style="bottom: 8px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:job:export']"
        >
          导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-plus"
          size="mini"
          plain
          @click="handlePullOrder"
          v-hasPermi="['system:user:export']"
        >
          手动拉单
        </el-button>
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
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="订单号"
        prop="orderNo"
        :show-overflow-tooltip="true"
        width="200"
        align="center"
      />
      <el-table-column
        label="行程类型"
        prop="tripTypeDes"
        width="110"
        align="center"
      />
      <el-table-column
        label="政策号"
        prop="outPolicyId"
        width="110"
        align="center"
      />
      <el-table-column
        label="政策类型"
        prop="policyTypeDes"
        :show-overflow-tooltip="true"
        width="170"
        align="center"
      />
      <el-table-column
        label="乘机人"
        prop="passNameLink"
        width="110"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="订单状态"
        prop="handleStatusDes"
        width="110"
        align="center"
      />
      <el-table-column
        label="操作人员"
        prop="operatorName"
        width="110"
        align="center"
      />
      <el-table-column
        label="备注"
        prop="notes"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column label="出票速率(min)" prop="orderSpeed" align="center" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.createTime }}</el-tag>
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
            icon="el-icon-key"
            @click="handleOrderLock(scope.row)"
            v-if="scope.row.operator == account"
          >
            {{ scope.row.handleStatus == 1 ? "解锁" : "锁单" }}
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="goDetail(scope.row.orderNo)"
          >
            详情
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

    <!-- 手动拉单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openPull"
      width="530px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="pullRules" label-width="80px">
        <el-row>
          <el-form-item label="订单来源" :required="true">
            <el-select
              v-model="typeId"
              placeholder="请选择来源"
              @change="typeChange"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="店铺名称" prop="orderNo">
            <el-select
              v-model="form.otaAccountId"
              placeholder="请选择对应的店铺"
              :disabled="typeId == undefined"
            >
              <el-option
                v-for="dict in otaAccountList"
                :key="dict.id"
                :label="dict.fullName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单号" prop="orderNo">
            <el-input
              v-model="form.orderNo"
              placeholder="请输入订单号"
              clearable
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pullCancel">取 消</el-button>
        <el-button type="primary" @click="pullSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrder,
  orderDetail,
  addOrder,
  updateOrder,
  delOrder,
  pullOrder,
  orderLock,
  orderUnLock,
  exportOrders,
} from "@/api/ticket/order";
import { listChannelPay } from "@/api/configure/channel";
import { typeAccount } from "@/api/configure/otaAccount";
export default {
  name: "mineOrders",
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 选择来源id
      typeId: undefined,
      // 显示手动拉单弹出
      openPull: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      fullNames: "",
      // 表单数据
      dataList: [],
      // 日期范围
      dateRange: [],
      typeOptions: [],
      payChannelList: [],
      otaAccountList: [],
      // 进单日期范围
      insertRange: [],
      // 查询参数
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: "create_time asc",
        operator: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      pullRules: {
        otaAccountId: [
          { required: true, message: "店铺不能为空", trigger: "blur" },
        ],
        orderNo: [
          { required: true, message: "订单号不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initData();
    this.getList();
    this.getAllPayChannel();
  },
  computed: {
    account() {
      return this.$store.getters.account;
    },
  },
  methods: {
    initData() {
      const range = 3600 * 1000 * 24 * 7;
      let beginTime = this.parseTime(new Date() - range, "{y}-{m}-{d}");
      let endTime = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.queryParams.beginInsertTime = beginTime;
      this.queryParams.endInsertTime = endTime;
      this.insertRange = [beginTime, endTime];
      this.getStatusOptionsFun();
    },
    // 获取订单列表
    async getList() {
      this.loading = true;
      this.queryParams.operator = this.account;
      let { data } = await listOrder(this.queryParams);
      this.dataList = data.dataList.length ? data.dataList : [];
      this.total = data.totalPage;
      this.loading = false;
    },
    // 获取所有支付渠道
    async getAllPayChannel() {
      let { data } = await listChannelPay();
      this.payChannelList = data.length ? data : [];
    },
    // 获取订单详情
    async getOrderDetail(id) {
      let { data } = await orderDetail(id);
      // console.log(data);
    },
    // 根据来源类型请求店铺
    async getOtaAccount(id) {
      let { data } = await typeAccount(id);
      this.otaAccountList = data.length ? data : [];
    },
    // 下载订单文件
    async getExportOrders() {
      let { data } = await exportOrders(this.queryParams);
      if (!data) {
        this.msgWarning("缺少文件名");
        return;
      }
      // console.log(data);
      this.download(data, "出票报表.xlsx");
    },
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
    // 进单日期监听
    insertDateChange(e) {
      if (!e || !e.length) {
        console.log("缺少日期值");
        return;
      }
      this.queryParams.beginInsertTime = e[0];
      this.queryParams.endInsertTime = e[1];
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        account: undefined,
        fullName: undefined,
        status: undefined,
        otaAccountId: undefined,
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
    // 监听订单来源
    typeChange(id) {
      this.otaAccountList = [];
      this.$set(this.form, "otaAccountId", undefined);
      this.getOtaAccount(id);
    },
    // 取消按钮
    pullCancel() {
      this.reset();
      this.openPull = false;
    },
    // 点击手动拉单
    handlePullOrder() {
      this.reset();
      this.openPull = true;
      this.title = "手动拉单";
    },
    // 锁单/解锁
    handleOrderLock(row) {
      let orderNo = row.orderNo;
      if (!orderNo) {
        this.msgError("缺少订单号");
        return;
      }
      if (row.handleStatus == 1) {
        this.$confirm("是否确认解锁?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return orderUnLock({ id: orderNo });
          })
          .then(() => {
            this.getList();
            this.msgSuccess("解锁成功");
          })
          .catch(() => {});
      } else {
        this.$confirm("是否确认锁单?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return orderLock({ id: orderNo });
          })
          .then(() => {
            this.getList();
            this.msgSuccess("锁单成功");
          })
          .catch(() => {});
      }
    },
    // 手动拉单提交
    pullSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          pullOrder(this.form).then((response) => {
            this.msgSuccess("拉单成功");
            this.openPull = false;
            this.getList();
          });
        }
      });
    },
    // 跳转订单详情页面
    goDetail(order) {
      this.$router.push({ path: "detail", query: { order: order } });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.getExportOrders();
      });
    },
  },
};
</script>

<style scoped>
.el-select {
  display: block;
}
.el-range-editor {
  width: 100%;
}
</style>
