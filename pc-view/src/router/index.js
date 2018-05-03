import Parameters from '@/views/core/Parameters.vue'
import Login from '@/views/Login'
import Main from '@/views/Main'
import Organizations from '@/views/role/Organizations'
import Resources from '@/views/role/Resources'
import Roles from '@/views/role/Roles'
import ScheduleLogs from '@/views/schedule/ScheduleLogs.vue'
import Schedules from '@/views/schedule/Schedules.vue'
import Users from '@/views/user/Users'
import XuserList from '@/views/xusers/XuserList'
import XcustomerList from '@/views/xcustomer/XcustomerList'
import FeedbackList from '@/views/feedback/feedbackList'
import FeedbackRoofList from '@/views/feedback/feedbackRoofList'
import XCustomerDetail from '@/views/xcustomer/XcustomerDetail'
import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/index'
import IndexAd from '../views/setting/indexAd'
import IndexSliderAd from '../views/setting/IndexSliderAd'
import Download from '@/views/download/Download'
import Home from '../views/home/home'
import SettingDetails from '../views/settingdetails/settingdetails'
import CustomerData from '../views/settingdetails/customerdata'
import CustomerDetails from '../views/customerdetails/customerdetails'
import Signin from '../views/signin/signin'
Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'Login', component: Login},
    {path: '/download', name: 'Download', component: Download},
    {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: 'resources',
      children: [
        {path: '/Home', name: 'Home', component: Home},
        {path: '/SettingDetails', name: 'SettingDetails', component: SettingDetails},
        {path: '/CustomerData', name: 'CustomerData', component: CustomerData},
        {path: '/CustomerDetails', name: 'CustomerDetails', component: CustomerDetails},
        {path: '/Signin', name: 'Signin', component: Signin},

        {path: '/Index', name: 'Index', component: Index},
        {path: '/IndexAd', name: 'IndexAd', component: IndexAd},
        {path: '/IndexSliderAd', name: 'IndexSliderAd', component: IndexSliderAd},
        {path: '/users', name: 'Users', component: Users},
        {path: '/roles', name: 'Roles', component: Roles},
        {path: '/resources', name: 'Resources', component: Resources},
        {path: '/organizations', name: 'Organizations', component: Organizations},
        {path: '/schedules', name: 'Schedules', component: Schedules},
        {path: '/schedule/logs', name: 'ScheduleLogs', component: ScheduleLogs},
        {path: '/parameters', name: 'Parameters', component: Parameters},
        {path: '/XuserList', name: 'XuserList', component: XuserList}, // 小程序登录用户
        {path: '/XcustomerList', name: 'XcustomerList', component: XcustomerList}, // 小程序客户信息
        {path: '/FeedbackList', name: 'FeedbackList', component: FeedbackList}, // 小程序反馈
        {path: '/FeedbackRoofList', name: 'FeedbackRoofList', component: FeedbackRoofList}, // 小程序反馈
        {path: '/XCustomerDetail', name: 'XCustomerDetail', component: XCustomerDetail}// 小程序客户详情
      ]
    }
  ]
})
