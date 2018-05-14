<template>
  <el-card class="box-card">
    <el-row>
      <div class="clearfix" style="font-size: 14px;">
        <div class="fl">董志永</div>
        <div class="fr" style="border: 1px solid #999;padding: 5px;border-radius: 5px;">打包下载</div>
      </div>
      <el-col :span="24" style="margin-top: 10px;font-size: 14px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="概况" name="0" class="clearfix">
            <div class="clearfix">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">电话</div>
                <div class="fl" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;">{{this.details.cst_phone}}</div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">地址</div>
                <div class="fl one-txt-cut" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >{{this.details.cst_address}}</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">组件规格</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_input_format}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">瓦</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">组件数量</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_input_num}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">块</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">系统容量</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_input_capacity}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">千瓦</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">系统单价</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_unit_price}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">元</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">系统总价</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_price}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">元</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">已回款</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.pay_sum}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">元</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">备注</div>
              <div class="fl">
                <div style="width: 520px;height: 70px;border: 1px solid #e4e7ed;border-radius: 5px;">{{this.details.cst_remark}}</div>
                <div class="clearfix" style="margin-top: 20px;">
                  <div :span="4" class="clearfix fl" style="width: 200px">
                    <div class="fl" style="width: 80px;">合同状态:</div>
                    <div class="fl" style="color: #01cb32;">{{this.details.scd_name}}</div>
                  </div>
                  <div :span="4" class="clearfix fl">
                    <div class="fl" style="width: 80px;">更新时间:</div>
                    <div class="fl" style="color: #01cb32;">{{this.updated_at1}}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="合同动态" name="1">
            <el-col v-for="(items, index) in contractProgressList" :key="index" :span="24" style="margin-bottom: 20px;">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div> {{items.updated_at}}</div>
                  <div> {{items.scd_remark}} 将合同状态由 <span style="color: #01cb32">{{items.from_name}}</span> 改为 <span style="color: #01cb32">{{items.scd_name}}</span></div>
                  <div style="color: #999;">备注：{{items.scd_r_remark}}</div>
                </el-card>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="回款" name="2">
            <el-col :span="24" style="margin-bottom: 20px;" v-for="(items, index) in payList" :key="index">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div>{{items.pay_time}}</div>
                  <div>{{items.name}} 回款 <span style="color: #01cb32">{{items.pay_money}}</span> 元</div>
                  <div style="color: #999;">备注：{{items.pay_remark}}</div>
                </el-card>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="拍房子" name="3">
            <div class="clearfix">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">房屋朝向</div>
                <div class="fl" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;counter-reset: #c0c4cc;">165°正南</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">房屋照片</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄房屋正面及侧面照片</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">电表箱</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄用户的电表</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">其他</div>
              <div class="fl imgs" style="margin-right: 5px;width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">可以拍摄用户房屋周边环境</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">备注</div>
              <div class="fl" style="width: 400px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; "></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收资料" name="4">
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl imgs" style="width: 80px;">身份证/户口本/结婚证</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl imgs" style="width: 80px;">产权证明/电费单/银行卡</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl imgs" style="width: 80px;">并网申请/合同/其他</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">备注</div>
              <div class="fl" style="width: 400px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; "></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="排版子" name="5">
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">组件规格</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_format}}</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">瓦</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">组件数量</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">32</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">块</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">装机容量</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">168</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">千瓦</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">备注</div>
              <div class="fl" style="width: 400px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; "></div>
            </div>
            <div style="margin-top: 20px;font-size: 16px;">排布示意图</div>
            <div style="margin-top: 20px;"><img width="400" src="/static/img/sky.871d198.jpg" alt=""></div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import axios from 'axios'
import dateFormat from 'dateformat'
export default {
  data () {
    return {
      activeName: '0',
      contractProgressList: [],
      payList: [],
      updated_at1: '',
      details: {
        user_name: '', // 负责人
        cst_name: '', //  客户名称
        cst_phone: '', //  客户电话
        cst_address: '', //  客户地址
        cst_remark: '', //  备注
        zj_input_format: '', //  组件规格
        zj_input_capacity: '', // 装机容量
        zj_input_num: '', //  组件数量
        zj_unit_price: '', //  系统单价
        zj_price: '', //  总价
        pay_sum: '', //  回款金额
        updated_at: '', //  更新时间
        scd_name: '' //  进度名称
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log('tab切换', tab.name)
      if (tab.name === '0' || tab.name === '3' || tab.name === '4' || tab.name === '5') {
        this.initData()
      } else if (tab.name === '1') {
        let planId = this.$route.query.planId
        console.log('id', planId)
        if (planId) {
          axios.get('/api/customerDataPc/contractStatus/' + planId).then(resp => {
            console.log('客户合同状态：')
            this.contractProgressList = []
            for (let i = 0; i < resp.length; i++) {
              let contractProgress = {
                scd_name: resp[i].scd_name, // 进度名称
                from_name: resp[i].from_name, // 来源名称
                scd_remark: resp[i].scd_remark, // 负责人
                scd_r_remark: resp[i].scd_r_remark, // 进度备注
                updated_at: dateFormat(resp[i].updated_at, 'yyyy-mm-dd') // 更新时间
              }
              this.contractProgressList.push(contractProgress)
            }
          })
        }
      } else {
        let planId = this.$route.query.planId
        console.log('id', planId)
        if (planId) {
          axios.get('/api/customerDataPc/payStatus/' + planId).then(resp => {
            console.log('客户回款：')
            console.log(resp)
            this.payList = []
            for (let i = 0; i < resp.length; i++) {
              let payProgress = {
                name: resp[i].name, // 负责人
                pay_money: resp[i].pay_money, // 回款金额
                pay_remark: resp[i].pay_remark, // 进度备注
                pay_time: dateFormat(resp[i].pay_time, 'yyyy-mm-dd') // 回款时间
              }
              this.payList.push(payProgress)
            }
          })
        }
      }
    },
    initData () {
      let planId = this.$route.query.planId
      console.log('id', planId)
      if (planId) {
        axios.get('/api/customerDataPc/planDetail/' + planId).then(resp => {
          console.log('返回某个客户详细数据：', resp)
          this.updated_at1 = dateFormat(resp.updated_at, 'yyyy-mm-dd')
          this.details = resp
        })
      }
    }
  },
  mounted () {
    this.initData()
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
  .one-txt-cut{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-tabs__item.is-active {
    color: #01cb32;
  }
  .el-tabs__item:hover {
    color: #01cb32;
  }
  .el-tabs__item {
    padding: 0 35px;
    height: 35px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  .imgs {
    margin-right: 10px;
  }
</style>
