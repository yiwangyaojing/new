<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>客户详情</span>
    </div>
    <el-row>
      <div class="main_row">
        <el-col :span="4">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            :collapse="collapsed"
            style="height: 600px">
            <el-menu-item index="1" @click="changeShow(1)">
              <i class="el-icon-menu"></i>
              <span slot="title">概况</span>
            </el-menu-item>
            <el-menu-item index="2" @click="changeShow(2)">
              <i class="el-icon-menu"></i>
              <span slot="title">拍房子</span>
            </el-menu-item>
            <el-menu-item index="3" @click="changeShow(3)">
              <i class="el-icon-menu"></i>
              <span slot="title">收资料</span>
            </el-menu-item>
            <el-menu-item index="4" @click="changeShow(4)">
              <i class="el-icon-menu"></i>
              <span slot="title">排板子</span>
            </el-menu-item>
            <el-menu-item index="5" @click="changeShow(5)">
              <i class="el-icon-menu"></i>
              <span slot="title">下载</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="20">
          <div v-if="showIndex === 1" class="cst_content">
            <el-row>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">客户名称:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="5"><span>{{cstInfo.cst_name}}</span></el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">电话:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="5"><span>{{cstInfo.cst_phone}}</span></el-col>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">地址:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="8"><span>{{cstInfo.cst_address}}</span></el-col>
            </el-row>
            <hr/>
            <el-row style="margin-top: 20px;">
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">组件规格:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="5"><span>{{cstInfo.zj_format}} 瓦</span></el-col>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">组件数量:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="8"><span>{{cstInfo.zj_num}} 块</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">装机容量:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="5"><span>{{cstInfo.zj_capacity}} 千瓦</span></el-col>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">系统单价:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="5"><span>{{cstInfo.zj_unit_price}}元/瓦</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">系统总价:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="3"><span>{{cstInfo.zj_price}} 元</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3" style="text-align: right"><span style="font-weight: bold">备注:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="12"><span>{{cstInfo.cst_remark}}</span></el-col>
            </el-row>
          </div>

          <div v-if="showIndex === 2" class="cst_content">
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">房屋朝向:</span></el-col>
              <el-col :span="5"><span>78.32°东偏南</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">房屋照片:</span></el-col>
              <el-col v-for="(item,index) in cstInfo.houseImgs" :key="index" :span="2"><span><img
                v-if="item.data_type === 0" :src="item.mini_url" @click="showMax(item.url)" class="head_pic"/></span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">电表箱:</span></el-col>
              <el-col v-for="(item,index) in cstInfo.houseImgs" :key="index" :span="2"><span><img
                v-if="item.data_type === 1" :src="item.mini_url" @click="showMax(item.url)" class="head_pic"/></span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">其他:</span></el-col>
              <el-col v-for="(item,index) in cstInfo.houseImgs" :key="index" :span="2"><span><img
                v-if="item.data_type === 2" :src="item.mini_url" @click="showMax(item.url)" class="head_pic"/></span>
              </el-col>
            </el-row>

            <div style="margin-top: 50px;"></div>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">备注:</span></el-col>
              <el-col :span="20"><span>{{cstInfo.h_remark}}</span></el-col>
            </el-row>
          </div>

          <div v-if="showIndex === 3" class="cst_content">
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">身份证/户口本/结婚证:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col v-for="(item,index) in cstInfo.dataImgs" :key="index" :span="2"><span><img
                v-if="item.data_type === 0" :src="item.mini_url" @click="showMax(item.url)" class="head_pic"/></span>
              </el-col>
            </el-row>
            <hr/>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">产权证明/银行卡/电费单:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col v-for="(item,index) in cstInfo.dataImgs" :key="index" :span="2"><span><img
                v-if="item.data_type === 1" :src="item.mini_url" @click="showMax(item.url)" class="head_pic"/></span>
              </el-col>
            </el-row>
            <hr/>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">并网申请/合同/其他:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col v-for="(item,index) in cstInfo.dataImgs" :key="index" :span="2"><span><img
                v-if="item.data_type === 2" :src="item.mini_url" @click="showMax(item.url)" class="head_pic"/></span>
              </el-col>
            </el-row>
            <hr/>

            <div style="margin-top: 50px;"></div>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">备注:</span></el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="10"><span>{{cstInfo.d_remark}}:</span></el-col>
            </el-row>
          </div>

          <div v-if="showIndex === 4" class="cst_content">
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">组件规格:</span></el-col>
              <el-col :span="5"><span>{{cstInfo.zj_format}} 瓦</span></el-col>
              <el-col :span="3"><span style="font-weight: bold">组件数量:</span></el-col>
              <el-col :span="10"><span>{{cstInfo.zj_num}} 块</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">装机容量:</span></el-col>
              <el-col :span="5"><span>{{cstInfo.zj_capacity}} 千瓦</span></el-col>
              <el-col :span="3"><span style="font-weight: bold">系统单价:</span></el-col>
              <el-col :span="5"><span>{{cstInfo.zj_unit_price}} 元/瓦</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">系统总价:</span></el-col>
              <el-col :span="5"><span>{{cstInfo.zj_price}} 元</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><span style="font-weight: bold">备注:</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="11"><span>{{cstInfo.rf_remark}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="3"><span style="font-weight: bold">排布示意图:</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <img style="width: 400px;height: 240px;" :src="cstInfo.rf_image"/>
              </el-col>
            </el-row>

          </div>

        </el-col>
      </div>
    </el-row>

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

    <el-dialog
      :visible.sync="imgVisible"
      width="50%">
      <img :src="imgUrl" style="width: 100%;"/>
    </el-dialog>

  </el-card>

</template>

<script>
import axios from 'axios'

export default {

  data () {
    return {
      collapsed: false,
      dialogVisible: false,
      downloadDialog: false,
      dialogMessage: '',
      imgVisible: false,
      imgUrl: '',
      showIndex: 1,
      cstInfo: {}
    }
  },
  methods: {
    initData () {
      let planId = this.$route.query.planId
      if (planId) {
        axios.get('/backend/plans/' + planId).then(resp => {
          this.cstInfo = resp
        })
      }
    },
    changeShow (val) {
      if (val === 2) {
        if (this.cstInfo.h_is_finish === 0) {
          this.dialogVisible = true
          this.dialogMessage = '房屋信息未采集'
          return
        }
      } else if (val === 3) {
        if (this.cstInfo.d_is_finish === 0) {
          this.dialogVisible = true
          this.dialogMessage = '客户资料未采集'
          return
        }
      } else if (val === 5) {
        if (this.cstInfo.d_is_finish === 0 && this.cstInfo.h_is_finish === 0) {
          this.dialogVisible = true
          this.dialogMessage = '无可下载的资源'
          return
        } else {
          this.downloadDialog = true
          this.dialogMessage = '是否下载该用户所有资料'
        }
      }
      this.showIndex = val
    },
    showMax (url) {
      console.log(url)
      this.imgVisible = true
      this.imgUrl = url
    },
    downLoadData () {
      let shortUrl = this.cstInfo.short_url
      if (!shortUrl) {
        this.$message.error('下载提取码获取失败！')
        this.downloadDialog = false

        return
      }
      window.open('/backend/file/download/' + shortUrl)
      this.downloadDialog = false
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style>

  hr {
    border: 1px dashed grey;
  }

  .box-card .el-card__body {
    padding: 0;
  }

  .main_row {
    margin-top: 15px;
  }

  .main_row .el-row {
    margin-top: 25px;
    text-align: left;
  }

  .main_row .el-row img {
    width: 50px;
    height: 50px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 100px;
  }

  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .cst_content {
    padding-top: 15px;
    padding-left: 10px;
    margin-left: 5px;
    background-color: #ffffff;
    height: 600px
  }

  .cst_content el-row {
    margin-bottom: 10px;
  }
</style>
