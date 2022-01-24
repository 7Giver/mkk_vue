<template>
  <div class="container">
    <el-table :data="tableData" :span-method="objectSpanMethod">
      <el-table-column
        prop="cabinType"
        label="舱位等级"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="cabinCode"
        label="舱位代码"
        align="center"
      ></el-table-column>
      <el-table-column label="配送信息">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="地址">
          <el-table-column prop="province" label="省份"></el-table-column>
          <el-table-column prop="city" label="市区"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="zip" label="邮编"></el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testData: {
        date: "2016-05-07",
        name: "王小虎",
        province: "上海",
        city: "普陀区",
        address: "上海市普陀区金沙江路 1518 弄",
        zip: 200333,
        cabinType: "头等舱",
        cabinCode: "F",
      },
    };
  },
  computed: {
    tableData() {
      return Array.from({ length: 10 }, (v) => this.testData);
    },
  },
  created() {
    console.log(this.tableData);
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log("row", row);
      // console.log("column", column);
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return [2, 1];
        } else {
          return [0, 0];
        }
      }
    },
  },
};
</script>

<style scoped></style>
