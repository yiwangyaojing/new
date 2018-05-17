<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/SettingDetails' }">进度详情</el-breadcrumb-item>
      <el-breadcrumb-item><a>客户详情</a></el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <br>
    <el-row>
      <div class="clearfix" style="font-size: 14px;">
        <div class="fl">{{this.details.cst_name}}</div>
        <el-button class="fr" @click="download()" size="mini" disabled="disabledshow" type="primary">打包下载</el-button>
      </div>
      <el-col :span="24" style="margin-top: 10px;font-size: 14px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="概况" name="0" class="clearfix">
            <div class="clearfix">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">电话</div>
                <div class="fl" style="border: 1px solid #e4e7ed;padding:0 10px;width: 200px;border-radius: 5px;height: 30px;line-height: 30px;">{{this.details.cst_phone}}</div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">地址</div>
                <div class="fl one-txt-cut" style="border: 1px solid #e4e7ed;padding:0 10px;min-width: 200px;border-radius: 5px;height: 30px;line-height: 30px;" >{{this.details.cst_address}}</div>
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
                <div style="padding: 10px;;width: 500px;height: 50px;border: 1px solid #e4e7ed;border-radius: 5px;">{{this.details.cst_remark}}</div>
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
                  <div> <div v-if="items.scd_remark !== null && items.from_name !== null"><span style="color: #01cb32">{{items.scd_remark}}</span> 将合同状态由 <span style="color: #01cb32">{{items.from_name}}</span> 改为 <span style="color: #01cb32">{{items.scd_name}}</span></div></div>
                  <div> <div v-if="items.scd_remark === null || items.from_name === null ">合同状态 :<span style="color: #01cb32">{{items.scd_name}}</span></div></div>
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
          <el-tab-pane label="项目勘测" name="3">
            <div v-if="paifangzishow">
              <div class="clearfix">
                <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                  <div class="fl" style="width: 80px;">房屋朝向</div>
                  <div class="fl" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;counter-reset: #c0c4cc;">{{this.details.h_face}}</div>
                </div>
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">房屋照片</div>
                <div v-if=" item.data_type === 0" class="fl imgs" v-for="(item,index) in details.houseImgs" :key="index"  style="width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)" alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄房屋正面及侧面照片</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">电表箱</div>
                <div v-if=" item.data_type === 1" class="fl imgs" v-for="(item,index) in details.houseImgs" :key="index" style="width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)" alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄用户的电表</div>
                </div>-->
              </div>
              <div  class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">其他</div>
                <div class="fl imgs" v-if=" item.data_type === 2" v-for="(item,index) in details.houseImgs" :key="index" style="margin-right: 5px;width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;" v-if="item.data_type === 2" :src="item.mini_url" @click="showMax(item.url)"  alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">可以拍摄用户房屋周边环境</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">备注</div>
                <div class="fl" style="width: 400px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; ">{{this.details.h_remark}}</div>
              </div>
            </div>
            <div v-if="!paifangzishow" style="text-align: center;">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="资料收集" name="4">
            <div v-if="shouziliaoshow">
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl imgs" style="width: 80px;">身份证/户口本/结婚证</div>
                <div class="fl imgs"  v-if="item.data_type === 0" v-for="(item,index) in details.dataImgs" :key="index" style="width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;" :src="item.mini_url" @click="showMax(item.url)" alt="">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl imgs" style="width: 80px;">产权证明/电费单/银行卡</div>
                <div class="fl imgs" v-if="item.data_type === 1" v-for="(item,index) in details.dataImgs" :key="index" style="margin-right: 5px;width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)"  alt="暂无图片">
                </div>
                <!--<div class="fl imgs">-->
                <!--<div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>-->
                <!--<div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>-->
                <!--</div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl imgs" style="width: 80px;">并网申请/合同/其他</div>
                <div class="fl imgs" v-if="item.data_type === 2" v-for="(item,index) in details.dataImgs" :key="index" style="margin-right: 5px;width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)"  alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">备注</div>
                <div class="fl" style="width: 400px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; ">{{this.details.d_remark}}</div>
              </div>
            </div>
            <div v-if="!shouziliaoshow" style="text-align: center;">
              暂无数据
            </div>
          </el-tab-pane>
          <el-tab-pane label="方案设计" name="5">
            <div v-if="paibanzishow">
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
                    <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_input_num}}</div>
                    <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">块</div>
                  </div>
                </div>
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div :span="10" class="clearfix y-Center" style="width: 400px;">
                  <div class="fl" style="width: 80px;">装机容量</div>
                  <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                    <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_input_capacity}}</div>
                    <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">千瓦</div>
                  </div>
                </div>
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">备注</div>
                <div class="fl" style="width: 400px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; ">{{this.details.rf_remark}}</div>
              </div>
              <div style="margin-top: 20px;font-size: 16px;">排布示意图</div>
              <div style="margin-top: 20px;"><img width="400" :src="details.rf_image" alt=""></div>
            </div>
            <div v-if="!paibanzishow" style="text-align: center;">暂无数据</div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      title="查看大图"
      :visible.sync="centerDialogVisible"
      width="50%"
      height="40%"
      center>
      <!--放大后的图片start-->
      <el-button type="text" @click="showMax1()" style="margin-top: -40px;">
        <div class="fl imgs">
          <img style="width: 100%; height: 100%" :src="maxImgUrl"  alt="暂无图片">
        </div>
      </el-button>
      <!--放大后的图片end-->
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="downloadDialog"
      width="30%">
      <span>{{dialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
         <el-button @click="downloadDialog = false">取 消</el-button>
        <el-button type="primary" @click="downLoadData">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{dialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>
<script>
import axios from 'axios'
import dateFormat from 'dateformat'
export default {
  data () {
    return {
      paifangzishow: true,
      shouziliaoshow: true,
      paibanzishow: true,
      disabledshow: true,
      maxImgUrl: '', // 图片放大url地址
      centerDialogVisible: false, // 图片放大Dialog框 默认值
      collapsed: false,
      dialogVisible: false, // 提示信息
      downloadDialog: false, // 下载模态框默认值
      dialogMessage: '', // 提示信息
      imgVisible: false,
      activeName: '0',
      contractProgressList: [], // 合同状态列表
      payList: [], // 回款状态列表
      updated_at1: '', // 格式化后的更新时间
      details: { // 客户详细信息
        user_name: '', // 负责人
        cst_name: '', //  客户名称
        cst_phone: '', //  客户电话
        cst_address: '', //  客户地址
        cst_remark: '', //  客户备注
        zj_input_format: '', //  组件规格
        zj_input_capacity: '', // 装机容量
        zj_input_num: '', //  组件数量
        zj_unit_price: '', //  系统单价
        zj_price: '', //  总价
        pay_sum: '', //  回款金额
        updated_at: '', //  更新时间
        scd_name: '', //  进度名称
        rf_remark: '', // 排版子备注
        h_remark: '', // 拍房子备注
        d_remark: '', // 收资料备注
        cst_latitude: '', // 纬度
        cst_longitude: '', // 经度
        h_face: '' // 房屋朝向
      }
    }
  },
  methods: {
    // 切换 tab 显示不同内容
    handleClick (tab, event) {
      console.log('tab切换', tab.name)
      if (tab.name === '0') {
        this.initData()
      } else if (tab.name === '3') {
        this.initData()
        if (this.details.h_is_finish === 0) {
          // this.dialogVisible = true
          // this.dialogMessage = '房屋信息未采集'
          this.showWarningTips('房屋信息未采集')
          this.paifangzishow = false
        }
      } else if (tab.name === '4') {
        this.initData()
        if (this.details.d_is_finish === 0) {
          // this.dialogVisible = true
          // this.dialogMessage = '客户资料未采集'
          this.showWarningTips('客户资料未采集')
          this.shouziliaoshow = false
        }
      } else if (tab.name === '5') {
        this.initData()
        if (this.details.rf_is_finish === 0) {
          // this.dialogVisible = true
          // this.dialogMessage = '排版子未采集'
          this.showWarningTips('排版子未采集')
          this.paibanzishow = false
        }
      } else if (tab.name === '1') {
        let planId = this.$route.query.planId
        console.log('id', planId)
        if (planId) {
          // 返回客户合同状态列表
          axios.get('/api/pc/customerDataPc/contractStatus/' + planId).then(resp => {
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
          // 返回客户回款列表
          axios.get('/api/pc/customerDataPc/payStatus/' + planId).then(resp => {
            if (resp.length === 0) {
              // this.dialogVisible = true
              // this.dialogMessage = '暂无回款记录'
              this.showWarningTips('暂无回款记录')
            }
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
    // 初始化数据 默认进入客户详情的概览页
    initData () {
      let planId = this.$route.query.planId
      if (planId) {
        axios.get('/api/pc/customerDataPc/planDetail/' + planId).then(resp => {
          this.updated_at1 = dateFormat(resp.updated_at, 'yyyy-mm-dd')
          this.details = resp
        })
      }
    },
    // 图片放大方法
    showMax (url) {
      console.log('url===>>', url)
      this.centerDialogVisible = true
      this.maxImgUrl = url
    },
    showMax1 () {
      this.centerDialogVisible = false
    },
    download () {
      if (this.details.d_is_finish === 0 && this.details.h_is_finish === 0) {
        this.dialogVisible = true
        this.dialogMessage = '无可下载的资源'
        this.disabledshow = false
      } else {
        this.downloadDialog = true
        this.dialogMessage = '是否下载该用户所有资料'
        this.disabledshow = true
      }
    },
    downLoadData () {
      let shortUrl = this.details.short_url
      if (!shortUrl) {
        this.$message.error('下载提取码自动获取失败！手动填写')
        this.$router.push({path: '/download', query: {shortUrl: ''}})
      }
      this.$router.push({path: '/download', query: {shortUrl: shortUrl}})
    },
    showWarningTips (text) {
      this.$message({
        message: text,
        type: 'warning'
      })
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
