<template>
  <el-dialog :visible.sync="dialogFormVisible" title="新增终端" width="400px">
    <el-form ref="form" :model="submitForm" :rules="rules" class="form" label-position="right" label-width="120px">
      <el-form-item label="终端编号" prop="id">
        <el-input v-model="submitForm.id" placeholder="请输入" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="选择商户" prop="merchantId">
        <el-select v-model="submitForm.merchantId" placeholder="请选择" style="width: 200px">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="终端密钥" prop="secretKey">
        <el-input v-model="submitForm.secretKey" placeholder="请输入" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="submitForm.memo" type="textarea" placeholder="请输入" style="width: 200px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="changeDialogFormVisible()">取 消</el-button>
      <el-button type="primary" @click="submitDataForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { submitUnionPayTerminal } from "@/api/system/terminalManagement";
import rules from '@/utils/rules.js'
export default {
  name: 'AddForm',
  props:['merchantList'],
  data() {
    return {
      dialogFormVisible: false,
      // dialogStatus: this.dialogStatus,
      rules: {
        id: [{required: true, validator: rules.FormValidate.Form().terminalNo, trigger: 'blur'}],
        merchantId: [{required: true, message: '请选择商户', trigger: 'change'}],
        secretKey: [{required: true, validator: rules.FormValidate.Form().secretKey, trigger: 'blur'}]
      },
      textMap: {
        update: '编辑商户',
        create: '新增商户'
      },
      submitForm: {
        id: '',
        memo: '',
        merchantId: '',
        organizeId: '123',
        secretKey: '',
      }
    }
  },
  watch: {
  },
  methods: {
    resetForm() {
      this.submitForm = {
        id: '',
        memo: '',
        merchantId: '',
        organizeId: '123',
        secretKey: '',
      }
    },
    changeSubmitForm(form) {
      this.submitForm = form
    },
    showDialog() {
      this.dialogFormVisible = true
    },
    changeDialogFormVisible() {
      this.dialogFormVisible = false
    },
    submitDataForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const showMessage = '新增成功'
            submitUnionPayTerminal(this.submitForm)
            .then(response => {
              this.$emit('handleFilter')
              this.changeDialogFormVisible()
              this.$notify({
                title: '成功',
                message: showMessage,
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .form{
    /*width: 400px;*/
  }
</style>
