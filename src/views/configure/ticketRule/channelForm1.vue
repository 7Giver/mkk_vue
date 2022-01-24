<template>
  <div class="channel-container">
    <div class="channel-list" v-for="(item, index) in data" :key="index">
      <h3>{{ item.fullName }}</h3>
      <el-form :model="form" ref="form" label-width="80px">
        <el-row v-for="(formItem, idx) in form.content" :key="idx" :gutter="0">
          <el-col :span="7">
            <el-form-item
              label="出票渠道"
              :prop="`content.${idx}.ticketChannelId`"
              :rules="rules.ticketChannelId"
            >
              <el-select
                v-model="formItem.ticketChannelId"
                placeholder="请选择渠道"
                clearable
              >
                <el-option
                  v-for="dict in item.children"
                  :key="dict.id"
                  :label="dict.fullName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="最多赚"
              :prop="`content.${idx}.maxCash`"
              :rules="rules.maxCash"
            >
              <el-input
                v-model="formItem.maxCash"
                type="number"
                placeholder="最大盈利（包含）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="最少赚"
              :prop="`content.${idx}.minCash`"
              :rules="rules.minCash"
            >
              <el-input
                v-model="formItem.minCash"
                type="number"
                placeholder="最大亏损（包含）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center">
            <el-button
              class="my-btn"
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="addFormRow(index)"
              v-if="idx === 0 && form.content.length < data.length"
            ></el-button>
            <el-button
              class="my-btn"
              type="text"
              icon="el-icon-remove-outline"
              @click="deleteFormRow(index)"
              v-else
            ></el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "channelForm",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      form: {
        content: [
          {
            ticketChannelId: "",
            maxCash: "",
            minCash: "",
          },
        ],
      },
      rules: {
        ticketChannelId: [
          { required: true, message: "渠道不能为空", trigger: "blur" },
          { validator: this.validateChannel, trigger: "change" },
        ],
        maxCash: [
          { required: true, message: "最大盈利不能为空", trigger: "blur" },
        ],
        minCash: [
          { required: true, message: "最少盈利不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {

    addFormRow(index) {
      // console.log(this.$refs.form[index]);
      let content = this.$refs.form[index].model.content;
      content.push({
        ticketChannelId: "",
        maxCash: "",
        minCash: "",
      });
    },
    deleteFormRow() {},
  },
};
</script>

<style></style>
