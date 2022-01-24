import axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service2 = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 0, // 请求超时时间
  // data: {
  //   authenticationTokenVO: JSON.parse(getAuthenticationTokenModel())
  // }
  headers: {
    'Content-Type': 'application/multipart/form-data'
  }

})

// request拦截器
service2.interceptors.request.use(
  config => {
    config.headers['communicationKey'] = 'xhsgxxn'
    if (store.getters.token) {
      config.headers['SSO-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      // config.headers['communicationKey'] = 'xhsgxxn'
      // config.headers['SSO-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      // config.headers['attack-verification'] = getUserName()
      // config.headers['logSessionId'] = getLogSession()
      // config.headers['Content-Type'] = "application/multipart/form-data"
      // let unique = guid()
      // let timePoint = new Date().getTime().toString()
      // let sign = unique + timePoint + '52606F34C985403D850D411BCB600DCD'
      // config.headers['sign'] = md5(sign)
      // config.headers['unique'] = unique
      // config.headers['timePoint'] = timePoint
      // if (config.method == 'post') {
      //   config.data = {
      //     ...config.data,
      //     //authenticationTokenVO : JSON.parse(getAuthenticationTokenModel())
      //   }
      // }
      // config.data = qs.stringify(config.data)
      // //config.data = config.data.push("authenticationTokenVO",JSON.parse(getAuthenticationTokenModel()))
      //config.data = datass
      // if(config.method === 'post'){
      //     if(config.url == "/apissss/logout"){
      //     }else{
      //
      //         config.data['jsonStr'] = "111"
      //         config.data['authenticationTokenVO'] = JSON.parse(getAuthenticationTokenModel())
      //
      //     }
      // }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service2.interceptors.response.use(
  response => {
    const res = response.data
    console.log(res)
    if (res.code !== 200) {
      let errMessage = res.msg;
      switch (res.code) {
        case 40010:
          errMessage = res.msg;
          //errMessage = this.$t("publicErr.exitChilder");
          break;
      }


      Message({
        message: errMessage,
        type: 'error',
        duration: 5 * 1000
      })

      // 40005:未登录;
      if (res.code === 40005) {
        console.log(res);
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log(error)
    console.log(111)
    Message({
      message: error,
      //message:'aaaa',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service2
