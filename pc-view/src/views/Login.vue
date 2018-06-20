<template>
  <el-row>
    <el-container>
      <el-header style="background: #00cc33;line-height: 60px;">
        <div class="xy-Center" style="height: 60px;">
          <img src="../../static/img/logo.png" alt="">
        </div>
        <div style="position: relative;top: -58px;right:40px;text-align: right;color: #fff;"><a target="_blank" style="color: white" href="http://www.xiaosotech.com/">关于我们</a></div>
      </el-header>
      <div style="height: 8px;background: #ffffff"></div>
    </el-container>
    <el-col :span="24" style="margin-top: 100px;">
      <el-col :span="15" class="y-Center">
        <el-col :span="4">
        </el-col>

        <el-col :span="14">
          <img style="width: 600px;height: 320px;" src="../../static/img/logo66.png" alt="">
        </el-col>
      </el-col>
      <el-col :span="9">
          <el-col style="background: #ffffff;width: 420px;">
            <!--<el-tab-pane label="   二维码   ">-->
            <!--<div class="x-Center" style="padding: 10px 0" id="login_container">-->
            <!--&lt;!&ndash;<img style="width: 160px;height: 160px" src="/static/img/erweima.png" alt="">&ndash;&gt;-->
            <!--</div>-->
            <!--&lt;!&ndash;<div style="text-align: center;padding: 20px 0;">打开<span style="color: #55a532">好销售CRM</span>扫一扫登录</div>&ndash;&gt;-->
            <!--</el-tab-pane>-->
            <div style="padding: 20px 40px 0">手机号登录</div>
            <el-form :model="loginForm" status-icon size="small" :rules="rules" ref="loginForm" label-width="0px"
                     class="form" style="padding: 20px 40px;">
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
                    <el-button style="color: #000; width: 92px" size="small" @click="getValidateCode"  :disabled="!codeShow">获取验证码
                    </el-button>
                  </el-col>
                  <el-col v-if="!codeShow" :span="9">
                    <el-button style="color: #000; width: 92px" size="small" @click="getValidateCode"  disabled>{{numCode}}秒</el-button>
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
                <el-button style="width: 100%;background: #01cd33;color: #fff" size="medium"  @click="handleSubmit('loginForm')">登录</el-button>
                <!--<el-button type="text" size="mini" disabled>Forgot password?</el-button>-->
              </el-form-item>
              <div>
                <div style="font-size: 14px;font-weight: 700">温馨提示:</div>
                <div>未注册团队用户请先在小程序上注册，<span style="color: rgb(0, 204, 51); cursor:pointer;" @click="dialogVisible = true">扫描注册</span><span class="iconfont icon-ai-code" style="color: rgb(0, 204, 51);margin-left: 5px;font-size: 13px;"></span></div>
              </div>
            </el-form>
            <el-row type="flex" justify="center" align="middle">
              <el-col/>
            </el-row>
          </el-col>
      </el-col>

    </el-col>
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      title="扫描二维码进入小程序">
      <div><img src="../../static/img/Small_program_code.jpg" style="height: 300px; width: 300px; margin-left: 25px" alt="小程序码" /></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </el-row>
</template>
<script>
import axios from 'axios'
import values from '../utils/values'

export default {
  data () {
    return {
      dialogVisible: false,
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
        return
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
    /* let uat = '/test'
    // 判断环境
    let href = window.location.href
    let origin = window.location.origin

    if (href.indexOf(uat) !== -1) {
      origin += uat
    }
    let redirectUri = encodeURI(origin + '/static/qrLogin.html')
    console.log(redirectUri)
    var obj = new window.WxLogin({
      self_redirect: true,
      id: 'login_container',
      appid: 'wxc63276646e2fe762',
      scope: 'snsapi_login',
      redirect_uri: redirectUri,
      state: '',
      style: '',
      href: ''
    })
    console.log(obj) */
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
 .y-Center{
   display: flex;
   display: -webkit-flex;
   -webkit-align-items: center;
   align-items: center;
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
