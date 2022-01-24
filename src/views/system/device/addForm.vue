<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px">
    <el-form ref="form" :model="submitForm" :rules="rules" class="form" label-position="right" label-width="120px">
      <el-form-item label="设备编号" prop="deviceId">
        {{submitForm.deviceId}}
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="submitForm.deviceName" placeholder="请输入" style="width:200px"/>
      </el-form-item>
      <el-form-item label="选择商户" prop="merchantId">
        <el-select v-model="submitForm.merchantId" placeholder="请选择" style="width: 200px" @change="listAvailableUnionPayTerminalFun">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="选择终端" prop="terminalId">
        <el-select v-model="submitForm.terminalId" placeholder="请选择" style="width: 200px">
          <el-option
            v-for="item in terminalIdList"
            :key="item.id"
            :label="item.id"
            :value="item.id"/>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="changeDialogFormVisible()">取 消</el-button>
      <el-button type="primary" @click="submitDataForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deviceBindMerchant } from "@/api/system/device";
import { listAvailableUnionPayTerminal } from "@/api/system/terminalManagement";
import rules from '@/utils/rules.js'
export default {
  name: 'AddForm',
  props: ['dialogStatus','merchantList'],
  data() {
    return {
        terminalIdList:[],
      dialogFormVisible: false,
      // dialogStatus: this.dialogStatus,
      rules: {
          deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
          merchantId: [{ required: true, message: '请选择商户', trigger: 'change' }],
          terminalId: [{ required: true, message: '请选择终端', trigger: 'change' }],
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      submitForm: {
          bindType: 1,
          deviceName:'',
          deviceId: "",
          merchantId: "",
          terminalId: ""
      }
    }
  },
  watch: {
  },
  methods: {
      listAvailableUnionPayTerminalFun(){
          return listAvailableUnionPayTerminal({id:this.submitForm.merchantId}).then(response => {
              this.terminalIdList = response.data
          })
              .catch(error => {
                  this.listLoading = false
              })
      },
    resetForm(row) {
      this.submitForm = {
          bindType: 1,
          deviceName: row.deviceName,
          deviceId: row.deviceId,
          merchantId: row.sceneId,
          terminalId: row.terminalId
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
            deviceBindMerchant(this.submitForm)
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
