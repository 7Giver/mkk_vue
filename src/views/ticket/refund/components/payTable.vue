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
        label="下单账号"
        prop="ticketAccountDetail"
        align="center"
        show-overflow-tooltip
        sortable
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
      <el-table-column
        label="支付时间"
        prop="insertTime"
        align="center"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.insertTime }}</el-tag>
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
