// 引入 babel-polyfill 以支持 async/await 等 ES6+ 特性
import 'babel-polyfill'

// 注意：Vue、ElementUI、Vuex、VueRouter 等已在 index.html 中通过 CDN 全局引入
// 使用全局变量，避免重复注册导致报错
const Vue = window.Vue

import App from './App.vue'
// ElementUI CSS 已在 index.html 中引入，这里不需要再次导入
import './styles/index.scss'
import store from './store'
import router from '@/router'

Vue.config.productionTip = false
// ElementUI 已通过 CDN 全局引入并自动注册，不需要再次 Vue.use(ElementUI)
// 常用方法
import * as utils from "@/common/utils/utils";
Vue.prototype.utils = utils;
// axios
import http from "@/api/http"
Vue.prototype.http = http

// API注册全局
import API from "@/api"
Vue.prototype.API = API

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

