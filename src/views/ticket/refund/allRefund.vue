<template>
  <!-- 所有退票 -->
  <div class="all-refund">
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
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:job:export']"
        >
          导出
        </el-button>
      </el-col> -->
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
    <el-table v-loading="loading" :data="dataList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="航司"
        prop="airlineCode"
        align="center"
        width="100"
      />
      <el-table-column
        label="ota平台信息"
        prop="otaMsg"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <div class="mix-item left" v-for="(item, idx) in scope.row.otaMsg">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="政策号"
        prop="outPolicyId"
        align="center"
        width="130"
      />
      <el-table-column
        label="乘机人"
        prop="passNameLink"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <div class="mix-item" v-for="(item, idx) in scope.row.passNameLink">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        prop="handleStatusDes"
        align="center"
        width="100"
      />
      <el-table-column
        label="操作人员"
        prop="operatorName"
        align="center"
        width="120"
      />
      <el-table-column
        label="备注"
        prop="notes"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
        sortable
      >
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleOrderLock(scope.row)"
            v-if="scope.row.lockStatus == 0"
          >
            锁单
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleOrderUnLock(scope.row)"
            v-if="scope.row.lockStatus == 1 && scope.row.operator == account"
          >
            解锁
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="goDetail(scope.row.id)"
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
    <el-dialog :title="title" :visible.sync="openPull" width="530px">
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
              :loading="selectLoading"
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
  listRefundOrder,
  pullRefundOrder,
  refundOrderLock,
  refundOrderUnLock,
  exportRefundOrder,
} from "@/api/ticket/refundOrder.js";
import { listChannelPay } from "@/api/configure/channel";
import { typeAccount } from "@/api/configure/otaAccount";
export default {
  name: "allOrders",
  data() {
    return {
      showSearch: true,
      typeId: undefined, // 选择来源id
      openPull: false,
      loading: true,
      selectLoading: true,
      total: 0,
      title: "",
      fullNames: "",
      dataList: [],
      dateRange: [],
      typeOptions: [],
      payChannelList: [],
      otaAccountList: [],
      insertRange: [], //进单日期范围
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: "insert_time desc",
      },
      form: {},
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
    // this.getAllPayChannel();
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
      let { data } = await listRefundOrder(this.queryParams);
      const dataList = data.dataList;
      if (dataList.length) {
        // 处理数据，整合字段
        dataList.forEach((item) => {
          item.otaMsg = [item.otaTypeDes, item.otaAccountName, item.orderNo];
          item.passNameLink = item.passNameLink.split(",");
        });
      }
      this.dataList = dataList.length ? dataList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.loading = false;
      this.$emit("change");
    },
    // 获取所有支付渠道
    async getAllPayChannel() {
      let { data } = await listChannelPay();
      this.payChannelList = data.length ? data : [];
    },
    // 根据来源类型请求店铺
    async getOtaAccount(id) {
      let { data } = await typeAccount(id);
      this.selectLoading = false;
      this.otaAccountList = data.length ? data : [];
    },
    // 下载订单文件
    // async getExportOrders() {
    //   let { data } = await exportRefundOrder(this.queryParams);
    //   if (!data) {
    //     this.msgWarning("缺少文件名");
    //     return;
    //   }
    //   // console.log(data);
    //   this.download(data, "出票报表.xlsx");
    // },
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
      // console.log(this.queryParams);
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
    // 订单锁单
    handleOrderLock(row) {
      let orderId = row.id;
      if (!orderId) {
        this.msgWarning("缺少退票ID");
        return;
      }
      this.$confirm("是否确认锁单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return refundOrderLock({ id: orderId });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("锁单成功");
        })
        .catch(() => {});
    },
    // 订单解锁
    handleOrderUnLock(row) {
      let orderId = row.id;
      if (!orderId) {
        this.msgWarning("缺少退票ID");
        return;
      }
      this.$confirm("是否确认解锁?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return refundOrderUnLock({ id: orderId });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("解锁成功");
        })
        .catch(() => {});
    },
    // 手动拉单提交
    pullSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          pullRefundOrder(this.form).then((response) => {
            this.msgSuccess("拉单成功");
            this.openPull = false;
            this.getList();
          });
        }
      });
    },
    // 跳转退票详情页面id
    goDetail(id) {
      this.$router.push({ name: "refundDetail", params: { orderId: id } });
      // this.$router.push("order-detail/order/" + order);
    },
    /** 导出按钮操作 */
    handleExport() {
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
.mix-item {
  text-align: center;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
.left {
  text-align: left;
}
</style>
