<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="90px">
    <el-form-item label="卡点时间" prop="time">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="请选择卡点时间"
      >
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "refundStuck",
  data() {
    return {
      form: {},
      rules: {
        time: [
          { required: true, message: "卡点时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    reset() {
      this.form = {};
      this.resetForm("form");
    },
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
  },
};
</script>

<style></style>
