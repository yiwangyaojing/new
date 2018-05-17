<template>
  <el-card class="box-card"
           v-loading="tableLoading"
           element-loading-text="处理中..."
           element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="24" class="y-Center">
        <el-col :span="2" style="font-size: 14px;">姓名</el-col>
        <el-col :span="4"><el-input v-model="name" size="small" placeholder="请输入内容"></el-input></el-col>
      </el-col>
      <el-col :span="24" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">认证手机</el-col>
        <el-col :span="4"><el-input disabled :value="phone" size="small" placeholder="请输入内容"></el-input></el-col>
      </el-col>
      <el-col :span="24" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">验证码</el-col>
        <el-col :span="3"><el-input v-model="yzmvalue" size="small" placeholder="请输入内容"></el-input></el-col>
        <el-col :span="3" :offset="1">
          <el-button size="small" v-if="showcode" type="success" @click="yzmcode">获取验证码</el-button>
          <el-button size="small" v-if="!showcode" style="width: 92px"  type="success" disabled>{{numcode}}秒</el-button>
        </el-col>
      </el-col>
      <el-button @click="submitClick" size="medium" style="margin-top: 40px;background: #67c23a;color: #fff;">保存修改</el-button>
    </el-row>
  </el-card>
</template>
<script>
import axios from 'axios'
import values from '../../utils/values'
export default {
  data () {
    return {
      tableLoading: false,
      open_id: '',
      phone: '',
      name: '',
      company_id: '',
      showcode: true,
      numcode: 120,
      yzmvalue: '',
      sessionUser: ''
    }
  },
  methods: {
    requestdata () {
      axios.get('/api/team/' + this.company_id + '/' + this.open_id, {}).then(res => {
        console.log('查询团队', res)
      })
    },
    yzmcode () {
      let _this = this
      const loading = this.$loading({
        lock: true,
        text: '发送中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      axios.post('api/team/sms', {open_id: this.open_id, register_phone: this.phone, template_code: 'SMS_134260282'}).then(res => {
        console.log('验证码成功', res)
        loading.close()
        this.showcode = false
        let timer
        clearInterval(timer)
        timer = setInterval(function () {
          if (_this.numcode > 0) {
            _this.numcode--
          } else {
            _this.numcode = 120
            _this.showcode = true
            clearInterval(timer)
          }
        }, 1000)
        this.$message({
          type: 'success',
          message: '验证码发送成功'
        })
      }, (fail) => {
        this.$message.error(fail.message)
        loading.close()
      })
    },
    submitClick () {
      let parameter = {
        name: this.name,
        open_id: this.open_id,
        phone: this.phone,
        validateCode: this.yzmvalue
      }
      if (this.name === '') {
        this.$message({
          type: 'error',
          message: '请输入姓名'
        })
        return
      }
      if (this.yzmvalue === '') {
        this.$message({
          type: 'error',
          message: '请输入验证码'
        })
        return
      }
      this.tableLoading = true
      axios.put('/api/pc/userPc', parameter).then(res => {
        console.log('修改成功', res)
        this.tableLoading = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.sessionUser.name = this.name
        window.sessionStorage.setItem(values.storage.user, JSON.stringify(this.sessionUser))
        this.$emit('reloadUserData')
      }, (fail) => {
        this.$message.error(fail.message)
        this.tableLoading = false
      })
    }
  },
  mounted () {
    this.sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    this.open_id = this.sessionUser.openid
    this.name = this.sessionUser.name
    this.phone = this.sessionUser.phone
    this.company_id = this.sessionUser.company_id
    console.log(this.sessionUser)
    this.requestdata()
  }
}
</script>
<style>
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
  .y-Center{
    display: flex;
    display: -webkit-flex;
    -webkit-align-items: center;
    align-items: center;
  }
</style>
