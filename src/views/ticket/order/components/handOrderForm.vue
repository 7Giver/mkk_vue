<template>
  <div class="container" v-loading="loading">
    <el-table :data="list">
      <el-table-column label="渠道" prop="ticketChannelName" align="center" />
      <el-table-column label="采购价" prop="realPayPrice" align="center" />
      <el-table-column label="拉单价" prop="realTotalPrice" align="center" />
      <el-table-column label="舱位" prop="cabinCodeLink" align="center" />
      <el-table-column label="利润" prop="realProfitPrice" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-position"
            @click="goSendTicket(scope.row)"
          >
            出票
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "handOrderForm",
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
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
    goSendTicket(row) {
      this.$emit("emit", row.ticketChannelId);
    },
  },
};
</script>

<style scoped>
.container {
  max-height: 450px;
  overflow-y: scroll;
}
</style>
