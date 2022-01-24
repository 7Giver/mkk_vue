<template>
  <div class="policy-container">
    <el-table :data="dataList" @header-click="addRow" stripe>
      <el-table-column label="操作" align="center" width="100">
        <template slot="header" slot-scope>
          <el-button type="text" icon="el-icon-circle-plus-outline">
            操作
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-remove-outline"
            @click="deleteRow(scope)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="舱位" prop="cabinCodeStr" align="center" sortable>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.cabinCodeStr"
            placeholder="舱位代码，逗号隔开"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="航班日期"
        prop="flightDateStr"
        align="center"
        width="170"
      >
        <template slot-scope="scope">
          <el-popover
            v-model="scope.row.dateVisible"
            placement="bottom"
            trigger="manual"
          >
            <!-- 日期区间组件 -->
            <date-range ref="dateRange"></date-range>
            <div class="footer">
              <el-button @click="resetDate(scope.row)">重 置</el-button>
              <el-button type="primary" @click="dateSubmit(scope.row)">
                确 定
              </el-button>
            </div>
            <el-button
              class="my-button"
              slot="reference"
              @click="scope.row.dateVisible = !scope.row.dateVisible"
            >
              <span v-if="scope.row.flightDateStr">
                {{ scope.row.flightDateStr }}
              </span>
              <span v-else>选择日期</span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="年龄区间"
        prop="ageRange"
        align="center"
        width="170"
      >
        <template slot-scope="scope">
          <el-popover
            v-model="scope.row.numberVisible"
            placement="bottom"
            trigger="manual"
            width="350"
          >
            <!-- 数字区间组件 -->
            <div class="number-content">
              <number-range
                ref="number"
                v-for="(item, index) in 2"
                :key="index"
                :min="1"
                :max="100"
              ></number-range>
              <div class="footer">
                <el-button @click="resetNumber(scope.row)">重 置</el-button>
                <el-button type="primary" @click="numberSubmit(scope.row)">
                  确 定
                </el-button>
              </div>
            </div>
            <el-button
              class="my-button"
              slot="reference"
              @click="scope.row.numberVisible = !scope.row.numberVisible"
            >
              <span v-if="scope.row.ageRange">{{ scope.row.ageRange }}</span>
              <span v-else>选择年龄</span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="适用航班" prop="matchFlight" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.matchFlight"
            placeholder="航班代码，逗号隔开"
          />
        </template>
      </el-table-column>
      <el-table-column label="排除航班" prop="excludeFlight" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.excludeFlight"
            placeholder="航班代码，逗号隔开"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="最大价格"
        prop="realMaxPrice"
        align="center"
        width="130"
        sortable
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.realMaxPrice"
            type="number"
            placeholder="最大价格"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="最小价格"
        prop="realMinPrice"
        align="center"
        width="130"
        sortable
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.realMinPrice"
            type="number"
            placeholder="最小价格"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="优先级"
        prop="sortCode"
        align="center"
        width="110"
        sortable
      >
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.sortCode" placeholder="优先级" />
        </template>
      </el-table-column>
      <el-table-column
        label="同舱出票"
        prop="isSameCabin"
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSameCabin"
            :active-value="0"
            :inactive-value="1"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="同票面出票"
        prop="isSameNetPrice"
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSameNetPrice"
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="出票组设置" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="channelSetting(scope.$index)"
            >设置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 出票组设置弹窗 -->
    <el-dialog
      title="出票组设置"
      width="900px"
      :visible.sync="open"
      :show-close="false"
    >
      <ticket-form
        v-if="open"
        ref="ticketForm"
        :list="ticketGroup"
        :data="ticketGroupList"
        :id="policyId"
        @close="ticketFormClose"
        @submit="ticketFormSubmit"
      ></ticket-form>
    </el-dialog>
  </div>
</template>

<script>
import { listTicketGroup } from "@/api/configure/ticketRule.js";
import numberRange from "./numberRange";
import ticketForm from "./ticketForm";
import dateRange from "./dateRange.vue";
export default {
  name: "policyForm",
  components: {
    dateRange,
    numberRange,
    ticketForm,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      policyId: "",
      tableIndex: 0,
      open: false,
      loading: true,
      ticketGroup: [], //出票组数据
      ticketGroupList: [],
      dataList: [
        {
          id: undefined,
          cabinCodeStr: undefined, //仓位
          matchFlight: undefined, //适用航班
          excludeFlight: undefined, //排除航班
          flightDateStr: undefined, //航班日期
          ageRange: undefined, //年龄区间
          isSameCabin: true, //是否同舱
          isSameNetPrice: true, //是否同票面
          maxPrice: undefined, //最大价格(分)
          minPrice: undefined, //最小价格(分)
          realMaxPrice: undefined, //最大价格(元)
          realMinPrice: undefined, //最小价格(元)
          dateVisible: false, //展示日期区间
          numberVisible: false, //展示年龄区间
          sortCode: undefined,
          ticketGroupList: [], //出票组
        },
      ],
    };
  },
  created() {
    // this.getRuleDetail();
    // console.log("data-->", this.data);
    this.data.length ? (this.dataList = this.data) : false;
    this.getTicketGroup();
  },
  methods: {
    // 获取出票组
    async getTicketGroup() {
      let { data } = await listTicketGroup();
      if (!data.length) {
        console.log("getTicketGroup暂无数据");
        return;
      }
      this.ticketGroup = data.length ? data : [];
    },
    //添加行
    addRow(column, event) {
      // console.log(column, event);
      if (column.label == "操作") {
        let pushItem = {
          id: undefined,
          cabinCodeStr: undefined,
          matchFlight: undefined,
          excludeFlight: undefined,
          flightDateStr: undefined,
          ageRange: undefined,
          isSameCabin: true,
          isSameNetPrice: true,
          maxPrice: undefined,
          minPrice: undefined,
          realMaxPrice: undefined,
          realMinPrice: undefined,
          dateVisible: false,
          numberVisible: false,
          sortCode: undefined,
          ticketGroupList: [],
        };
        this.dataList = [...this.dataList, pushItem];
      }
    },
    //删除行
    deleteRow(val) {
      this.dataList.splice(val.$index, 1);
    },
    // 出票组弹窗显示
    channelSetting(index) {
      this.tableIndex = index;
      // console.log(this.dataList);
      this.policyId = this.dataList[index].id ? this.dataList[index].id : "";
      let ticketGroupList = this.dataList[index].ticketGroupList;
      this.ticketGroupList = ticketGroupList;
      this.open = true;
    },
    // 出票组弹窗关闭
    ticketFormClose() {
      this.open = false;
    },
    // 日期数据写入
    dateSubmit(row) {
      const { form } = this.$refs.dateRange.getFormData();
      const dataArr = Object.values(form).filter((val) => val);
      if (!dataArr.length) {
        row.dateVisible = false;
        return;
      }
      let newArr = dataArr.map((item) => {
        let arr = item.map((val) => {
          return this.parseTime(val, "{y}-{m}-{d}");
        });
        let str = arr.join("/");
        return str;
      });
      let result = newArr.join(",");
      row.flightDateStr = result;
      row.dateVisible = false;
      console.log(newArr);
    },
    // 重置日期
    resetDate(row) {
      // console.log(row);
      row.flightDateStr = "";
      this.$refs.dateRange.resetForm();
    },
    // 年龄区间验证
    numberSubmit(row) {
      let dom = this.$refs.number;
      let numberResult = dom.map((item) => {
        return item.getFormData();
      });
      let filterArry = numberResult.filter(
        (item) => item.form.min && item.form.max
      );
      // console.log(filterArry);
      if (!filterArry.length) {
        row.numberVisible = false;
        return;
      }
      let every = filterArry.every((item) => item.valid == true);
      if (!every) return;
      // if (filterArry.length == 1) {
      //   this.resultNumberRange(row, filterArry);
      // } else if (filterArry.length == 2) {
      //   let obj1 = filterArry[0].form;
      //   let obj2 = filterArry[1].form;
      //   let flag = isIntersect(obj1, obj2);
      //   flag === false
      //     ? this.resultNumberRange(row, filterArry)
      //     : this.msgError("年龄不得有交集");
      // }
      this.resultNumberRange(row, filterArry);
      // 判断两个区间是否相交
      function isIntersect(obj1, obj2) {
        let start = [obj1.min, obj2.min];
        let end = [obj1.max, obj2.max];
        return Math.max(...start) <= Math.min(...end);
      }
    },
    // 重置年龄区间
    resetNumber(row) {
      row.ageRange = "";
      let dom = this.$refs.number;
      let numberResult = dom.forEach((item) => {
        item.form = {};
        item.resetForm();
      });
    },
    // 注入年龄范围
    resultNumberRange(row, arr) {
      let result = arr.map((item) => {
        return [item.form.min, item.form.max];
      });
      let newArr = result.map((item) => {
        return item.join("-");
      });
      row.ageRange = newArr.join(",");
      let dom = this.$refs.number;
      let numberResult = dom.forEach((item) => {
        item.form = {};
        item.resetForm();
      });
      row.numberVisible = false;
    },
    // 出票组表单接收传值
    ticketFormSubmit(data) {
      let dataList = this.dataList;
      dataList[this.tableIndex].ticketGroupList = data;
      dataList.forEach((item) => {
        item.maxPrice = Math.round(item.realMaxPrice * 100);
        item.minPrice = Math.round(item.realMinPrice * 100);
      });
      this.$emit("change", {
        data: this.dataList,
        index: this.tableIndex,
      });
      this.open = false;
    },
    reset() {
      this.dataList = this.$options.data().dataList;
      this.ticketGroup = this.$options.data().ticketGroup;
      this.tableIndex = this.$options.data().tableIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  padding: 10px 20px;
}
.my-button {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.number-content {
  padding: 8px 8px 6px;
  .el-form {
    padding-bottom: 18px;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
}
::v-deep .el-dialog__body {
  padding: 0 0 30px 0;
}
</style>
