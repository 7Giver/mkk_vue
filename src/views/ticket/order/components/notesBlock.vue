<template>
  <div class="tips-table">
    <el-table :data="list">
      <el-table-column label="用户" prop="operatorName" align="center" />
      <el-table-column
        label="内容"
        prop="message"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column label="备注时间" prop="insertTime" align="center">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.insertTime }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  methods: {},
};
</script>

<style></style>
