<template>
  <el-dialog title="生成二维码" :visible.sync="dialogFormVisible" width="400px">
    <el-form ref="form" :model="changeForm" :rules="rules" class="form" label-position="right" label-width="120px">
      <el-form-item label="商户ID" >
        {{form.merchantId}}
      </el-form-item>
      <el-form-item label="商户名称" >
        {{form.merchantName}}
      </el-form-item>
      <el-form-item label="终端编号" >
        {{form.id}}
      </el-form-item>
      <el-form-item label="终端密钥" >
        {{form.secretKey}}
      </el-form-item>
      <el-form-item label="有效期" prop="validateDay">
        <el-input style="width: 100px" v-model.number="changeForm.validateDay" placeholder="请输入" />天
        <el-button type="primary" size="mini" style="width: 100px;margin-left: 10px;"
                   @click="unionPayUnionPayMerchantGenerateUnionPayMerchantQRCodeFun()">生成二维码</el-button>
      </el-form-item>
        <div class="QR-code" name="qrCode" id="qrCode" ref="qrCodeDiv" style="margin:0 auto;width: 200px">

        </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import {generateUnionPayTerminalQRCode} from "@/api/system/terminalManagement";
  import QRCode from "qrcodejs2";
  // import rules from "@/utils/rules.js"
  export default {
    name: 'codeShow',
    data() {
      return {
        dialogFormVisible: false,
        rules: {
          validateDay:[{ required: true, message: '天数不能为空', trigger: 'blur' }, { type: 'number', message: '天数必须为数字值'
            ,trigger: 'blur' }],
        },
        form: {
            merchantId: "",
            merchantName: "",
            merchantNumber: "",
            organizeId: "",
            secretKey: "",
            terminalId: "",
            terminalNo: "",
        },
        changeForm:{
          validateDay: 1
        },
        // imgUrlString: ''
      }
    },
    watch:{
    },
    methods: {
      resetForm() {
        this.form = {
            merchantId: "",
            merchantName: "",
            merchantNumber: "",
            organizeId: "",
            secretKey: "",
            terminalId: "",
            terminalNo: "",
        }
        this.changeForm = {
          validateDay: 1
        }
      },
      changeSubmitForm(form){
        this.form = form
      },
      showDialog() {
        this.dialogFormVisible = true
      },
      changeDialogFormVisible(){
        this.dialogFormVisible = false
      },
      unionPayUnionPayMerchantGenerateUnionPayMerchantQRCodeFun() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.form.validateDay = this.changeForm.validateDay
              generateUnionPayTerminalQRCode(this.form)
              .then(response => {
                let text=response.data
                this.$nextTick(() => {
                  if(document.getElementsByName('qrCode')[0].innerHTML!=''){
                    document.getElementsByName('qrCode')[0].innerHTML = "";
                  }
                  text = JSON.stringify(text)
                  let qrcode2 = new QRCode(this.$refs.qrCodeDiv, {
                    text: text,
                    width: 200,
                    height: 200,
                    colorDark: "#333333", //二维码颜色
                    colorLight: "#ffffff", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                  })
                })

              })
              .catch(error => {
              });
          } else {
            return false;
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
