<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item prop="min">
      <el-input
        v-model="form.min"
        placeholder="请输入最小值"
        @change="handleMinChange"
      />
    </el-form-item>
    <div class="inner-icon">~</div>
    <el-form-item prop="max">
      <el-input
        v-model="form.max"
        placeholder="请输入最大值"
        @change="handleMaxChange"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "numberRange",
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        min: [
          { required: false, message: "必填项，请维护", trigger: "blur" },
          { validator: this.validateCom, trigger: "change" },
          { validator: this.validateMin, trigger: "change" },
        ],
        max: [
          { required: false, message: "必填项，请维护", trigger: "blur" },
          { validator: this.validateCom, trigger: "change" },
          { validator: this.validateMax, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    getFormData() {
      const ret = {
        valid: false,
        form: {},
      };
      this.$refs.form.validate((valid) => {
        ret.valid = valid ? valid : false;
        ret.form = this.form;
      });
      return ret;
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    handleMinChange() {
      this.$refs.form.validateField("max");
    },
    handleMaxChange() {
      this.$refs.form.validateField("min");
    },
    validateCom(rule, value, callback) {
      const one = Number(value);
      if (!one) return;
      if (Number.isInteger(one)) {
        if (one < this.min) {
          return callback(new Error(`输入值必须大于${this.min}`));
          return callback(new Error());
        } else if (one > this.max) {
          return callback(new Error(`输入值必须小于${this.max}`));
        }
        return callback();
      }
      if (value !== undefined) {
        return callback(new Error("必须为正整数"));
      }
    },
    validateMin(rule, value, callback) {
      const one = Number(value);
      const max = Number(this.form.max);
      if (!max || one < max) {
        return callback();
      }
      return callback(new Error("不得大于最大值"));
    },
    validateMax(rule, value, callback) {
      const one = Number(value);
      const min = Number(this.form.min);
      if (!min || one > min) {
        return callback();
      }
      return callback(new Error("不得小于最小值"));
    },
  },
};
</script>

<style scoped>
.el-form {
  display: flex;
  align-items: center;
}
.el-form-item {
  margin-bottom: 0;
}
.inner-icon {
  font-size: 16px;
  padding: 0 8px;
}
</style>
