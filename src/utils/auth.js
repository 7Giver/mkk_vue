import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const WechatToken = 'WechatToken'
const SiteForm = 'SiteForm'
const DetailsId = 'DetailsId'
export function getDetailsId() {
  return Cookies.get(DetailsId)
}

export function setDetailsId(detailsId) {
  return Cookies.set(DetailsId, detailsId)
}

export function removeDetailsId() {
  return Cookies.remove(DetailsId)
}


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getWechatToken() {
  return Cookies.get(WechatToken)
}

export function setWechatToken(wechatToken) {
  return Cookies.set(WechatToken, wechatToken)
}

export function removeWechatToken() {
  return Cookies.remove(WechatToken)
}

export function getSiteForm() {
  return Cookies.get(SiteForm)
}

export function setSiteForm(siteForm) {
  return Cookies.set(SiteForm, siteForm)
}

export function removeSiteForm() {
  return Cookies.remove(SiteForm)
}

const AccountType = 'AccountType'
export function getAccountType() {
  return Cookies.get(AccountType)
}

export function setAccountType(accountType) {
  return Cookies.set(AccountType, accountType)
}

export function removeAccountType() {
  return Cookies.remove(AccountType)
}

const AccName = 'AccName'
export function getAccName() {
  return Cookies.get(AccName)
}

export function setAccName(accName) {
  return Cookies.set(AccName, accName)
}

export function removeAccName() {
  return Cookies.remove(AccName)
}


export function changeRouters(routers) {
  var afterChangeRouters = [];
  forRouters(routers,afterChangeRouters);
  return afterChangeRouters
}

function forRouters(tdata,resData){
  if(Array.isArray(tdata) && tdata.length>0){
    tdata.forEach(function(v,i){
      // var newValue=v.id;
      // var newLabel=v.fullName;
      resData[i]={
        name: v.path.substring(0,1).toUpperCase() + v.path.substring(1),
        path: (v.component === null ) ? '/'+ v.path : v.path,
        hidden: (v.visible === 1 ) ? true :false,
        // redirect: "",
        component: (v.component === null ) ? 'Layout' : v.component,
        alwaysShow: (v.component === null ) ? true : false,
        meta: {
          title: v.fullName,
          icon: v.icon * 1 === 0 ? "" : v.icon,
          noCache: false
        },
      };
      var arr=[];
      forRouters(v.children,arr);
      resData[i].children=arr;
      if(resData[i].children.length == 0){
        delete resData[i].children;
      }
    });
  }
}

export function getCurrentDate(format) {
  var now = new Date();
  if(format==2){
    now.setTime(now.getTime()+24*60*60*1000);
  }
  if(format==3){
    now.setTime(now.getTime()+24*60*60*20*365*1000);
  }
  if(format==4){
    now.setFullYear(now.getFullYear()+1);
  }
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  var time = "";
  //开始时间
  time = year + "-" + month + "-" + date;

  //结束时间
  return time;
}

export function getDownloadAddress() {
  return '/static/'
}
