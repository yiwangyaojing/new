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

const moment = require('moment')

Vue.use(element)
Vue.use(moment)
Vue.use(UTree)
Axios.init({baseURL: process.env.CONTEXT, unauthorizedUrl: process.env.CONTEXT_HTML + '/#/login'})

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
