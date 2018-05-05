<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24" class="y-Center">
        <el-col :span="2" style="font-size: 14px;">姓名</el-col>
        <el-col :span="4"><el-input v-model="input" size="small" placeholder="请输入内容"></el-input></el-col>
      </el-col>
      <el-col :span="24" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">认证手机</el-col>
        <el-col :span="4"><el-input disabled value="175555555555" size="small" placeholder="请输入内容"></el-input></el-col>
      </el-col>
      <el-col :span="24" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2" style="font-size: 14px;">验证码</el-col>
        <el-col :span="3"><el-input v-model="input" size="small" placeholder="请输入内容"></el-input></el-col>
        <el-col :span="3"><div class="xy-Center" style="border: 1px solid #dcdfe6;width: 90px;height: 32px;border-radius: 5px;margin-left: 30px;">获取验证码</div></el-col>
      </el-col>
      <el-button size="medium" style="margin-top: 40px;background: #67c23a;color: #fff;">保存修改</el-button>
    </el-row>
  </el-card>
</template>
<script>

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