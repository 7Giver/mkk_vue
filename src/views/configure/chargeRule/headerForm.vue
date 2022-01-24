<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="85px">
    <p class="title">退票（min）</p>
    <el-row>
      <el-col :span="8">
        <el-form-item label="最长时间" prop="refundFirst">
          <time-input
            v-model="form.refundFirst"
            @change="getValidateField('refundFirst')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="时间二" prop="refundSecond">
          <time-input
            v-model="form.refundSecond"
            @change="getValidateField('refundSecond')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="最短时间" prop="refundThird">
          <time-input
            v-model="form.refundThird"
            @change="getValidateField('refundThird')"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <p class="title">改签（min）</p>
    <el-row>
      <el-col :span="8">
        <el-form-item label="最长时间" prop="changeFirst">
          <time-input
            v-model="form.changeFirst"
            @change="getValidateField('changeFirst')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="时间二" prop="changeSecond">
          <time-input
            v-model="form.changeSecond"
            @change="getValidateField('changeSecond')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="最短时间" prop="changeThird">
          <time-input
            v-model="form.changeThird"
            @change="getValidateField('changeThird')"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import timeInput from "./components/timeInput.vue";
export default {
  components: {
    timeInput,
  },
  data() {
    return {
      form: {},
      rules: {
        refundFirst: [
          { required: true, message: "最长时间不能为空", trigger: "change" },
        ],
        refundSecond: [
          { required: true, message: "时间二不能为空", trigger: "change" },
        ],
        refundThird: [
          { required: true, message: "最短时间不能为空", trigger: "change" },
        ],
        changeFirst: [
          { required: true, message: "最长时间不能为空", trigger: "change" },
        ],
        changeSecond: [
          { required: true, message: "时间二不能为空", trigger: "change" },
        ],
        changeThird: [
          { required: true, message: "最短时间不能为空", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 表单重置
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
    getValidateField(rule) {
      this.$refs.form.validateField(rule);
    },
  },
};
</script>

<style scoped>
.title {
  color: #333;
  font-size: 16px;
}
</style>
