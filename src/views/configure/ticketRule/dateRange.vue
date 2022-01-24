<template>
  <el-form ref="form" :model="form">
    <el-form-item prop="date1" :rules="rules.date">
      <el-date-picker
        v-model="form.date1"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions1"
      />
    </el-form-item>
    <el-form-item prop="date2" :rules="rules.date">
      <el-date-picker
        v-model="form.date2"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2"
      />
    </el-form-item>
    <el-form-item prop="date3" :rules="rules.date">
      <el-date-picker
        v-model="form.date3"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions3"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "dateRange",
  props: {},
  data() {
    return {
      form: {
        date1: undefined,
        date2: undefined,
        date3: undefined,
      },
      rules: {
        date: [{ required: false, message: "请输入航班日期", trigger: "blur" }],
      },
    };
  },
  computed: {
    pickerOptions1() {
      return {
        disabledDate: (time) => {
          if (this.form.date2) {
            return (
              time.getTime() >= this.form.date2[0] ||
              time.getTime() < Date.now() - 8.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      };
    },
    pickerOptions2() {
      return {
        disabledDate: (time) => {
          if (this.form.date1 && !this.form.date3) {
            return time.getTime() <= this.form.date1[1];
          } else if (this.form.date1 && this.form.date3) {
            return (
              time.getTime() <= this.form.date1[1] ||
              time.getTime() >= this.form.date3[0]
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      };
    },
    pickerOptions3() {
      return {
        disabledDate: (time) => {
          if (this.form.date2) {
            return (
              time.getTime() <= this.form.date2[1] ||
              time.getTime() < Date.now() - 8.64e7
            );
          } else if (this.form.date1) {
            return (
              time.getTime() <= this.form.date1[1] ||
              time.getTime() < Date.now() - 8.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      };
    },
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
      this.form = this.$options.data().form;
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style scoped></style>
