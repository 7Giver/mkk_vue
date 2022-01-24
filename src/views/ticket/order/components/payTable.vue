<template>
  <div class="pay-container">
    <el-table :data="list">
      <el-table-column
        label="乘客姓名"
        prop="passNameLink"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="出票渠道"
        prop="ticketChannelName"
        align="center"
      />
      <el-table-column
        label="下单账号"
        prop="ticketAccountDetail"
        align="center"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="采购订单号"
        prop="createOrderNo"
        align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        label="支付方式"
        prop="payChannelName"
        align="center"
        width="100"
      />
      <el-table-column
        label="支付账号"
        prop="payAccountDetail"
        align="center"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        label="支付流水"
        prop="payNo"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="支付金额"
        prop="realPayPrice"
        align="center"
        width="120"
        sortable
      />
      <el-table-column
        label="优惠金额"
        prop="realDiscountPrice"
        align="center"
        width="120"
        sortable
      />
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="scope">
          <el-tag effect="plain" size="small" :type="typeValue(scope)">
            {{ scope.row.status ? "无效" : "有效" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="支付时间"
        prop="payTime"
        align="center"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.payTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="goEdit(scope.$index)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "payTable",
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    typeValue({ row }) {
      let type = row.status ? "danger" : "";
      return type;
    },
    goEdit(index) {
      this.$emit("emit", index);
    },
  },
};
</script>
