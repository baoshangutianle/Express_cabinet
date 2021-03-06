// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import App from './App'
import router from './router'

import * as filter from './utils/filter' // 全局过滤器
import { formatTimeAmt,setCookie,getCookie } from './utils/until.js'

import {post,fetch,patch,put,posts} from './utils/httpPlugin'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
import WechatAuth from 'vue-wechat-auth'
import './assets/js/jquery.minV181011'
import { Resource } from "./utils/api.js";

//定义全局变量
Vue.prototype.$post=post;
Vue.prototype.$posts=posts;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;
Vue.prototype.wx = wx
Vue.prototype.$formatTimeAmt = formatTimeAmt
// 微信授权插件初始化
var openid = getCookie('openid')
if (!openid) {
  Vue.use(WechatAuth , {
    router, // 路由实例对象
    appid: 'wxd093959d6ee082a9', // 您的微信appid
    responseType: 'code',  // 返回类型，请填写code
    scope: 'snsapi_userinfo', // 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
    getCodeCallback (code, next) {
      console.log("我是code："+code+"要给后端，去换openid");
    // console.log('http://wx.luoyangjinmei.com/getWxinter2.ashx?code='+code+'&state=STATE');
      // 用户同意授权后回调方法
      // code：用户同意授权后，获得code值
      // code说明： code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
      // next： 无论access_token是否获取成功,一定要调用该方法
      // next说明：next方法接收两个参数
      // 参数1为通过code值请求后端获取到的access_token值，如果获取失败请填入空字符串''
      // 参数2(非必填，默认获取access_token切换到当前路由对象)，指定切换对象 next('/') 或者 next({ path: '/' })
      // this.$fetch(Resource.getWx, {
      //   code: code,
      //   state: "STATE"
      // }).then(res => {
      //   console.log(res);
      // }).catch(error => {
      //   console.log(error);
      // })
      var get_openid_url = 'http://wx.luoyangjinmei.com/getWxinter2.ashx?code='+code+'&state=STATE';
      fetch(get_openid_url,{})
      .then(res => {
        console.log(res);
        setCookie('openid', res.Openid);
      localStorage.removeItem("idty");
      localStorage.setItem("userInfo",res);
        window.location.reload();
      })
      .catch(error => {console.log(error)});
    }
  })
} else {
  // router.push('/')
}

// 过滤器注册
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
