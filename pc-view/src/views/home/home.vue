<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <div>
          <div style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">统计周期</div>
              <el-select @change="tjzqChange" class="fl" v-model="tjzqvalue" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16" class="y-Center">
              <div class="grid-content bg-purple" style="font-size: 14px;width: 100px">自定义时间段</div>
              <div class="block">
                <el-date-picker unlink-panels @change="selectdateChange" value-format="yyyy-MM-dd" size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-col>
          </div>
          <div style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">团队范围</div>
              <el-select @change="tdfwChange" size="small" class="fl" v-model="tdfwvalue">
                <el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="y-Center">
              <div class="fl"  style="font-size: 14px;width: 100px;">团队名称</div>
              <el-select @change="teannameChange" size="small" :disabled="teannameshow" class="fl" v-model="teamname">
                <el-option v-for="(item, index) in teamoptions" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="y-Center">
              <div class="fl"  style="font-size: 14px;width: 100px;">负责人</div>
              <el-select size="small" @change="fuzerenChange" class="fl" v-model="fuzerenvalue" :disabled="fuzerenshow">
                <el-option v-for="(item, index) in fuzerenoptions" :key="index" :label="item.name" :value="item.openid">
                </el-option>
              </el-select>
            </el-col>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <div style="font-size: 16px;">项目更新</div>
          <el-row style="margin-top: 20px;">
            <el-col :span="6" class="x-Center">
              <el-col  :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div @click="addprojectClick(0)">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">新增项目</div>
                  <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #e3023b;font-size: 30px;">{{stateupdate0.total ? stateupdate0.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                  <div class="fl" style="width: 59%;font-size: 18px;">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate0.input_capacity ? stateupdate0.input_capacity : '--'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>
                    <div style="padding: 12px 0">{{stateupdate0.price ? stateupdate0.price / 10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                  </div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div @click="htqdClick(2)">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">合同签订</div>
                  <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00cc30;font-size: 30px;">{{stateupdate2.total ? stateupdate2.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                  <div class="fl" style="width: 59%;font-size: 18px;">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate2.input_capacity ? stateupdate2.input_capacity : '--'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>
                    <div style="padding: 12px 0">{{stateupdate2.price ? stateupdate2.price / 10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                  </div>
                </div>

              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div @click="sgwccompleteClick(3)">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">施工完成</div>
                  <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00abca;font-size: 30px;">{{stateupdate3.total ? stateupdate3.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                  <div class="fl" style="width: 59%;font-size: 18px;">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate3.input_capacity ? stateupdate3.input_capacity : '--'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>
                    <div style="padding: 12px 0">{{stateupdate3.price ? stateupdate3.price /10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                  </div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div @click="bwwccompleteClick(4)">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">并网完成</div>
                  <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #ca9b00;font-size: 30px;">{{stateupdate4.total ? stateupdate4.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                  <div class="fl" style="width: 59%;font-size: 18px;">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate4.input_capacity ? stateupdate4.input_capacity : '--'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>
                    <div style="padding: 12px 0">{{stateupdate4.price ? stateupdate4.price /10000 : '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
                  </div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center" style="margin-top: 30px;">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div @click="hkwccompleteClick(6)">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">回款完成</div>
                  <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00cc87;font-size: 30px;">{{stateupdate6.total ? stateupdate6.total : '--'}}</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                  <div class="fl" style="width: 59%;font-size: 18px;">
                    <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">{{stateupdate6.input_capacity ? stateupdate6.input_capacity : '--'}} <span style="color: #999;font-size: 12px;">千瓦</span></div>
                    <div style="padding: 12px 0">{{stateupdate6.price ? stateupdate6.price / 10000: '--'}} <span style="color: #999;font-size: 12px;">万元</span></div>
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
                <div @click="sgoverdueClick">
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
                <div @click="sgoverdueClick">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">并网逾期</div>
                  <div style="padding: 10px 0;">
                    <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">{{overduedata3.num ? overduedata3.num: '--'}}</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                    <div style="color: #999;font-size: 12px;">最长{{overduedata3.differ ? overduedata3.differ: '--'}}天</div>
                  </div>
                </div>

              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div @click="sgoverdueClick">
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
      </el-row>
    </el-card>
  </div>
</template>
<script>
import axios from 'axios'
import values from '../../utils/values'
export default {
  data () {
    return {
      options: [{
        value: 'today',
        label: '今天'
      }, {
        value: 'yesterday',
        label: '昨天'
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
      teamoptions: [],
      teamoptionsAll: [],
      teamname: '全部(可见范围)',
      fuzerenoptions: [

      ],
      fuzerenoptionsAll: [],
      tjzqvalue: '今天',
      datevalue: [

      ],
      overduedata2: {
        differ: '',
        num: ''
      },
      overduedata3: {
        differ: '',
        num: ''
      },
      overduedata4: {
        differ: '',
        num: ''
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
      stateupdate2: {},
      stateupdate3: {},
      stateupdate4: {},
      stateupdate6: {},
      fuzerenID: ''
    }
  },
  methods: {
    tjzqChange (e) {
      this.datevalue = []
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
          this.statisticaldata()
        })
      }
    },
    selectdateChange (e) {
      this.tjzqvalue = '自定义'
      this.datevalue = e
      console.log('时间统计', this.datevalue)
      this.statisticaldata()
    },
    requestdata () {
      axios.get('/api/pc/select/date/' + 'today').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
      })
      axios.get('/api/pc/select/team').then(res => {
        console.log('团队范围', res)
        res.teams.forEach(item => {
          this.teamoptionsAll.push(item)
          this.teamoptions.push(item)
        })
        res.agents.forEach(item => {
          this.fuzerenoptions.push(item)
          this.fuzerenoptionsAll.push(item)
        })
        console.log('团队名称', this.teamoptions)
        console.log('负责人', this.fuzerenoptions)
      })
    },
    tdfwChange (e) {
      console.log(e)
      this.teamLevel = e
      this.teamId = 'all'
      this.teamoptions = [
        {
          name: '全部(可见范围)'
        }
      ]
      for (let i = 0; i < this.teamoptionsAll.length; i++) {
        if (e === 'all') {
          this.planOwner = 'all'
          this.fuzerenvalue = '全部(可见范围)'
          this.teamoptions.push(this.teamoptionsAll[i])
          this.teannameshow = true
          this.fuzerenshow = true
        }
        if (e === Number(this.teamoptionsAll[i].level)) {
          this.fuzerenvalue = '全部(可见范围)'
          this.planOwner = 'all'
          this.teannameshow = false
          this.fuzerenshow = true
          this.teamoptions.push(this.teamoptionsAll[i])
          console.log('这里是团队范围变化=====', this.teamoptionsAll[i])
        }
        this.teamname = this.teamoptions[0].name
      }
      if (e === 'one') {
        this.planOwner = this.fuzerenID
        this.teannameshow = true
        this.teamoptions = [
          {
            name: '个人',
            id: 'one'
          }
        ]
        this.fuzerenoptions = []
        this.teamname = this.teamoptions[0].name
        for (let i = 0; i < this.fuzerenoptionsAll.length; i++) {
          if (String(e) === String(this.fuzerenoptionsAll[i].team_id)) {
            this.fuzerenoptions.push(this.fuzerenoptionsAll[i])
            this.fuzerenshow = false
            console.log('进来了', this.fuzerenshow)
          }
        }
        this.fuzerenvalue = this.fuzerenoptions[0].name
        this.planOwner = this.fuzerenoptions[0].openid
      }
      this.statisticaldata()
    },
    teannameChange (e) {
      console.log('团队名称ID', e)
      this.teamId = e
      this.fuzerenoptions = [
        {
          name: '全部(可见范围)'
        }
      ]
      if (!e) {
        this.fuzerenshow = true
        this.fuzerenvalue = this.fuzerenoptions[0].name
        this.teamId = 'all'
      }
      for (let i = 0; i < this.fuzerenoptionsAll.length; i++) {
        if (e === Number(this.fuzerenoptionsAll[i].team_id)) {
          this.fuzerenoptions.push(this.fuzerenoptionsAll[i])
          this.fuzerenshow = false
          console.log('进来了', this.fuzerenshow)
        }
      }
      this.statisticaldata()
    },
    fuzerenChange (e) {
      this.fuzerenID = e
      console.log('sdjkfdsjfjdsjfdjs', e)
      this.planOwner = e
      if (!e) {
        this.planOwner = 'all'
      }
      this.statisticaldata()
    },
    statisticaldata () {
      let overduedata2length = []
      let overduedata3length = []
      let overduedata4length = []
      this.stateupdate0 = {}
      this.stateupdate2 = {}
      this.stateupdate3 = {}
      this.stateupdate4 = {}
      this.stateupdate6 = {}
      this.overduedata2 = {
        differ: '',
        num: ''
      }
      this.overduedata3 = {
        differ: '',
        num: ''
      }
      this.overduedata4 = {
        differ: '',
        num: ''
      }
      setTimeout(() => {
        let objdata = {
          beginDate: this.datevalue[0],
          endDate: this.datevalue[1],
          teamLevel: String(this.teamLevel),
          teamId: String(this.teamId),
          planOwner: this.planOwner
        }
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        axios.post('/api/pc/home', objdata).then(res => {
          loading.close()
          console.log('项目更新数据', res)
          for (let i = 0; i < res.overDue.reverse().length; i++) {
            if (res.overDue[i].scd_status === 3) {
              this.overduedata3.differ = res.overDue[i].differ
              overduedata3length.push(res.overDue[i])
              this.overduedata3.num = overduedata3length.length
            }
            if (res.overDue[i].scd_status === 2) {
              this.overduedata2.differ = res.overDue[i].differ
              overduedata2length.push(res.overDue[i])
              this.overduedata2.num = overduedata2length.length
            }
            if (res.overDue[i].scd_status === 4) {
              this.overduedata4.differ = res.overDue[i].differ
              overduedata4length.push(res.overDue[i])
              this.overduedata4.num = overduedata4length.length
            }
          }
          for (let i = 0; i < res.schedule.length; i++) {
            if (res.schedule[i].scd_status === 0) {
              this.stateupdate0 = res.schedule[i]
            }
            if (res.schedule[i].scd_status === 2) {
              this.stateupdate2 = res.schedule[i]
            }
            if (res.schedule[i].scd_status === 3) {
              this.stateupdate3 = res.schedule[i]
            }
            if (res.schedule[i].scd_status === 4) {
              this.stateupdate4 = res.schedule[i]
            }
            if (res.schedule[i].scd_status === 6) {
              this.stateupdate6 = res.schedule[i]
            }
          }
        }, () => {
          loading.close()
        }).catch(() => {
          loading.close()
        })
      }, 500)
    },
    Jumpparameter (scdStatus) {
      let parameter = {
        beginDate: this.datevalue[0],
        endDate: this.datevalue[1],
        teamLevel: String(this.teamLevel),
        teamId: String(this.teamId),
        planOwner: this.planOwner,
        scdStatus: scdStatus,
        tjzqvalue: this.tjzqvalue,
        teamname: this.teamname,
        tdfwvalue: this.tdfwvalue,
        fuzerenvalue: this.fuzerenvalue
      }
      this.$router.push({path: '/SettingDetails', query: parameter})
    },
    addprojectClick (scdStatus) {
      console.log('点击数了 ')
      this.Jumpparameter(scdStatus)
    },
    htqdClick (scdStatus) {
      this.Jumpparameter(scdStatus)
    },
    sgwccompleteClick (scdStatus) {
      this.Jumpparameter(scdStatus)
    },
    bwwccompleteClick (scdStatus) {
      this.Jumpparameter(scdStatus)
    },
    hkwccompleteClick (scdStatus) {
      this.Jumpparameter(scdStatus)
    },
    sgoverdueClick () {
      let overdueparameter = {
        teamLevel: String(this.teamLevel),
        teamId: String(this.teamId),
        planOwner: this.planOwner,
        overDueStatus: '0',
        teamname: this.teamname,
        tdfwvalue: this.tdfwvalue,
        fuzerenvalue: this.fuzerenvalue

      }
      this.$router.push({path: '/SettingDetails', query: overdueparameter})
    }
  },
  mounted () {
    this.requestdata()
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    console.log('user表', sessionUser)
    this.statisticaldata()
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
