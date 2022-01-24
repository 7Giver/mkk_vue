<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px">
    <el-form ref="form" :model="submitForm" :rules="rules" class="form" label-position="right" label-width="120px">
      <el-form-item label="商户ID" prop="id">
        <el-input
          :disabled="dialogStatus==='update'"
          v-model="submitForm.id"
          placeholder="请输入"
          style="width:200px"/>
      </el-form-item>
      <el-form-item label="商户名称" prop="name">
        <el-input v-model="submitForm.name" placeholder="请输入" style="width:200px"/>
      </el-form-item>
      <el-form-item label="接口地址" prop="interfaceAddr">
        <el-input v-model="submitForm.interfaceAddr" placeholder="请输入" style="width:200px"/>
      </el-form-item>
      <el-form-item label="商户简介">
        <el-input v-model="submitForm.memo" type="textarea" placeholder="请输入" style="width:200px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="changeDialogFormVisible()">取 消</el-button>
      <el-button type="primary" @click="submitDataForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { submitUnionPayMerchant } from "@/api/system/merchants";
import rules from '@/utils/rules.js'
export default {
  name: 'AddForm',
  props: ['dialogStatus'],
  data() {
    return {
      dialogFormVisible: false,
      // dialogStatus: this.dialogStatus,
      rules: {
        id: [{ required: true, validator: rules.FormValidate.Form().terminalNo, trigger: 'blur' }],
        name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        interfaceAddr: [{ required: true, validator: rules.FormValidate.Form().interfaceAddr, trigger: 'blur' }]
      },
      textMap: {
        update: '编辑商户',
        create: '新增商户'
      },
      submitForm: {
        id: '',
        interfaceAddr: '',
        memo: '',
        name: '',
        organizeId: ''
      }
    }
  },
  watch: {
  },
  methods: {
    resetForm() {
      this.submitForm = {
        id: '',
        interfaceAddr: '',
        memo: '',
        name: '',
        organizeId: ''
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
          let showMessage = ''
          if (this.dialogStatus === 'create') {
            showMessage = '新增成功'
          } else {
            showMessage = '修改成功'
          }
            submitUnionPayMerchant(this.submitForm)
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
