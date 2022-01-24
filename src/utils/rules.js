/**
 * @Description: 校验公共方法
 */
//车牌
let carNumber = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
// 账号
// let codeReg = /^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/
// 电话
let phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/

// 必须为数字
let numberReg = /^\d+$|^\d+[.]?\d+$/

// 密码
let passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/

// 联系人
let contactsReg = /^[\u0391-\uFFE5A-Za-z]+$/

let regId = /(^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/

let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
let code = /^\d{2}$/

let FormValidate = (function () {
  function FormValidate () {}
  // From表单验证规则  可用于公用的校验部分
  FormValidate.Form = function () {
    return {
      terminalNo (rule, value, callback) {
        const terminalNoReg = /^[0-9a-zA-Z]{1,20}$/
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!terminalNoReg.test(value)) && value != ''){
          callback(new Error('20位已内数字或字母'));
        }
        callback();
      },
      secretKey (rule, value, callback) {
        const secretKeyReg = /^[0-9a-zA-Z]{1,32}$/
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!secretKeyReg.test(value)) && value != ''){
          callback(new Error('32位已内数字或字母'));
        }
        callback();
      },
      interfaceAddr (rule, value, callback) {
        const secretKeyReg = /http[s]?:\/\/([\w.]+\/?)\S*/
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!secretKeyReg.test(value)) && value != ''){
          callback(new Error('输入正确的接口地址'));
        }
        callback();
      },
      // isNum(rule, value, callback) {
      //   console.log(value)
      //   const reg = /^[0-9]*$/
      //   if (!reg.test(value)) {
      //     console.log(value)
      //     callback(new Error('请输入正确天数(数字)'))
      //   }else{
      //     callback()
      //   }
      // },
      validatorPass (rule, value, callback) {
        let codeReg = /^[A-Za-z0-9\\/\[\]~!@#$%^&*()_+-={}"'|<>?￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{4,20}/;
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!codeReg.test(value)) && value != ''){
          callback(new Error('请输入4-20位数字或字母或特殊字符'));
        }
        callback();
      },

      validatorArea (rule, value, callback) {
        let reg =/^[0-9a-zA-Z]{1,6}$/;
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!reg.test(value)) && value != ''){
          callback(new Error('请输入1-6数字或字母'));
        }
        callback();
      },
      validatorCode (rule, value, callback) {
        let reg =/^\d{1,2}$/;
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!reg.test(value)) && value != ''){
          callback(new Error('长度2位的数字'));
        }
        callback();
      },
      validatorCodeNumberAndLetter (rule, value, callback) {
        let reg =/^[0-9a-zA-Z]{1,20}$/;
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!reg.test(value)) && value != ''){
          callback(new Error('长度1-20位的数字或字母'));
        }
        callback();
      },
      isTenNumberAndLetter (rule, value, callback) {
        const code=/^[0-9a-zA-Z]{1,10}$/
        if(value==''||value==undefined||value==null){
          callback(new Error('不能为空'))
        }else if (!code.test(value)) {
          callback(new Error('请输入1-10以内的数字或字母'))
        }else{
          callback()
        }
      },
      excludeSpecialCharacters (rule, value, callback) {
        const code=/^[\u4E00-\u9FA5A-Za-z0-9]{1,10000}$/
        if(value==''||value==undefined||value==null){
          callback(new Error('不能为空'))
        }else if (!code.test(value)) {
          callback(new Error('内容不能含特殊字符'))
        }else{
          callback()
        }
      },
      validatorFullName (rule, value, callback) {
        let reg =/^[^\s]*$/;
        if (value == ''||value == undefined||value == null) {
          callback(new Error('不能为空'));
        }else if((!reg.test(value)) && value != ''){
          callback(new Error('不能带空格'));
        }else if(value.length > 20){
          callback(new Error('超出文字限定,最多20'));
        }
        callback();
      },

      validatorAccountOtherCode (rule, value, callback) {
        console.log(value)
        if(value.length > 20 ){
          callback(new Error('其他编号不能大于20位'));
        }
        callback();
      },

      validatorAccountCardNumber (rule, value, callback) {
        console.log(value)
        if(value.length > 20 ){
          callback(new Error('卡号不能大于20位'));
        }
        callback();
      },


      validatorOtherCode (rule, value, callback) {
        console.log(value)
        let reg =/^[^\s]*$/;
        if (value==''||value==undefined||value==null) {
          callback(new Error('不能为空'));
        }else if((!reg.test(value)) && value != ''){
          callback(new Error('不能带空格'));
        }else if(value.length < 5 ){
          callback(new Error('学号不能小于4位'));
        }
        callback();
      },

      //账号的验证规则
      validateReason (rule, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'))
        }
        callback();
      },

      validateCarNuber (rule, value, callback) {
        if (value==''||value==undefined||value==null) {
          return callback(new Error('请输入车牌号'))
        }
        if (!carNumber.test(value)) {
          callback(new Error('车牌号不正确'))
        } else {
          callback()
        }
      },
      // // 只能数字的验证
      // validateNumber (rule, value, callback) {
      //   if (value !== '') {
      //     if (!numberReg.test(value)) {
      //       callback(new Error('员工数量必须为数字'))
      //     } else {
      //       callback()
      //     }
      //   } else {
      //     callback()
      //   }
      // },
      //
      // // 密码的验证
      // validatePsdReg (rule, value, callback) {
      //   if (!value) {
      //     return callback(new Error('请输入密码'))
      //   }
      //   if (!passwordReg.test(value)) {
      //     callback(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
      //   } else {
      //     callback()
      //   }
      // },
      //
      // // 联系人
      // validateContacts (rule, value, callback) {
      //   if (!value) {
      //     return callback(new Error('请输入联系人'))
      //   }
      //   if (!contactsReg.test(value)) {
      //     callback(new Error('联系人不可输入特殊字符'))
      //   } else {
      //     callback()
      //   }
      // },
      //
      // // 邮箱的验证规则
      // validateEmail (rule, value, callback) {
      //   if (value !== '') {
      //     if (!emailReg.test(value)) {
      //       callback(new Error('邮箱格式不正确'))
      //     } else {
      //       callback()
      //     }
      //   } else {
      //     callback()
      //   }
      // },
      //
      // 电话号码的验证
      validatePhone (rule, value, callback) {
        if (value==''||value==undefined||value==null) {
          return callback(new Error('请输入手机号码'))
        }
        if (!phoneReg.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      },
      //
      // // 身份证的验证规则
      validateIdNo (rule, value, callback) {
        if (value==''||value==undefined||value==null){
          return callback(new Error('身份证号码不能为空'))
        }
        if (!regId.test(value)) {
          callback(new Error('请输入正确的二代身份证号码'))
        } else {
          callback()
        }
      }
    }
  }

  return FormValidate
}())

exports.FormValidate = FormValidate
