<style>
  @import '../resources/css/base.css';
  @import '../resources/css/styles.css';
</style>
<template>
  <el-container>
    <el-aside width="auto" style="position: relative;">
      <el-row type="flex" align="middle" class="logo">
        <img src="../../static/img/logo.png"/>
      </el-row>
      <el-menu :router="true" class="el-menu-vertical" text-color="#303133" active-text-color="#FFFFFF" :default-active="index"
               background-color="#fff" :collapse="collapsed">
        <el-menu-item-group>
          <el-menu-item index="0" :route="{name: 'Home'}">
            <i class="iconfont icon-shouye" ></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="1" :route="{name: 'SettingDetails'}">
            <i class="iconfont icon-rili"></i>
            <span slot="title">进度详情</span>
          </el-menu-item>
          <el-menu-item index="2" :route="{name: 'CustomerData'}">
            <i class="iconfont icon-ziliaoguanli"></i>
            <span slot="title">客户资料</span>
          </el-menu-item>
          <el-menu-item index="3" :route="{name: 'ImportCustomer'}">
            <i class="iconfont icon-yonghutouxiang"></i>
            <span slot="title">客户导入</span>
          </el-menu-item>
          <el-menu-item index="4" :route="{name: 'Signin'}">
            <i class="iconfont icon-weizhi"></i>
            <span slot="title">签到统计</span>
          </el-menu-item>
          <el-menu-item index="5" :route="{name: 'PersonnelManagement'}">
            <i class="iconfont icon-tuandui"></i>
            <span slot="title">团队结构</span>
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item index="6" :route="{name: 'TeamInformation'}">
          <i class="iconfont icon-ziliaoguanli"></i>
          <span slot="title">团队信息</span>
        </el-menu-item>
        <el-menu-item index="7" :route="{name: 'AccountSetting'}">
          <i class="iconfont icon-shezhi"></i>
          <span slot="title">账户设置</span>
        </el-menu-item>
      </el-menu>
      <div style="position: absolute;bottom: 0;padding: 5px 0px;width: 100%;">
        <a href="http://www.xiqiao.io" style="color: #999;font-size: 10px;width: 100%;text-align: center;display: inline-block;" target="_blank">开发商:上海西樵软件</a>
      </div>
    </el-aside>
    <el-container>
      <el-header height="60px">
        <el-row type="flex" class="warp" justify="right" align="middle" style="height: 54px;" :gutter="8">
         <!-- <el-col>
            <el-button class="circle none toggle" size="mini" round icon="el-icon-vueboot-menu"/>
          </el-col>-->
          <el-col  class="y-Center">
            <div class="clearfix">
              <div class="fl"><img style="width: 50px;height: 50px;border-radius: 50%;" :src="company_logo"/></div>
              <div class="fl" style="margin-left: 10px;font-size: 14px;line-height: 54px;">{{company_name}}</div>
            </div>
          </el-col>

          <el-col :span="6">
            <el-row justify="right" align="middle" type="flex">
              <el-col :span="10"></el-col>
              <el-col :span="5">
                <img class="header" height="36" :src="avatarUrl"/>
              </el-col>
              <el-col :span="9" style="cursor: pointer;">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{loginName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  <el-dropdown-menu slot="dropdown">
                    <!--<el-dropdown-item  command="a" >修改密码</el-dropdown-item>-->
                    <el-dropdown-item  command="b" >退出系统</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="background:rgb(238, 238, 238);">
        <transition name="fade" mode="out-in">
          <div style="padding: 20px">
            <router-view/>
          </div>
        </transition>
      </el-main>

      <!--<el-footer style="background:rgb(238, 238, 238);font-size: 10px;text-align: right; " height="40px">-->
        <!--<a href="http://www.xiqiao.io" style="color: #999">技术支持:上海西樵软件有限公司</a>-->
      <!--</el-footer>-->
      <!--修改密码弹出层-->
      <div>
        <el-dialog :visible.sync="passwordModel" title="修改密码" :modal="true">
          <el-form  ref="passwordForm" :model="pwdForm" :rules="pwdRule" label-width="100">
            <el-form-item prop="originPwd" label="原密码">
              <el-input type="password" v-model="pwdForm.originPwd" placeholder="请输入原密码">
                <i class="ios-locked-outline" slot="prepend"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input type="password" v-model="pwdForm.newPwd" placeholder="请输入新密码">
                <i class="ios-locked-outline" slot="prepend"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="surePwd">
              <el-input type="password" v-model="pwdForm.surePwd" placeholder="确认密码">
                <i class="ios-locked-outline" slot="prepend"></i>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button type="primary" @click="handlePasswordSubmit('passwordForm')">提交</el-button>
            <el-button type="ghost" @click="resetPasswordForm('passwordForm')">重置</el-button>
            <el-button type="ghost" @click="passwordModel=false">取消</el-button>
          </div>
        </el-dialog>
      </div>

    </el-container>
  </el-container>
</template>
<script>
import axios from 'axios'
import ElFooter from 'element-ui/packages/footer/src/main'
import md5 from 'md5'
import values from '../utils/values'

export default {

  components: {ElFooter},
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      index: '0',
      collapsed: false,
      company_logo: '',
      company_name: '',
      avatarUrl: '',
      loginName: '', // 登录账号名称
      menus: [],
      passwordModel: false, // 弹出修改密码弹出层
      pwdForm: {
        originPwd: '',
        newPwd: '',
        surePwd: ''
      },
      pwdRule: {
        originPwd: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPwd: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        surePwd: [
          {required: true, validator: validatePassCheck, trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    handleCommand (cmd) {
      if (cmd === 'a') {
        this.passwordModel = true
      } else if (cmd === 'b') {
        this.logout()
      }
    },
    logout () {
      // 退出系统
      this.$confirm('确定要退出当前系统吗', {
        callback: (action) => {
          if (action === 'confirm') {
            axios.post('/api/logout').then(() => {
              this.$message.success('退出成功!')
              this.$router.push({name: 'Login'})
            }, (response) => {
              this.$message.error(response.message ? response.message : '系统或网络异常')
            })
          }
        }
      })
    },
    resetPasswordForm (name) {
      console.log(this.$refs)
      this.$refs[name].resetFields()
    },
    handlePasswordSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let jsonData = {
            oldPassword: md5(this.pwdForm.originPwd + this.loginName),
            newPassword: md5(this.pwdForm.newPwd + this.loginName)
          }
          axios.post('/security/updatePassword', jsonData).then((data) => {
            // 关闭浮层
            this.passwordModel = false
            this.$message.success('修改成功,下次登录请用新密码登录, 谢谢!')
          }, (response) => {
            this.$message.error(response.message ? response.message : '系统或网络异常')
          })
        }
      })
    }
  },
  updated () {
    let menus = [
      ['Home', 'Overdue'],
      ['SettingDetails'],
      ['CustomerData', 'CustomerDetails'],
      ['ImportCustomer'],
      ['Signin', 'SigninDetails'],
      ['PersonnelManagement', 'TeamUserDetail'],
      ['TeamInformation'],
      ['AccountSetting']
    ]
    menus.forEach((item, index) => {
      item.forEach(subItem => {
        if (subItem === this.$route.name) {
          this.index = String(index)
        }
      })
    })
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    this.loginName = sessionUser.name// 登录账号名称
    this.company_name = sessionUser.company_name
    this.company_logo = sessionUser.company_logo
    this.avatarUrl = sessionUser.avatarUrl
  },
  computed: {}
}
</script>

<style scoped>
  .el-container {
    height: 100%;
    background: white;
  }

  .el-aside {
    /*background: #222837;*/
  }

  .el-header {
    background-color: #FFFFFF;
    color: #333;
    /*line-height: 56px;*/
    /*vertical-align: middle;*/
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05);
  }

  .header {
    border-radius: 30px;
    line-height: 36px;
  }

  .el-menu {
    border-right: solid 0px #e6e6e6;
  }

  .el-menu .el-submenu.is-active {
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
  }

  .el-submenu [class^="el-icon-vueboot-"] {
    padding-bottom: 2px;
  }

  .el-submenu__title {
    height: 45px;
    line-height: 45px;
    font-size: 13px;
    padding-left: 40px;
    transition: border-color 0.1s, background-color 0.1s, color 0.1s;
  }

  .el-menu .el-submenu.is-active .el-submenu__title {
    border-left: solid 4px #fc6c2e !important;
  }

  .el-menu-item {
    height: 45px;
    line-height: 45px;
    min-width: 220px;
    /*background-color: #1f212d !important;*/
    font-size: 14px;
    padding-left: 40px !important;
    /*color: #303133 !important;*/
  }

  .el-menu-item.is-active {
    /*background-color: #1c1f27 !important;*/
  }

  .el-menu-item.is-active [class^="el-icon-vueboot-"] {
    font-weight: bold;
  }

  .toggle {
    margin-left: -6px;
  }

  .el-main {
    padding: 0px;
  }

  .logo {
    height: 60px;
    /*padding-top: 20px;*/
    padding-left: 24px;
    background: #00cc33;
    line-height: 60px;
  }
  .logo span {
    font-weight: bold;
    font-size: 24px;
    color: #303133;
    margin-left:25px;
  }
  .el-menu-item span{
    /*margin-left: 32px;*/
    text-align: left;
  }
  .el-menu-item .clear_margin {
    margin: 0;
  }
  .y-Center{
    display: flex;
    display: -webkit-flex;
    -webkit-align-items: center;
    align-items: center;
  }
  .el-footer {
    text-align: center;
    line-height: 60px;
  }

  .item {
    /*margin-top: 10px;*/
    /*margin-right: 50px;*/
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix:after {
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
  }
  .clearfix {
    zoom: 1;
  }
  .el-menu-item:hover {
    background: unset !important;
    color: #67c23a !important;
  }
  .el-menu-item.is-active {
    color: #67c23a !important;
  }
  .el-submenu__title:hover {
    background-color: unset !important;
  }
  .el-icon-location:hover {
    color: #67c23a !important;
  }
  i {
    margin-right: 15px;
    margin-left: 15px;
  }
  .iconfont {
    font-size: 18px;
    color: #303133;
  }
</style>
