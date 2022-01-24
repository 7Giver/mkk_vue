<template>
  <el-dialog :visible.sync="dialogFormVisible" title="批量导入" width="400px">
    <el-form ref="form" :model="submitForm" :rules="rules" class="form" label-position="right" label-width="120px">
      <el-form-item label="选择商户" prop="merchantId">
        <el-select v-model="submitForm.merchantId" placeholder="请选择" style="width:200px">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-folder-add"
          style="width:200px"
          @click="uploadFile">
          上传文件
        </el-button>
      </el-form-item>
    </el-form>
    <div class="upload-btn-box">
      <input
        ref="filElem"
        type="file"
        class="kyc-passin"
        accept=".xlsx"
        @change="uploadPhoto($event)"
      >
    </div>
  </el-dialog>
</template>

<script>
  import { importUnionPayTerminal } from "@/api/system/terminalManagement";
  import {timeLimitFileListUpload} from "@/api/system/accountManagement";
  import rules from '@/utils/rules.js'
  export default {
    name: 'bulkImport',
    props:['merchantList'],
    data() {
      return {
        dialogFormVisible: false,
        // dialogStatus: this.dialogStatus,
        rules: {
          merchantId: [{required: true, message: '请选择商户', trigger: 'change'}],
        },
        submitForm: {
          childOrganizeId: '123',
          fileName: "",
          merchantId: '',
          organizeId: '123'
        }
      }
    },
    watch: {
    },
    methods: {
      uploadFile() {
        this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
      },
      openFullScreen() {
        this.loading2 = this.$loading({
          lock: true,
          text: '文件上传中Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      },
      uploadPhoto(e) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.openFullScreen()
            this.test(e.target.files[0])
          }else {
            return false
          }
        })
      },
      test(files) {
        var fd = new FormData()
        fd.append('multipartFiles', files)
          timeLimitFileListUpload(fd).then(res => {
          this.faceRegisterBatchMethod(res.data[0])
          this.loading2.close()
        })
      },

      faceRegisterBatchMethod(fileRegisterList) {
        var index = fileRegisterList.oldName.lastIndexOf('\/')
        fileRegisterList.oldName = fileRegisterList.oldName.substring(index + 1, fileRegisterList.oldName.length)
        this.submitForm.fileName = fileRegisterList.newName
        return importUnionPayTerminal(this.submitForm)
          .then(res => {
            this.$emit('handleFilter')
            this.dialogFormVisible = false
            if (res.data == null) {
              this.$message({
                message: '上传成功，请去任务列表查看',
                type: 'success'
              })
            } else {
              var form = document.createElement('form')
              const formAction = res.data
              window.open(formAction, '_self')
            }
          })
          .catch(error => {

          })
      },
      resetForm(merchantList) {
        this.submitForm = {
          childOrganizeId: '123',
          fileName: "",
          merchantId: merchantList[0].id,
          organizeId: '123'
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
      // submitDataForm() {
      //   this.$refs['form'].validate((valid) => {
      //     if (valid) {
      //       const showMessage = '新增成功'
      //         importUnionPayTerminal(this.submitForm)
      //         .then(response => {
      //           this.$emit('handleFilter')
      //           this.changeDialogFormVisible()
      //           this.$notify({
      //             title: '成功',
      //             message: showMessage,
      //             type: 'success',
      //             duration: 2000
      //           })
      //         })
      //         .catch(error => {
      //         })
      //     } else {
      //       return false
      //     }
      //   })
      // }
    }
  }
</script>

<style scoped lang="scss">
  .upload-btn-box {
    margin-bottom: 10px;

    button {
      margin-right: 10px;
    }

    input[type=file] {
      display: none;
    }
  }
</style>
