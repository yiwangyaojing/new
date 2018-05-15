import Login from '@/views/Login'
import Main from '@/views/Main'
import Vue from 'vue'
import Router from 'vue-router'

import Download from '@/views/download/Download'
import Home from '../views/home/home'
import SettingDetails from '../views/settingdetails/settingdetails'
import CustomerData from '../views/settingdetails/customerdata'
import CustomerDetails from '../views/customerdetails/customerDetails'
import Signin from '../views/signin/signin'
import SigninDetails from '../views/signin/signindetails'
import PersonnelManagement from '../views/personnelmanagement/teammanagement'
import TeamInformation from '../views/teaminformation/teaminformation'
import AccountSetting from '../views/accountsetting/accountsetting'
import TeamUserDetail from '../views/personnelmanagement/teamuserdetail'
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
        {path: '/SigninDetails', name: 'SigninDetails', component: SigninDetails},
        {path: '/PersonnelManagement', name: 'PersonnelManagement', component: PersonnelManagement},
        {path: '/TeamInformation', name: 'TeamInformation', component: TeamInformation},
        {path: '/AccountSetting', name: 'AccountSetting', component: AccountSetting},
        {path: '/TeamUserDetail', name: 'TeamUserDetail', component: TeamUserDetail}
        // {path: '/Index', name: 'Index', component: Index},
        // {path: '/IndexAd', name: 'IndexAd', component: IndexAd},
        // {path: '/IndexSliderAd', name: 'IndexSliderAd', component: IndexSliderAd},
        // {path: '/users', name: 'Users', component: Users},
        // {path: '/roles', name: 'Roles', component: Roles},
        // {path: '/resources', name: 'Resources', component: Resources},
        // {path: '/organizations', name: 'Organizations', component: Organizations},
        // {path: '/schedules', name: 'Schedules', component: Schedules},
        // {path: '/schedule/logs', name: 'ScheduleLogs', component: ScheduleLogs},
        // {path: '/parameters', name: 'Parameters', component: Parameters},
        // {path: '/XuserList', name: 'XuserList', component: XuserList}, // 小程序登录用户
        // {path: '/XcustomerList', name: 'XcustomerList', component: XcustomerList}, // 小程序客户信息
        // {path: '/FeedbackList', name: 'FeedbackList', component: FeedbackList}, // 小程序反馈
        // {path: '/FeedbackRoofList', name: 'FeedbackRoofList', component: FeedbackRoofList}, // 小程序反馈
        // {path: '/XCustomerDetail', name: 'XCustomerDetail', component: XCustomerDetail}// 小程序客户详情
      ]
    }
  ]
})
