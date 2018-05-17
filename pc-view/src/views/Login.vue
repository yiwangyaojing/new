<template>
  <el-row>
    <el-container>
      <el-header style="background: #00cc33" class="xy-Center">
        <div>
          <img src="/static/img/logo.png" alt="">
        </div>
      </el-header>
    </el-container>
    <div class="x-Center" style="margin-top: 100px;">
      <el-col :xs="9" :md=7 :sm="8" :lg="7" :xl="4">
        <el-tabs type="border-card" style="width: 100%;">
          <el-tab-pane label="二维码">
            <div class="x-Center" style="padding: 10px 0">
              <img style="width: 160px;height: 160px" src="/static/img/erweima.png" alt="">
            </div>
            <!--<div style="text-align: center;padding: 20px 0;">打开<span style="color: #55a532">光伏好销售</span>扫一扫登录</div>-->
          </el-tab-pane>
          <el-tab-pane label="手机号">
              <el-form :model="loginForm" status-icon size="small" :rules="rules" ref="loginForm" label-width="0px"
                       class="form" style="margin-top: 20px;padding: 20px 40px;">
                <el-form-item prop="username">
                  <el-input type="text" v-model="loginForm.phone" maxlength="11" auto-complete="off" placeholder="手机号"/>
                </el-form-item>
                <el-form-item prop="validateCode">
                  <el-col :span="24">
                    <el-col :span="15">
                      <el-col :span="20">
                        <el-input type="text" v-model="loginForm.validateCode" maxlength="4" auto-complete="off"
                                  placeholder="验证码"/>
                      </el-col>
                    </el-col>
                    <!--<el-button type="danger" @click="getValidateCode">获取验证码</el-button>-->
                    <el-col v-if="codeShow" :span="9">
                      <el-button size="small" @click="getValidateCode" type="primary" :disabled="!codeShow">获取验证码
                      </el-button>
                    </el-col>
                    <el-col v-if="!codeShow" :span="9">
                      <el-button size="small" @click="getValidateCode" type="primary" disabled>{{numCode}}秒</el-button>

                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item prop="captcha">
                  <el-row>
                    <!--<el-col :span=16>-->
                    <!--<el-input type="text" :maxlength="6" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码"/>-->
                    <!--</el-col>-->
                    <!--<el-col :span=8>-->
                    <!--<img :src="captchaUrl" width="100%" style="height: 35px;" @keyup.enter="handleSubmit"/>-->
                    <!--</el-col>-->
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button style="width: 100%" size="medium" type="success" @click="handleSubmit('loginForm')">登录</el-button>
                  <!--<el-button type="text" size="mini" disabled>Forgot password?</el-button>-->
                </el-form-item>
              </el-form>
              <el-row type="flex" justify="center" align="middle">
                <el-col/>
              </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </div>
  </el-row>
</template>
<script>
import axios from 'axios'
import values from '../utils/values'

export default {
  data () {
    return {
      formName: 'loginForm',
      // 提交按钮loading
      loading: false,
      // 登录form admin 123456
      loginForm: {
        phone: '',
        validateCode: '',
        captcha: ''
      },
      rules: {},
      now: new Date(),
      codeShow: true,
      numCode: 120
    }
  },
  methods: {
    // 刷新验证码
    getValidateCode: function () {
      if (this.loginForm.phone !== '') {
        this.codeShow = false
        this.countDown()
      } else {
        this.$message.error('手机号不能为空')
      }
      axios.post('/api/login/sms', this.loginForm).then(response => {
        let message = response.message
        if (message.indexOf('失败') > -1) {
          this.$message.error(message)
        } else {
          this.$message.success(message)
        }
      }
      )
    },
    countDown () {
      let _this = this
      setTimeout(() => {
        if (_this.numCode > 0) {
          _this.numCode--
          this.countDown()
        } else {
          _this.numCode = 120
          this.codeShow = true
        }
      }, 1000)
    },
    // 确认登录操作
    handleSubmit (name) {
      if (this.loginForm.phone === '') {
        this.$message.error('手机号不能为空')
        return
      }
      if (this.loginForm.validateCode === '') {
        this.$message.error('验证码不能为空')
        return
      }
      // if (this.loginForm.captcha === '') {
      //   this.$message.error('验证码不能为空')
      //   return
      // }
      this.loading = true
      let form = {
        phone: this.loginForm.phone,
        validateCode: this.loginForm.validateCode,
        captcha: this.loginForm.captcha
      }
      axios.post('/api/login', form).then(response => {
        console.log('this is the response=====>>>', response)
        let userInfo = response
        this.$message.success('登录成功')
        this.$router.replace('/Home')
        window.sessionStorage.setItem(values.storage.user, JSON.stringify(userInfo))
        //        this.loading = false
      }, (response) => {
        this.$message.error(response.message)
        //        this.changeCaptchaUrl()
        //        this.loading = false
      })
    }
  },
  computed: {
    captchaUrl: function () {
      return '/captcha?time=' + this.now
    }
  },
  mounted () {

  }
}
</script>
<style scoped>

 .x-Center{
   display: flex;
   display: -webkit-flex;
   -webkit-justify-content: center;
   justify-content: center;
 }
 .xy-Center{
   display: flex;
   display: -webkit-flex;
   -webkit-align-items: center;
   align-items: center;
   -webkit-justify-content: center;
   justify-content: center;
 }
 .el-tabs__nav {
   width: 100% !important;
   text-align: center;
 }
 .el-tabs__item {
   width: 51% !important;
 }
</style>
