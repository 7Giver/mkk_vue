<template>
  <div class="time-input">
    <el-popover
      placement="bottom"
      width="280"
      trigger="click"
      v-model="visible"
    >
      <div class="form-content">
        <el-form ref="form" :model="form" :rules="rules" label-width="50px">
          <el-form-item label="天数" prop="days">
            <el-input v-model.number="form.days" placeholder="请输入天数" />
          </el-form-item>
          <el-form-item label="小时" prop="hours">
            <el-input v-model.number="form.hours" placeholder="请输入小时数" />
          </el-form-item>
          <el-form-item label="分钟" prop="minutes">
            <el-input
              v-model.number="form.minutes"
              placeholder="请输入分钟数"
            />
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button size="small" type="primary" @click="handleSubmit">
            确 定
          </el-button>
        </div>
      </div>
      <el-button slot="reference" style="width: 100%">
        {{ value.result ? value.result : "请选择时间" }}
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          result: undefined,
        };
      },
    },
  },
  data() {
    return {
      visible: false,
      form: {},
      rules: {
        days: [
          { required: true, message: "天数不能为空", trigger: "blur" },
          { pattern: /^(0|\+?[1-9][0-9]*)$/, message: "请输入正整数" },
        ],
        hours: [
          { required: true, message: "小时不能为空", trigger: "blur" },
          { pattern: /^(0|\+?[1-9][0-9]*)$/, message: "请输入正整数" },
        ],
        minutes: [
          { required: true, message: "分钟不能为空", trigger: "blur" },
          { pattern: /^(0|\+?[1-9][0-9]*)$/, message: "请输入正整数" },
        ],
      },
    };
  },
  computed: {
    resultMintes() {
      let { days, hours, minutes } = this.form;
      let dayMin = days > 0 ? days * 24 * 60 : 0;
      let hourMin = hours > 0 ? hours * 60 : 0;
      let result = dayMin + hourMin + minutes;
      return result;
    },
  },
  methods: {
    // showContent() {
    //   this.visible = true;
    // },
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    cancel() {
      this.reset();
      this.visible = false;
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.result = this.resultMintes;
          this.$emit("input", this.deepClone(this.form));
          this.$emit("change");
          this.reset();
          this.visible = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.form-content {
  padding: 0 10px;
}
.footer {
  text-align: right;
}
</style>
