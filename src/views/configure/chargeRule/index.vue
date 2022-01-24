<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
      size="small"
    >
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
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-folder-add"
          size="mini"
          @click="uploadFun"
        >
          批量上传
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleFile"
          plain
        >
          模板下载
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          plain
          @click="handleDelete"
        >
          删除
        </el-button>
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
      <el-table-column
        prop="cabinCodeLink"
        label="舱位代码"
        align="center"
      ></el-table-column>
      <el-table-column label="退票费" align="center">
        <el-table-column
          prop="refundFirstPercent"
          :label="tableHeader.refundFirstTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="refundSecondPercent"
          :label="tableHeader.refundSecondTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="refundThreePercent"
          :label="tableHeader.refundThreeTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="refundEndPercent"
          :label="tableHeader.refundEndTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="改签费" align="center">
        <el-table-column
          prop="changeFirstPercent"
          :label="tableHeader.changeFirstTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="changeSecondPercent"
          :label="tableHeader.changeSecondTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="changeThreePercent"
          :label="tableHeader.changeThreeTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="changeEndPercent"
          :label="tableHeader.changeEndTime"
          :formatter="dataFormatter"
          align="center"
        ></el-table-column>
      </el-table-column>
    </el-table>

    <!-- 设置或修改表格 -->
    <!-- <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="720px"
    >
      <headerForm ref="headerForm" v-if="status == 0"></headerForm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  listChargeRule,
  delChargeRule,
  addByExcel,
} from "@/api/configure/chargeRule.js";
import { listAirlineAll } from "@/api/configure/airline";
// import headerForm from "./headerForm.vue";
export default {
  name: "chargeRule",
  components: {
    // headerForm,
  },
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      status: 0, // 0表头弹窗 1表单
      title: "",
      headTitle: "",
      open: false,
      headOpen: false,
      dataList: [],
      airlineOptions: [],
      tableHeader: {
        refundFirstTime: "",
      },
      queryParams: {
        nameValue: undefined,
        perPage: 10,
        page: 1,
        orderBy: undefined,
      },
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
    // console.log(this.tableData);
    this.getAirlineList();
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
    /** 查询列表 */
    async getList() {
      this.loading = true;
      let { data } = await listChargeRule(this.queryParams);
      if (data.length == 0) {
        this.dataList = [];
        this.loading = false;
        return;
      }
      this.dataList = data.chargeRuleList.length ? data.chargeRuleList : [];
      this.total = data.totalPage ? data.totalPage : 0;
      this.tableHeader = {
        refundFirstTime: data.refundFirstTime
          ? String(data.refundFirstTime)
          : "0",
        refundSecondTime: data.refundSecondTime
          ? String(data.refundSecondTime)
          : "0",
        refundThreeTime: data.refundThreeTime
          ? String(data.refundThreeTime)
          : "0",
        refundEndTime: data.refundEndTime ? String(data.refundEndTime) : "0",
        changeFirstTime: data.changeFirstTime
          ? String(data.changeFirstTime)
          : "0",
        changeSecondTime: data.changeSecondTime
          ? String(data.changeSecondTime)
          : "0",
        changeThreeTime: data.changeThreeTime
          ? String(data.changeThreeTime)
          : "0",
        changeEndTime: data.changeEndTime ? String(data.changeEndTime) : "0",
      };
      // console.log("tableHeader", this.tableHeader);
      this.loading = false;
    },
    // 获取航司列表
    async getAirlineList() {
      let { data } = await listAirlineAll();
      this.airlineOptions = data.length ? data : [];
      this.airlineOptions.shift();
      this.$set(this.queryParams, "airlineId", this.airlineOptions[0].id);
      this.getList();
    },
    // 表格数据格式化
    dataFormatter(row, column) {
      for (const key in row) {
        const item = row[key];
        if (
          key != "cabinCodeLink" &&
          key != "airlineId" &&
          key != "id" &&
          key != "sortCode"
        ) {
          return (item = item + "%");
        }
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 删除按钮操作 */
    handleDelete() {
      let airlineId = this.queryParams.airlineId;
      if (!airlineId) {
        this.msgWarning("请选择航司");
        return;
      }
      this.$confirm("是否删除该航司的规则?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delChargeRule(airlineId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 下载操作 */
    handleFile() {
      this.$confirm("是否下载模板?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.downloadFile("退改客规模板.xlsx");
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
    // 点击上传
    uploadFun() {
      if (!this.queryParams.airlineId) {
        this.msgWarning("请选择航司");
        return;
      }
      this.$refs.uploadFun.dispatchEvent(new MouseEvent("click"));
    },
    // 上传前处理
    batchChangeFreeFun(e) {
      this.openFullScreen();
      var fd = new FormData();
      var length = e.target.files.length;
      for (var i = 0; i < length; i++) {
        fd.append("multipartFile", e.target.files[i]);
      }
      fd.append("airlineId", this.queryParams.airlineId);
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
    // submitForm() {
    // let result = this.$refs.headerForm.getFormData();
    // console.log("result", result);
    // if (result.valid) {
    //   console.log("params", params);
    //   this.open = false;
    // }
    // },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0px 20px;
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
</style>
