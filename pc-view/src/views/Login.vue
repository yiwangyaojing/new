<style scoped>
  @import '../resources/css/base.css';
  @import '../resources/css/flex.css';
  @import '../resources/css/styles.css';
</style>
<template>
  <div style="background: #eceff4; height: 100%">
    <el-row type="flex" style="height: 100%" justify="center" align="middle">
      <el-col :xs="9" :md=7 :sm="8" :lg="7" :xl="4">
        <el-card>
          <br/><br/><br/><br/>
          <el-row type="flex" justify="center" align="middle">
            <el-col style="font-size: 30px;text-align: center">Sign In</el-col>
          </el-row>
          <el-form :model="loginForm" status-icon size="small" :rules="rules" ref="loginForm" label-width="0px"
                   class="form">
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
                  <el-button size="medium" @click="getValidateCode" type="primary" :disabled="!codeShow">获取验证码
                  </el-button>
                </el-col>
                <el-col v-if="!codeShow" :span="9">
                  <el-button size="medium" @click="getValidateCode" type="primary" disabled>{{numCode}}秒</el-button>

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
              <el-button type="danger" style="width: 80px;" round @click="handleSubmit('loginForm')">Login</el-button>
              <el-button type="text" size="mini" disabled>Forgot password?</el-button>
            </el-form-item>
          </el-form>
          <el-row type="flex" justify="center" align="middle">
            <el-col/>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="9" :md=7 :sm="8" :lg="7" :xl="4">
        <el-card class="right-card">
          <br/><br/>
          <el-row type="flex" align="middle">
            <el-col style="font-size: 26px; color: white;">光伏好销售系统-团队管理功能</el-col>
          </el-row>
          <br/>
          <el-row type="flex" align="middle">
            <el-col style="font-size: 12px; color: #484f66;">

            </el-col>
          </el-row>
          <br/>
          <el-row type="flex" align="middle">
            <el-col style="font-size: 12px; color: #484f66;"/>
          </el-row>
          <br/>
          <!--<el-row type="flex" align="middle">
            <el-col>
              <el-button type="danger" size="small" style="width: 100px;" round>Learn more</el-button>
            </el-col>
          </el-row>-->
        </el-card>
      </el-col>
    </el-row>
  </div>
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
        let userInfo = JSON.parse(response)
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
  .el-button + .el-button {
    margin-left: 3px;
  }

  .el-card {
    box-shadow: 0 0px 50px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0px;
    border: 0px;
    height: 380px;
  }

  .right-card {
    background: #23293b;
    height: 300px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.05);
  }

  .form .el-input .el-input__inner {
    border-radius: 0px;
    border-width: 0px;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 8px;
  }

  .form {
    margin: 15px 40px 25px 40px;
  }

</style>
