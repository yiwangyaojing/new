<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24" class="y-Center">
        <el-col :span="2" style="font-size: 14px;">团队名称</el-col>
        <el-col :span="4"><el-input v-model="company_name" size="small" placeholder="请输入内容"></el-input></el-col>
      </el-col>
      <el-col :span="24" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">认证手机</el-col>
        <el-col :span="4"><el-input disabled :value="phone" size="small" placeholder="请输入内容"></el-input></el-col>
      </el-col>
      <el-col :span="24" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">LOGO</el-col>
        <el-col :span="4">
          <img style="width: 70px;height: 70px;" :src="company_logo" alt="">
          <el-upload
            class="upload-demo"
            action="api/file/upload/"
            :data="dataImg"
            :on-success="successImg"
            :limit="1">
            <el-button size="small" type="primary">重新上传</el-button>
          </el-upload>
        </el-col>
      </el-col>
      <el-col :span="24" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">验证码</el-col>
        <el-col :span="3"><el-input v-model="yzmvalue" size="small" placeholder="请输入内容"></el-input></el-col>
        <el-col :span="3">
          <div v-if="showcode" class="xy-Center" style="border: 1px solid #dcdfe6;width: 90px;height: 32px;border-radius: 5px;margin-left: 30px;" @click="yzmcode">获取验证码</div>
          <button v-if="!showcode" disabled class="xy-Center" style="border: 1px solid #dcdfe6;width: 60px;height: 32px;border-radius: 5px;margin-left: 30px;" @click="yzmcode">{{numcode}}秒</button>
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
      open_id: '',
      company_name: '',
      phone: '',
      company_logo: '',
      yzmvalue: '',
      company_id: '',
      numcode: 120,
      oss_name: '',
      showcode: true,
      dataImg: {
        source_type: 6,
        data_type: 0
      }
    }
  },
  methods: {
    requestdata () {
      axios.get('/api/team/' + this.company_id + '/' + this.open_id, {}).then(res => {
        console.log('查询团队', res)
        this.oss_name = res.oss_name
        this.company_name = res.company_name
        this.company_logo = res.logo
      })
    },
    successImg (response, file, fileList) {
      console.log('上传图片', response)
      this.company_logo = response.url
      this.oss_name = response.oss_file_name
    },
    yzmcode () {
      this.showcode = false
      let _this = this
      let timer
      clearInterval(timer)
      timer = setInterval(function () {
        if (_this.numcode > 0) {
          console.log('开始倒计时')
          _this.numcode--
        } else {
          _this.numcode = 120
          _this.showcode = true
          clearInterval(timer)
        }
      }, 1000)
      axios.post('api/team/sms', {open_id: this.open_id, register_phone: this.phone, template_code: 'SMS_134260282'}).then(res => {
        console.log('验证码成功', res)
      })
    },
    submitClick () {
      let objdata = {
        open_id: this.open_id,
        phone: this.phone,
        validateCode: this.yzmvalue,
        logo: this.company_logo,
        name: this.company_name,
        id: this.company_id,
        oss_name: this.oss_name
      }
      axios.put('api/team/company', objdata).then(res => {
        console.log('修改成功', res)
      })
    }
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    this.open_id = sessionUser.openid
    this.phone = sessionUser.phone
    this.company_logo = sessionUser.company_logo
    this.company_id = sessionUser.company_id
    console.log(sessionUser)
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
