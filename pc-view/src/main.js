import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import '../static/fonts/iconfont.css'
import '../static/fonts/vueboot-icons.css'
import App from './App'
import './resources/css/element-variables.scss'
import router from './router'
import Axios from './utils/Axios'
import UTree from './component/tree/index'
import VueAMap from 'vue-amap'

const moment = require('moment')

Vue.use(element)
Vue.use(moment)
Vue.use(UTree)
Vue.use(VueAMap)
Axios.init({baseURL: process.env.CONTEXT, unauthorizedUrl: '/#/login'})
VueAMap.initAMapApiLoader({
  key: 'c1280b1ee49f4ecf90a6c8f0213bc1c2',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
