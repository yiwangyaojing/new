<template>
  <el-card class="box-card"
           v-loading="tableLoading"
           element-loading-text="处理中..."
           element-loading-spinner="el-icon-loading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>逾期规则</a></el-breadcrumb-item>
    </el-breadcrumb>
      <el-row style="margin-top: 20px;">
        <div style="font-size: 20px;">逾期规则设置</div>
        <el-col :span="24">
          <el-col :span="7" class="clearfix" style="margin-top: 20px;padding: 20px;font-size: 16px;border: 1px solid #ccc;border-radius: 5px;">
            <div class="fl" style="margin-top: 20px;">合同签订</div>
            <div class="fl xy-Center" style="margin:0 10px 10px;;border-bottom: 1px solid #666;width: 150px;position: relative;">
              <input :disabled="editshow" v-model="datas.htqd" style="width: 50px;font-size: 28px;text-align: center;border: none;color: #01cd33;" type="text">
              <span>天</span>
              <div class="arrowposition"></div>
            </div>
            <div class="fl" style="margin-top: 20px;">施工完成</div>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="7" class="clearfix" style="margin-top: 20px;padding: 20px;font-size: 16px;border: 1px solid #ccc;border-radius: 5px;">
            <div class="fl" style="margin-top: 20px;">施工完成</div>
            <div class="fl xy-Center" style="margin:0 10px 10px;;border-bottom: 1px solid #666;width: 150px;position: relative;">
              <input :disabled="editshow" style="width: 50px;font-size: 28px;text-align: center;border: none;color: #01cd33;" v-model="datas.sgwc" type="text">
              <span>天</span>
              <div class="arrowposition"></div>
            </div>
            <div class="fl" style="margin-top: 20px;">并网完成</div>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="7" class="clearfix" style="margin-top: 20px;padding: 20px;font-size: 16px;border: 1px solid #ccc;border-radius: 5px;">
            <div class="fl" style="margin-top: 20px;">并网完成</div>
            <div class="fl xy-Center" style="margin:0 10px 10px;;border-bottom: 1px solid #666;width: 150px;position: relative;">
              <input :disabled="editshow" style="width: 50px;font-size: 28px;text-align: center;border: none;color: #01cd33;" v-model="datas.bwwc" type="text">
              <span>天</span>
              <div class="arrowposition"></div>
            </div>
            <div class="fl" style="margin-top: 20px;">回款完成</div>
          </el-col>
        </el-col>
      </el-row>
      <el-col :span="24" style="padding: 30px 0;">
        <el-col :span="5">
          <a href="javascript:history.go(-1)"><el-button @click="submitClick" size="medium" class="x-Center" style="margin-top: 30px;">返回</el-button></a>
        </el-col>
        <el-col :span="5">
          <el-button @click="submitClick" size="medium" class="x-Center" style="margin-top: 30px;background: #01cd33;color: #fff;">保存修改</el-button>
        </el-col>
      </el-col>
  </el-card>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      tableLoading: false,
      editshow: false,
      datas: {
        htqd: 7,
        sgwc: 7,
        bwwc: 7,
        company_id: '',
        id: ''
      }
    }
  },
  methods: {
    requestdata () {
      axios.get('/api/pc/overduePc').then(res => {
        console.log(res)
        if (res.content) {
          this.datas = res.content
        }
        if (!res.rule) {
          this.editshow = true
        } else {
          this.editshow = false
        }
      })
    },
    submitClick () {
      this.tableLoading = true
      let fromData = {
        htqd: Number(this.datas.htqd),
        sgwc: Number(this.datas.sgwc),
        bwwc: Number(this.datas.bwwc),
        company_id: Number(this.datas.company_id),
        id: Number(this.datas.id)
      }
      axios.post('/api/pc/overduePc', fromData).then(res => {
          this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.tableLoading = false
        console.log(res)
      }, () => {
        this.tableLoading = false
      })
    }
  },
  mounted () {
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
  .el-date-editor .el-range-separator {
    width: 10%;
  }
  .arrowposition {
    position: absolute;
    right: 3px;
    bottom: -3px;
    border-left: 1px solid rgb(102, 102, 102);
    width: 1px;
    height: 13px;
    transform: rotate(-50deg);
  }
</style>
