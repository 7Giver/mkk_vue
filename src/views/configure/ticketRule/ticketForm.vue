<template>
  <div class="form-container">
    <el-form class="my-form" ref="form" :model="form" label-width="78px">
      <el-row
        v-for="(item, index) in form.content"
        :key="index"
        :gutter="0"
        v-show="status == 0"
      >
        <el-form-item
          label="出票组"
          :prop="`content.${index}.ticketGroupType`"
          :rules="rules.ticketGroupType"
        >
          <el-select
            v-model="item.ticketGroupType"
            placeholder="请选择出票组"
            clearable
          >
            <el-option
              v-for="dict in list"
              :key="dict.id"
              :label="dict.fullName"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="最多赚"
          :prop="`content.${index}.realMaxPrice`"
          :rules="rules.realMaxPrice"
        >
          <el-input
            v-model.number="item.realMaxPrice"
            type="number"
            placeholder="最大盈利（包含）"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="最少赚"
          :prop="`content.${index}.realMinPrice`"
          :rules="rules.realMinPrice"
        >
          <el-input
            v-model.number="item.realMinPrice"
            type="number"
            placeholder="最大亏损（包含）"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="优先级"
          :prop="`content.${index}.sortCode`"
          :rules="rules.sortCode"
        >
          <el-input
            v-model.number="item.sortCode"
            placeholder="请输入优先级"
          ></el-input>
        </el-form-item>
        <div style="text-align: center; flex: 1">
          <el-button
            class="my-btn"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="addFormRow"
            v-if="index === 0 && form.content.length < list.length"
          ></el-button>
          <el-button
            class="my-btn"
            type="text"
            icon="el-icon-remove-outline"
            @click="deleteFormRow(index)"
            v-else
          ></el-button>
        </div>
      </el-row>
      <!-- 渠道组件 -->
      <channel-form
        v-show="status == 1"
        ref="channelForm"
        :data="ticketChannel"
      ></channel-form>
    </el-form>
    <div class="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="nextSubmit" v-if="status == 0">
        下一步
      </el-button>
      <el-button type="primary" @click="submitForm" v-else-if="status == 1">
        确 定
      </el-button>
    </div>
  </div>
</template>

<script>
// 提交时金额都 * 1
import { mapState } from "vuex";
import {
  ticketList,
  ListTicketChannel,
  listTicketGroup,
} from "@/api/configure/ticketRule.js";
import channelForm from "./channelForm.vue";
export default {
  name: "ticketForm",
  props: {
    // 减少请求从父级传入
    list: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    id: {
      type: String,
      default: "",
    },
  },
  components: {
    channelForm,
  },
  data() {
    return {
      status: 0,
      ticketChannel: [],
      form: {
        content: [
          {
            ticketGroupType: "",
            maxPrice: undefined,
            minPrice: undefined,
            realMaxPrice: undefined,
            realMinPrice: undefined,
            sortCode: undefined,
            channelList: [],
          },
        ],
      },
      rules: {
        ticketGroupType: [
          { validator: this.validateChannel, trigger: "change" },
        ],
        realMaxPrice: [
          { required: true, message: "最大盈利不能为空", trigger: "blur" },
          {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: "小数点后保留两位",
            trigger: "blur",
          },
        ],
        realMinPrice: [
          { required: true, message: "最大亏损不能为空", trigger: "blur" },
          {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: "小数点后保留两位",
            trigger: "blur",
          },
        ],
        sortCode: [
          { required: true, message: "优先级不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      ruleData: (state) => state.ticketRule.ruleData,
    }),
  },
  created() {
    if (this.data.length) {
      this.form.content = this.data;
    }
  },
  methods: {
    // 获取选择出票组对应渠道
    async getTicketList(list) {
      let queryParams = {
        idList: list,
      };
      let { data } = await ticketList(queryParams);
      if (!data.length) {
        console.log("getTicketList暂无数据");
        return;
      }
      this.ticketChannel = data.length ? data : [];
      // console.log('data', this.data);
      if (this.ruleData.id && this.id) {
        this.getChannelIdList(this.ruleData.id);
      } else {
        let newArr = [];
        this.form.content.forEach((item) => {
          item.channelList.forEach((el) => {
            newArr.push({
              ticketChannelId: el.id,
              parentId: el.parentId,
              fullName: el.fullName,
              sortCode: el.sortCode,
            });
          });
        });
        this.ticketChannel = this.resultChannelList(newArr, this.ticketChannel);
        this.status = 1;
      }
    },
    // 获取出票规则对应渠道
    async getChannelIdList(id) {
      let { data } = await ListTicketChannel({
        id: id,
      });
      let hasList = data.length ? data : [];
      this.ticketChannel = this.resultChannelList(hasList, this.ticketChannel);
      console.log("ticketChannel", this.ticketChannel);
      this.status = 1;
    },
    addFormRow() {
      this.form.content.push({
        ticketGroupType: "",
        maxPrice: undefined,
        minPrice: undefined,
        realMaxPrice: undefined,
        realMinPrice: undefined,
        sortCode: undefined,
        channelList: [],
      });
    },
    deleteFormRow(index) {
      this.form.content.splice(index, 1);
    },
    validateChannel(rule, value, callback) {
      if (!value) {
        return callback(new Error("请选择出票组"));
      }
      let sameList = this.form.content.filter(
        (item) => item.ticketGroupType === value
      );
      if (sameList.length > 1) {
        return callback(new Error("渠道不得重复"));
      }
      return callback();
    },
    reset() {
      this.status = 0;
      this.ticketChannel = [];
      this.form = this.$options.data().form;
      this.resetForm("form");
    },
    cancel() {
      this.reset();
      this.$emit("close");
    },
    nextSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          let arr = this.form.content.map((item) => item.ticketGroupType);
          arr.length && this.getTicketList(arr);
        }
      });
    },
    submitForm() {
      const cloneData = this.deepClone(this.ticketChannel);
      const cloneParent = this.deepClone(this.form.content);
      let children = [];
      cloneData.forEach((el) => {
        if (el.children && el.children.length) {
          el.children.forEach((c) => {
            if (c.checked === true) {
              children.push(c);
            }
          });
        }
      });
      cloneParent.forEach((el, index) => {
        let channelList = [];
        el.maxPrice = Math.round(el.realMaxPrice * 100);
        el.minPrice = Math.round(el.realMinPrice * 100);
        children.forEach((c) => {
          if (el.ticketGroupType == c.parentId) {
            channelList.push(c);
          }
        });
        el.channelList = channelList;
      });
      // console.log("cloneParent", cloneParent);
      this.$emit("submit", cloneParent);
      this.reset();
    },
    // 处理获得渠道数组
    resultChannelList(source, list) {
      if (!source.length) {
        console.log("resultChannelList error -> source为空");
        return list;
      }
      if (!list.length) {
        console.log("resultChannelList error -> list不得为空");
        return null;
      }
      let newArr = this.deepClone(list);
      source.forEach((item) => {
        newArr.forEach((el) => {
          let children = el.children;
          if (children.length) {
            children.forEach((val) => {
              if (item.ticketChannelId == val.id) {
                val.sortCode = item.sortCode;
                val.checked = true;
              }
            });
          }
        });
      });
      // console.log("newArr", newArr);
      return newArr;
    },
  },
};
</script>

<style scoped>
.my-form {
  padding-top: 10px;
}
.el-row {
  display: flex;
  justify-content: center;
}
.el-form-item {
  flex: 4;
}
.my-btn {
  font-size: 18px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
.title {
  font-size: 16px;
  line-height: 24px;
  color: #303133;
  font-weight: normal;
}
</style>
