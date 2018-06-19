<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <div v-if="!customerDetails.is">
          <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        </div>
        <div v-if="customerDetails.is">
          <p>
          <span style="font-weight: 700;cursor: pointer" @click="enterHome"> 返回首页 </span><span> / </span><span> {{customerDetails.value}} </span>
          </p>
        </div>

      </el-breadcrumb>
      <el-row v-if="!customerDetails.is">
        <el-row class="f-m">
          <el-col :span="24" style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">统计周期：</el-col >
              <el-col :span="18">
                <el-select @change="tjzqChange" v-model="tjzqvalue" size="small">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="grid-content bg-purple font-right">自定义时间：</el-col>
              <el-col :span="18">
                <el-date-picker unlink-panels @change="selectdateChange" value-format="yyyy-MM-dd" style="width: 88%" size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="24" style="margin-top: 20px;" class="clearfix">
            <!--<el-col :span="8" class="y-Center">-->
              <!--<el-col :span="6" class="font-right">团队范围：</el-col>-->
              <!--<el-col :span="18">-->
                <!--<el-select @change="tdfwChange" size="small" class="fl" v-model="tdfwvalue">-->
                  <!--<el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-col>-->
            <!--</el-col>-->
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">团队名称：</el-col>
              <el-col :span="18">
                <el-select @change="teannameChange" size="small" style="width: 88%" class="fl" v-model="teamname">
                  <el-option v-for="(item, index) in teamoptions" :key="index" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">负责人：</el-col>
              <el-select size="small" v-model="fuzerenvalue" @change="fuzerenChange">
                <el-option v-for="(item, index) in fuzerenoptions" :key="index" :label="item.name" :value="item.openid">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="3" style="margin-top: 20px;margin-left: 30px;">
            <el-button type="success" @click="submitClick" size="mini">确认筛选</el-button>
          </el-col>
        </el-row>
        <div
          v-loading="tableLoading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading">
          <div style="margin-top: 20px;">
            <div style="font-size: 16px;">项目更新</div>
            <el-row style="margin-top: 20px;">
              <el-col :span="6" class="x-Center">
                <el-col  :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="addprojectClick(0)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">客户数量</div>
                    <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #e3023b;font-size: 30px;">{{stateupdate0.total ? stateupdate0.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                    <div class="fl" style="width: 59%;font-size: 18px;">
                      <!--<div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate0.input_capacity ? stateupdate0.input_capacity : '&#45;&#45;'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>-->
                      <div style="padding: 40px 0">{{stateupdate0.price ? stateupdate0.price / 10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                    </div>
                  </div>
                </el-col>
              </el-col>
              <el-col :span="6" class="x-Center">
                <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="htqdClick(2)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">合同签订</div>
                    <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00cc30;font-size: 30px;">{{stateupdate2.total ? stateupdate2.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                    <div class="fl" style="width: 59%;font-size: 18px;">
                      <!--<div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate2.input_capacity ? stateupdate2.input_capacity : '&#45;&#45;'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>-->
                      <div style="padding: 40px 0">{{stateupdate2.price ? stateupdate2.price / 10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                    </div>
                  </div>

                </el-col>
              </el-col>
              <el-col :span="6" class="x-Center">
                <el-col :span="24" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="sgwccompleteClick(3)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">施工完成</div>
                    <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00abca;font-size: 30px;">{{stateupdate3.total ? stateupdate3.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                    <div class="fl" style="width: 59%;font-size: 18px;">
                      <!--<div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate3.input_capacity ? stateupdate3.input_capacity : '&#45;&#45;'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>-->
                      <div style="padding: 40px 0">{{stateupdate3.price ? stateupdate3.price /10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                    </div>
                  </div>
                </el-col>
              </el-col>
              <el-col :span="6" class="x-Center">
                <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="bwwccompleteClick(4)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">验收完成</div>
                    <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #ca9b00;font-size: 30px;">{{stateupdate4.total ? stateupdate4.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                    <div class="fl" style="width: 59%;font-size: 18px;">
                      <!--<div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate4.input_capacity ? stateupdate4.input_capacity : '&#45;&#45;'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>-->
                      <div style="padding: 40px 0">{{stateupdate4.price ? stateupdate4.price /10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                    </div>
                  </div>
                </el-col>
              </el-col>
              <el-col :span="6" class="x-Center" style="margin-top: 30px;">
                <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="hkwccompleteClick(6)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">回款完成</div>
                    <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00cc87;font-size: 30px;">{{stateupdate6.total ? stateupdate6.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                    <div class="fl" style="width: 59%;font-size: 18px;">
                      <!--<div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate6.input_capacity ? stateupdate6.input_capacity : '&#45;&#45;'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>-->
                      <div style="padding: 40px 0">{{stateupdate6.price ? stateupdate6.price / 10000: '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                    </div>
                  </div>
                </el-col>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 20px;">
            <div style="font-size: 16px;"><span>逾期项目</span> <router-link to="/Overdue" style="font-size: 10px;color: #409EFF;">规则设置</router-link></div>
            <el-row style="margin-top: 20px;">
              <el-col :span="6" class="x-Center">
                <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="sgoverdueClick(2)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">施工逾期</div>
                    <div style="padding: 10px 0;">
                      <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">{{overduedata2.num ? overduedata2.num : '--'}}</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                      <div style="color: #999;font-size: 12px;">最长{{overduedata2.differ ? overduedata2.differ : '--'}}天</div>
                    </div>
                  </div>

                </el-col>
              </el-col>
              <el-col :span="6" class="x-Center">
                <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="sgoverdueClick(3)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">验收逾期</div>
                    <div style="padding: 10px 0;">
                      <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">{{overduedata3.num ? overduedata3.num: '--'}}</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                      <div style="color: #999;font-size: 12px;">最长{{overduedata3.differ ? overduedata3.differ: '--'}}天</div>
                    </div>
                  </div>

                </el-col>
              </el-col>
              <el-col :span="6" class="x-Center">
                <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                  <div @click="sgoverdueClick(4)" style="cursor: pointer">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">回款逾期</div>
                    <div style="padding: 10px 0;">
                      <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">{{overduedata4.num ? overduedata4.num :'--'}}</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                      <div style="color: #999;font-size: 12px;">最长{{overduedata4.differ ? overduedata4.differ: '--'}}天</div>
                    </div>
                  </div>
                </el-col>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-row>

      <el-row v-if="customerDetails.is">
          <el-col :span="24">
            <el-table border
                      :data="customerDetails.data" size="small" stripe
                      v-loading="tableLoading"
                      element-loading-text="加载中..."
                      element-loading-spinner="el-icon-loading"
                      style="width: 100%;border: 1px solid #ebeef5;margin-top: 30px;">
              <el-table-column prop="cst_name" label="客户名称" ></el-table-column>
              <el-table-column prop="user_name" label="负责人" ></el-table-column>
              <el-table-column prop="cst_address" label="地址" width="200"></el-table-column>
              <!--<el-table-column prop="zj_capacity" label="装机容量" align="center"></el-table-column>-->
              <el-table-column prop="zj_price" label="合同金额" align="center"></el-table-column>
              <el-table-column prop="pay_sum" label="回款金额" align="center"></el-table-column>
              <el-table-column prop="scd_time" label="开始时间" align="center" width="100"></el-table-column>
              <el-table-column prop="scd_name" label="合同状态" align="center"></el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row.id)" type="text" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import values from '../../utils/values'
export default {
  data () {
    return {
      customerDetails: {
        value: '',
        is: false,
        data: []
      },
      user: '',
      tableLoading: false,
      options: [{
        value: 'today',
        label: '今日'
      }, {
        value: 'yesterday',
        label: '昨日'
      }, {
        value: 'thisWeek',
        label: '本周'
      }, {
        value: 'lastWeek',
        label: '上周'
      }, {
        value: 'thisMonth',
        label: '本月'
      }, {
        value: 'lastMonth',
        label: '上月'
      }, {
        value: 'thisYear',
        label: '本年'
      }, {
        value: 'total',
        label: '累计'
      }, {
        value: '自定义',
        label: '自定义'
      }],
      tdfwoptions: [
        {
          value: 'all',
          label: '全部(可见范围)'
        },
        {
          value: 1,
          label: '一级团队'
        },
        {
          value: 2,
          label: '二级团队'
        },
        {
          value: 3,
          label: '三级团队'
        },
        {
          value: 'one',
          label: '个人'
        }
      ],
      infoAll: [], // 所有的项目
      teamoptions: [], // 当前的所有子团队信息---下拉菜单
      teamAll: [], // 所有的子团队 id
      arr: [], // 选择的子团队 id
      userid: '', // 选择的负责人(成员)
      teamname: '全部(可见范围)',
      overInfo: [], // 所有的逾期数据
      fuzerenoptions: [], // 当前所有成员信息---下拉菜单
      chooseHistoryInfo: [], // 筛选的历史数据
      chooseHistoryOver: [], // 筛选的逾期数据
      fuzerenoptionsAll: [],
      tjzqvalue: '累计',
      sosoChoose: {
        open_id: 0,
        team_id: [],
        user_id: 0,
        time: []
      }, // 最终选择的所有数据
      datevalue: [

      ],
      overduedata2: {
        differ: '',
        num: 0
      },
      overduedata3: {
        differ: '',
        num: 0
      },
      overduedata4: {
        differ: '',
        num: 0
      },
      tdfwvalue: '全部(可见范围)',
      fuzerenvalue: '全部(可见范围)',
      teannameshow: true,
      fuzerenshow: true,
      htqdday: '',
      sgwcday: '',
      bwwcday: '',
      teamLevel: 'all',
      teamId: 'all',
      planOwner: 'all',
      stateupdate0: {},
      stateupdate1: {},
      stateupdate2: {},
      stateupdate3: {},
      stateupdate4: {},
      stateupdate6: {},
      fuzerenID: ''
    }
  },
  methods: {
    //  生成新页面
    handleClick (id) {
      console.log('id:')
      console.log(id)
      // 通过替换生成新url,在新tab里打开网页
      const href = window.location.href.replace('Home', 'CustomerDetails?planId=' + id)
      console.log(href)
      window.open(href)
      // this.$router.push({path: '/CustomerDetails', query: {planId: id}})
    },
    //  点击首页
    enterHome () {
      this.customerDetails.is = false
      let time = []
      // 时间会出现一点问题,需要重新转化
      time[0] = new Date(this.$store.state.home.choose_info.time[0])
      time[1] = new Date(this.$store.state.home.choose_info.time[1])
      this.datevalue = time
      console.log(this.datevalue)
      console.log('点击返回首页了')
    },
    //  更改任何一个选项时,调用的方法,用于缓存,已经保存筛选数据===>核心
    upChooseInfo (openId, teamId, userId) {
      // 对象解构
      this.sosoChoose.open_id = openId
      this.sosoChoose.team_id = teamId
      this.sosoChoose.user_id = userId
      this.sosoChoose.time = this.datevalue
      console.log('当前选项', JSON.stringify(this.sosoChoose))
    },
    //  选择时间
    tjzqChange (e) {
      this.datevalue = []
      console.log('输出当前时间', this.tjzqvalue)
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
          this.upChooseInfo(this.sosoChoose.open_id, this.sosoChoose.team_id, this.sosoChoose.user_id, this.datevalue)
        })
      }
    },
    //  自定义选择时间
    selectdateChange (e) {
      this.tjzqvalue = '自定义'
      this.datevalue = e
      this.upChooseInfo(this.sosoChoose.open_id, this.sosoChoose.team_id, this.sosoChoose.user_id, this.datevalue)
      console.log('时间统计', this.datevalue)
    },
    //  最初的时间获取
    requestdata () {
      axios.get('/api/pc/select/date/' + 'total').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        this.upChooseInfo(this.sosoChoose.open_id, this.sosoChoose.team_id, this.sosoChoose.user_id, this.datevalue)
        console.log('统计周期', this.datevalue)
      })
    },
    //  获取团队成员
    getTeamUser (teamId) {
      console.log(teamId)
      if (!teamId || teamId.length === 0) {
        return
      }
      axios.post('/api/pc/teamUser/getTeamUser', {teamId}).then((data) => {
        console.log('获取团队成员成功', data)
        if (!data || data.length === 0) {
          return
        }
        this.fuzerenoptions = data
        this.fuzerenoptions.unshift({openid: -2, name: '全部(可见范围)'})
        if (!this.$store.state.home.isStart) {
          this.fuzerenvalue = '全部(可见范围)'
        }
      }).catch((err) => {
        console.log('获取团队成员失败', err)
      })
    },
    //  团队名称筛选
    teannameChange (e) {
      for (let p in this.teamoptions) {
        if (this.teamoptions[p].id === e) {
          console.log('团队名称ID', e, this.teamoptions[p].name)
          break
        }
      }
      this.teamId = e
      let obj = {
        array: this.teamAll,
        companyId: e
      }
      this.arr = []
      // 选择个人项目时
      if (e === -1) {
        this.upChooseInfo(-1, [], -1)
        this.fuzerenoptions = [{openid: -1, name: '个人项目信息(可见范围)'}]
        this.fuzerenvalue = '个人项目信息(可见范围)'
        return
      }
      // 选择所有团队时
      if (e === -2) {
        this.upChooseInfo(-2, this.teamAll, -2)
        this.getTeamUser(this.teamAll)
        return
      }
      this.fuzerenoptions = [{openid: -2, name: '全部(可见范围)'}]
      this.fuzerenvalue = '全部(可见范围)'
      axios.post('/api/pc/teamUser/userChooseAndUser', obj)
        .then(res => {
          console.log('获取选择的公司数据成功', res)
          if (res && res.length > 0) {
            this.getTeamUser(res)
            this.arr = res
            this.upChooseInfo(0, res, -2)
          }
        })
        .catch(err => {
          console.log('获取选择的公司数据失败')
          console.log(err)
        })
    },
    //  负责人筛选
    fuzerenChange (e) {
      this.fuzerenID = e
      for (let i in this.fuzerenoptions) {
        if (this.fuzerenoptions[i].openid === e) {
          console.log('负责人筛选', e, this.fuzerenoptions[i].name)
        }
      }
      this.upChooseInfo(this.sosoChoose.open_id, this.sosoChoose.team_id, this.fuzerenID, this.sosoChoose.time)
      this.planOwner = e
      if (!e) {
        this.planOwner = 'all'
      }
    },
    //  整理数据
    upInfo (data) {
      this.stateupdate0 = {total: 0, input_capacity: 0, price: 0}
      this.stateupdate1 = {total: 0, input_capacity: 0, price: 0}
      this.stateupdate2 = {total: 0, input_capacity: 0, price: 0}
      this.stateupdate3 = {total: 0, input_capacity: 0, price: 0}
      this.stateupdate4 = {total: 0, input_capacity: 0, price: 0}
      this.stateupdate6 = {total: 0, input_capacity: 0, price: 0}
      if (!data || data.length === 0) {
        return
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].scd_name == '并网完成') {
             data[i].scd_name = '验收完成'
          }
        if (data[i].scd_status === 0 || data[i].scd_status === 1) {
          ++this.stateupdate0['total']
          this.stateupdate0['input_capacity'] = this.stateupdate0['input_capacity'] + (data[i].zj_capacity || 0)
          this.stateupdate0['price'] = this.stateupdate0['price'] + (data[i].zj_price || 0)
        }
        if (data[i].scd_status === 2) {
          ++this.stateupdate2['total']
          this.stateupdate2['input_capacity'] = this.stateupdate2['input_capacity'] + (data[i].zj_capacity || 0)
          this.stateupdate2['price'] = this.stateupdate2['price'] + (data[i].zj_price || 0)
        }
        if (data[i].scd_status === 3) {
          ++this.stateupdate3['total']
          this.stateupdate3['input_capacity'] = this.stateupdate3['input_capacity'] + (data[i].zj_capacity || 0)
          this.stateupdate3['price'] = this.stateupdate3['price'] + (data[i].zj_price || 0)
        }
        if (data[i].scd_status === 4) {
          ++this.stateupdate4['total']
          this.stateupdate4['input_capacity'] = this.stateupdate4['input_capacity'] + (data[i].zj_capacity || 0)
          this.stateupdate4['price'] = this.stateupdate4['price'] + (data[i].zj_price || 0)
        }
        if (data[i].scd_status === 6) {
          ++this.stateupdate6['total']
          this.stateupdate6['input_capacity'] = this.stateupdate6['input_capacity'] + (data[i].zj_capacity || 0)
          this.stateupdate6['price'] = this.stateupdate6['price'] + (data[i].zj_price || 0)
        }
      }
      if (this.stateupdate0['input_capacity'] !== 0) {
        this.stateupdate0['input_capacity'] = this.stateupdate0['input_capacity'].toFixed(4)
      }
      if (this.stateupdate2['input_capacity'] !== 0) {
        this.stateupdate2['input_capacity'] = this.stateupdate2['input_capacity'].toFixed(4)
      }
      if (this.stateupdate3['input_capacity'] !== 0) {
        this.stateupdate3['input_capacity'] = this.stateupdate3['input_capacity'].toFixed(4)
      }
      if (this.stateupdate4['input_capacity'] !== 0) {
        this.stateupdate4['input_capacity'] = this.stateupdate4['input_capacity'].toFixed(4)
      }
      if (this.stateupdate6['input_capacity']) {
        this.stateupdate6['input_capacity'] = this.stateupdate6['input_capacity'].toFixed(4)
      }

      let that = this
      // 最初进入首页时,1秒后会自动添加缓存
      setTimeout(function () {
        that.update_status()
      }, 1000)
      console.log('结束 === >>>>')
    },
    //  整理逾期
    upOver (data) {
      console.log('整理逾期')
      this.overduedata2 = {differ: '', num: 0}
      this.overduedata3 = {differ: '', num: 0}
      this.overduedata4 = {differ: '', num: 0}
      let overInfo = data
      for (let i in overInfo) {
        if (overInfo[i].scd_status === 2) {
          ++this.overduedata2.num
        }
        if (overInfo[i].scd_status === 3) {
          ++this.overduedata3.num
        }
        if (overInfo[i].scd_status === 4) {
          ++this.overduedata4.num
        }
      }
    },
    //  vuex状态修改
    update_status () {
      this.$store.state.home.data.over_info = this.overInfo // 逾期数据
      this.$store.state.home.data.plan_info = this.infoAll // 所有历史数据
      this.$store.state.home.data.team_id = this.teamAll // 所有的子团队 id
      this.$store.state.home.data.team_info = this.teamoptions // 所有的子团队信息
      this.$store.state.home.data.team_user = this.fuzerenoptions // 所有的成员列表

      this.$store.state.home.choose_info.open_id = this.sosoChoose.open_id
      this.$store.state.home.choose_info.team_id = this.sosoChoose.team_id
      this.$store.state.home.choose_info.user_id = this.sosoChoose.user_id
      this.$store.state.home.choose_info.time = this.sosoChoose.time

      // 公司团队名字
      for (let i in this.teamoptions) {
        if (this.teamoptions[i].id === this.teamname) {
          this.$store.state.home.show_info.open_name = this.teamoptions[i].name
          this.$store.state.home.show_info.team_name = this.teamoptions[i].name
          break
        } else {
          this.$store.state.home.show_info.open_name = this.teamname
          this.$store.state.home.show_info.team_name = this.teamname
        }
      }

      // 时间
      for (let l in this.options) {
        if (this.options[l].value === this.tjzqvalue) {
          this.$store.state.home.show_info.min_time = this.options[l].label
          break
        } else {
          this.$store.state.home.show_info.min_time = this.tjzqvalue
        }
      }
      // 负责人名字
      for (let p in this.fuzerenoptions) {
        if (this.fuzerenoptions[p].openid === this.fuzerenvalue) {
          this.$store.state.home.show_info.user_name = this.fuzerenoptions[p].name
          break
        } else {
          this.$store.state.home.show_info.user_name = this.fuzerenvalue
        }
      }

      console.log('当前成员', this.$store.state.home.data.team_user)

      console.log('当前成员名字', this.$store.state.home.show_info.user_name)
      this.$store.state.home.show_info.time = this.sosoChoose.time
      this.$store.state.home.isLive = true
      this.$store.state.home.isStart = true
    },
    //  筛选项目=>历史数据
    chooseGetInfo_status () {
      console.log('筛选历史')
      // 筛选项目时,时间选择是必须的,所以第一步应该是筛选时间节点内的项目.
      let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
      let openId = this.sosoChoose.open_id // -1时代表选择的自己,0时代表选择的某个团队,-2时代表全部
      let teamId = this.sosoChoose.team_id // 团队 id
      let userId = this.sosoChoose.user_id // -2时代表全部,-1时代表个人
      let time = this.sosoChoose.time // 时间

      time[0] = new Date(time[0]).getTime()
      time[1] = new Date(time[1]).getTime()
      let infoAll = []
      for (let index in this.infoAll) {
        let ms = new Date(this.infoAll[index].scd_time).getTime()
        if ((ms > time[0] || ms === time[0]) && (ms < time[1] || ms === time[1])) {
          infoAll.push(this.infoAll[index])
        }
      } //  时间筛选项目
      let data = []
      if (time.length === 0) {
        return
      }
      //  当选择查看自己的信息时
      if (openId === -1) {
        console.log('选择的查看自己')
        openId = sessionUser.openid || 0
        if (!openId) {
          return
        }
        for (let i in infoAll) {
          if (infoAll[i].open_id === openId) {
            data.push(infoAll[i])
          }
        }
      }
      //  当选择查看某个团队时,有两种情况,一个是查看团队内所有的项目信息,一个是查看某个成员的项目信息
      if (openId === 0) {
        console.log('选择的有团队')
        //  选择全部
        if (userId === -2) {
          for (let i in infoAll) {
            if (teamId.indexOf(infoAll[i].team_id) > -1) {
              data.push(infoAll[i])
            }
          }
        } else {
          //  选择查看某个用户时
          for (let i in infoAll) {
            if (teamId.indexOf(infoAll[i].team_id) > -1 && infoAll[i].open_id === userId) {
              data.push(infoAll[i])
            }
          }
        }
      }
      //  查看全部时
      if (openId === -2) {
        console.log('选择的查看全部')
        if (userId === -2) {
          data = infoAll
        } else {
          for (let i in infoAll) {
            if (infoAll[i].open_id === userId) {
              data.push(infoAll[i])
            }
          }
        }
      }
      console.log('有' + data.length + '个项目信息')
      this.chooseHistoryInfo = data
      this.upInfo(data)
    },
    //  筛选项目=>逾期数据
    chooseGetinfo_over () {
      console.log('筛选逾期')
      // 筛选项目时,时间选择是必须的,所以第一步应该是筛选时间节点内的项目.
      let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
      let openId = this.sosoChoose.open_id // -1时代表选择的自己,0时代表选择的某个团队,-2时代表全部
      let teamId = this.sosoChoose.team_id // 团队 id
      let userId = this.sosoChoose.user_id // -2时代表全部,-1时代表个人

      let infoAll = this.overInfo
      let data = []
      //  当选择查看自己的信息时
      if (openId === -1) {
        console.log('选择的查看自己')
        openId = sessionUser.openid || 0
        if (!openId) {
          return
        }
        for (let i in infoAll) {
          if (infoAll[i].open_id === openId) {
            data.push(infoAll[i])
          }
        }
      }
      //  当选择查看某个团队时,有两种情况,一个是查看团队内所有的项目信息,一个是查看某个成员的项目信息
      if (openId === 0) {
        console.log('选择的有团队')
        //  选择全部
        if (userId === -2) {
          for (let i in infoAll) {
            if (teamId.indexOf(infoAll[i].team_id) > -1) {
              data.push(infoAll[i])
            }
          }
        } else {
          //  选择查看某个用户时
          for (let i in infoAll) {
            if (teamId.indexOf(infoAll[i].team_id) > -1 && infoAll[i].open_id === userId) {
              data.push(infoAll[i])
            }
          }
        }
      }
      //  查看全部时
      if (openId === -2) {
        console.log('选择的查看全部')
        if (userId === -2) {
          data = infoAll
        } else {
          for (let i in infoAll) {
            if (infoAll[i].open_id === openId) {
              data.push(infoAll[i])
            }
          }
        }
      }
      console.log('有' + data.length + '个逾期信息')
      this.chooseHistoryOver = data
      this.upOver(data)
    },
    //  筛选项目=======>重要
    chooseGetInfo () {
      this.chooseGetInfo_status() // 历史数据筛选
      this.chooseGetinfo_over() //  逾期数据筛选
      this.update_status()//  vuex 状态修改
    },
    //  获取项目详情
    Jumpparameter (scdStatus) {
      this.customerDetails.data = []
      let data = this.chooseHistoryInfo
      for (let i in data) {
        if (scdStatus === 0) {
          if (data[i].scd_status === 0 || data[i].scd_status === 1) {
            this.customerDetails.data.unshift(data[i])
          }
        } else {
          if (data[i].scd_status === scdStatus) {
            this.customerDetails.data.unshift(data[i])
          }
        }
      }
      this.customerDetails.value = scdStatus
      this.customerDetails.is = true
      //      let parameter = {
      //        beginDate: this.datevalue[0],
      //        endDate: this.datevalue[1],
      //        teamLevel: String(this.teamLevel),
      //        teamId: String(this.teamId),
      //        planOwner: this.planOwner,
      //        scdStatus: scdStatus,
      //        tjzqvalue: this.tjzqvalue,
      //        teamname: this.teamname,
      //        tdfwvalue: this.tdfwvalue,
      //        fuzerenvalue: this.fuzerenvalue
      //      }
      //      console.log('获取项目详情', parameter)
      //      this.$store.state.settingDetails.form = 'home'
      //      this.$router.push({path: '/SettingDetails', query: parameter})
      console.log(scdStatus)
    },
    //  客户数量
    addprojectClick (scdStatus) {
      this.Jumpparameter(scdStatus)
      this.customerDetails.value = '客户数量'
    },
    //  合同签订
    htqdClick (scdStatus) {
      this.Jumpparameter(scdStatus)
      this.customerDetails.value = '合同签订'
    },
    //  施工完成
    sgwccompleteClick (scdStatus) {
      this.Jumpparameter(scdStatus)
      this.customerDetails.value = '施工完成'
    },
    //  并网完成
    bwwccompleteClick (scdStatus) {
      this.Jumpparameter(scdStatus)
      this.customerDetails.value = '验收完成'
    },
    //  回款完成
    hkwccompleteClick (scdStatus) {
      this.Jumpparameter(scdStatus)
      this.customerDetails.value = '回款完成'
    },
    //  逾期
    sgoverdueClick (scdStatus) {
      this.customerDetails.is = true
      this.customerDetails.data = []
      if (scdStatus === 2) {
        this.customerDetails.value = '施工逾期'
      }
      if (scdStatus === 3) {
        this.customerDetails.value = '验收逾期'
      }
      if (scdStatus === 4) {
        this.customerDetails.value = '回款逾期'
      }

      for (let i in this.chooseHistoryOver) {
        if (this.chooseHistoryOver[i].scd_status === scdStatus) {
          console.log(this.chooseHistoryOver[i].scd_time)
          let str = String(moment(this.chooseHistoryOver[i].scd_time).format('YYY-MM-DD'))
          this.chooseHistoryOver[i].scd_time = str.slice(2)
          this.customerDetails.data.unshift(this.chooseHistoryOver[i])
        }
      }
      //      let overdueparameter = {
      //        teamLevel: String(this.teamLevel),
      //        teamId: String(this.teamId),
      //        planOwner: this.planOwner,
      //        overDueStatus: '0',
      //        teamname: this.teamname,
      //        tdfwvalue: this.tdfwvalue,
      //        fuzerenvalue: this.fuzerenvalue,
      //        scdStatus: scdStatus
      //
      //      }
      //      this.$store.state.settingDetails.form = 'home'
      //      this.$router.push({path: '/SettingDetails', query: overdueparameter})
    },
    submitClick () {
      this.chooseGetInfo()
    },
    //  最初获取所有子团队
    get_son (fn, fn2) {
      let openId = this.user.openid
      let companyId = this.user.company_id
      if (!openId || !companyId) {
        return
      }
      let obj = {
        openId,
        companyId
      }

      axios.post('/api/teamUser/manageTeam', obj).then((data) => {
        console.log('获取子团队成功', data)
        if (data && data.length > 0) {
          //  获取团队下所有的成员
          this.teamAll = data[0]
          this.teamoptions = data[1]
          this.teamoptions.push({id: -1, name: '个人项目信息'})
          this.teamoptions.unshift({id: -2, name: '全部(可选范围)'})
          if (!this.$store.state.home.isStart) {
            this.upChooseInfo(-2, data[0], -2, this.datevalue)
          }
          this.getTeamUser(data[0]) // 获取团队成员
          if (fn) {
            fn(data[0])
          }
          if (fn2) {
            let over = {
              open_id: openId,
              arr: data[0]
            }
            fn2(over)
          }
        } else {
          this.tableLoading = false
        }
      }).catch((err) => {
        console.log('获取子团队失败', err)
      })
    },
    //  获取业务员的历史项目信息--业务员情况下
    getUserInfo (openId) {
      axios.post('/api/pc/plans/getUserPlans', {open_id: openId}).then((data) => {
        console.log('获取业务员历史项目信息成功')
        this.upChooseInfo(-1, this.sosoChoose.team_id, -2, this.datevalue)

        this.tableLoading = false
        if (data && data.length > 0) {
          this.infoAll = data
          if (!this.$store.state.home.isStart) {
            this.upInfo(data)
            this.chooseHistoryInfo = data
          } else {
            this.chooseGetInfo_status()
            this.chooseGetinfo_over()
          }
        }
      }).catch((err) => {
        console.log('获取业务员历史项目信息失败', err)
      })
    },
    //  最初获取项目历史数据-管理员
    startGetInfo (teamId) {
      console.log('最初的获取信息', teamId)
      axios.post('/api/pc/plans/getAllPlans', {teamId}).then((data) => {
        console.log('获取最初项目历史数据成功', data)
        if (!data) {
          return
        }
        this.infoAll = data

        this.tableLoading = false
        if (!this.$store.state.home.isStart) {
          this.chooseHistoryInfo = data // 将最初获取到的数据添加给详情缓存
          this.upInfo(data)
        } else {
          this.chooseGetInfo_status()
        }
      }).catch((err) => {
        console.log('获取最初项目历史数据失败', err)
      })
    },
    //  最初获取项目逾期数据
    startGetOver (data) {
      axios.post('api/pc/plans/pcOverdue', data).then(data => {
        console.log('获取逾期数据成功')
        console.log(data)
        if (data) {
          //  16小时换算的毫秒数57600000
          for (let i in data) {
            if (data[i].scd_time) {
              let time = new Date(data[i].scd_time).getTime() - 0 + 57600000
              data[i].scd_time = new Date(time)
            }
          }
          this.overInfo = data
          if (!this.$store.state.home.isStart) {
            this.chooseHistoryOver = data // 将最初获取到的数据添加给详情缓存
            this.upOver(data)
          } else {
            this.chooseGetinfo_over()
          }
        }
      }).catch(err => {
        console.log('获取逾期数据失败')
        console.log(err)
      })
    },
    //  管理员的数据获取
    admin () {
      //  获取所有团队和当前团队内的所有成员(1,获取项目历史数据,2获取逾期数据)
      this.get_son(this.startGetInfo, this.startGetOver)
    },
    //  业务员的数据获取
    staff (up) {
      //  修改数据
      this.fuzerenoptions = [{openid: -1, name: '个人项目信息(可见范围)'}]
      this.fuzerenvalue = '个人项目信息(可见范围)'
      this.teamoptions = [{id: -1, name: '个人项目信息(可见范围)'}]
      this.teamname = '个人项目信息(可见范围)'
      //  获取数据
      let openId = this.user.openid
      this.getUserInfo(openId)
      this.startGetOver({open_id: openId})
    },
    //  判断用户是否是管理员
    is_userRank (callback) {
      let openId = this.user.openid
      let maxTeamRank = this.user.maxTeamRank
      if (maxTeamRank && maxTeamRank === 1) {
        console.log(JSON.stringify(this.user))
        console.log('高级管理员')
        callback('maxRank')
      } else {
        let obj = {
          openId: openId
        }
        axios.post('/api/pc/user/isRank', obj).then((data) => {
          console.log(data)
          if (data && data.data && data.data.team_company_id && (data.data.team_level || data.data.team_level === 0)) {
            console.log('底层是管理员')
            callback('rank')
          }
          if (!data || !data.data || !data.data.team_company_id) {
            // 底层也是业务员
            console.log('底层是业务员')
            callback('user')
          }
        }).catch((err) => {
          console.log('开始判断底层是否是管理员失败')
          this.tableLoading = false
          callback('planUser')
          console.log(err)
        })
      }
    },
    //  最初加载
    show () {
      let that = this
      this.requestdata()
      if (!this.user) {
        return
      }
      let companyId = this.user.company_id
      if (!companyId) {
        console.log('是游客!!')
        return
      }
      this.is_userRank(function (is) {
        if (is === 'rank' || is === 'maxRank') {
          console.log('管理员')
          that.admin()
        }
        if (is === 'user') {
          console.log('业务员')
          that.staff()
        }
      })
    },
    //  执行缓存
    start_status () {
      this.overInfo = this.$store.state.home.data.over_info // 逾期数据
      this.infoAll = this.$store.state.home.data.plan_info // 所有历史数据
      this.teamAll = this.$store.state.home.data.team_id // 所有的子团队 id
      this.teamoptions = this.$store.state.home.data.team_info // 所有的子团队信息
      this.fuzerenoptions = this.$store.state.home.data.team_user // 所有的成员列表

      this.sosoChoose.open_id = this.$store.state.home.choose_info.open_id
      this.sosoChoose.team_id = this.$store.state.home.choose_info.team_id
      this.sosoChoose.user_id = this.$store.state.home.choose_info.user_id
      this.sosoChoose.time = this.$store.state.home.choose_info.time

      this.teamname = this.$store.state.home.show_info.open_name
      this.teamname = this.$store.state.home.show_info.team_name

      this.tjzqvalue = this.$store.state.home.show_info.min_time
      this.fuzerenvalue = this.$store.state.home.show_info.user_name
      this.sosoChoose.time = this.$store.state.home.show_info.time
      let time = []
      time[0] = new Date(this.$store.state.home.choose_info.time[0])
      time[1] = new Date(this.$store.state.home.choose_info.time[1])
      this.datevalue = time

      console.log('当前成员', this.$store.state.home.data.team_user)

      console.log('当前成员名字', this.$store.state.home.show_info.user_name)

      this.chooseGetInfo_status() // 历史数据筛选
      this.chooseGetinfo_over() //  逾期数据筛选
      // 在这里需要重新判断用户是否是管理员,然后采用管理员和业务员重新布局

      this.tableLoading = false
      let that = this
      this.is_userRank(function (is) {
        if (is === 1) {
          console.log('执行缓存检测是管理员')
          that.get_son(that.startGetInfo, that.startGetOver)
        }
        if (is === 2) {
          console.log('执行缓存检测是业务员')
          that.staff()
        }
      })
    }
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    this.user = sessionUser
    console.log('当前登录的用户', this.user.openid)
    console.log('输出首页缓存', JSON.stringify(this.$store.state.home.data), this.$store.state.home.choose_info.time)
    console.log(this.$store.state.home.isStart)
    this.tableLoading = true
    if (this.$store.state.home.isStart) {
      console.log('执行缓存')
      this.start_status()
      return
    }

    this.show()
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
</style>
