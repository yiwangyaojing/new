<template>
    <el-card class="box-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/SettingDetails' }">进度详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row>
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
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">团队名称：</el-col>
              <el-col :span="18">
                <el-select @change="teannameChange" size="small" style="width: 88%" :disabled="teannameshow" class="fl" v-model="teamname">
                  <el-option v-for="(item, index) in teamoptions" :key="index" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">负责人：</el-col>
              <el-select size="small" v-model="fuzerenvalue" @change="fuzerenChange" :disabled="fuzerenshow">
                <el-option v-for="(item, index) in fuzerenoptions" :key="index" :label="item.name" :value="item.openid">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="24" style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">合同状态：</el-col>
              <el-select size="small" class="fl" @change="contractChange" v-model="contractvalue" placeholder="请选择">
                <el-option v-for="item in contractoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="y-Center">
              <el-col :span="6" class="font-right">逾期状态：</el-col>
              <el-col :span="18">
                <el-select style="width: 88%" size="small" @change="overdueChange" v-model="overduevalue" placeholder="请选择">
                  <el-option v-for="item in overdueoptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="24" style="margin-top: 20px;">
            <el-col :span="16" class="y-Center">
              <el-col :span="3" class="font-right">搜索条件：</el-col>
              <el-col :span="21">
                <el-col>
                  <el-input style="width: 95%;" size="small" @input="searchChange" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchvalue">
                  </el-input>
                </el-col>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="3" style="margin-top: 20px;margin-left: 30px;">
            <el-button type="success" @click="submitClick" size="mini">确认筛选</el-button>
          </el-col>
        </el-row>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" size="small" stripe
                    v-loading="tableLoading"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                    style="width: 100%;border: 1px solid #ebeef5;margin-top: 30px;">
              <el-table-column prop="cst_name" label="客户名称" ></el-table-column>
              <el-table-column prop="user_name" label="负责人" ></el-table-column>
              <el-table-column prop="cst_address" :show-overflow-tooltip="showOverflowTooltip" label="地址" width="200"></el-table-column>
              <el-table-column prop="zj_input_capacity" label="装机容量" align="center"></el-table-column>
              <el-table-column prop="zj_price" label="合同金额" align="center"></el-table-column>
              <el-table-column prop="pay_sum" label="回款金额" align="center"></el-table-column>
              <el-table-column prop="scdTime" label="开始时间" align="center" width="100"></el-table-column>
              <el-table-column prop="scd_status" label="合同状态" align="center"></el-table-column>
              <el-table-column prop="overdue" label="逾期状态" width="80" filter-placement="bottom-end" align="center">
                <template slot-scope="scope">
                  <el-tag size="mini" :type="scope.row.overdue === '正常' ? 'success' : 'danger'" disable-transitions>{{scope.row.overdue}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row.id)" type="text" size="small">详情</el-button>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </el-card>
</template>
<script>
import axios from 'axios'
import values from '../../utils/values'
export default {
  data () {
    return {
      showOverflowTooltip: true,
      teamLevel: 'all',
      teamId: 'all',
      planOwner: 'all',
      tjzqvalue: '今天',
      tdfwvalue: '全部(可见范围)',
      fuzerenvalue: '全部(可见范围)',
      teamname: '全部(可见范围)',
      teannameshow: true,
      fuzerenshow: true,
      teamoptions: [],
      teamoptionsAll: [],
      fuzerenoptions: [],
      fuzerenoptionsAll: [],
      tableLoading: false,
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
      tableData: [],
      datevalue: [],
      contractoptions: [
        {
          value: 'all',
          label: '全部(可见范围)'
        },
        {
          value: '0',
          label: '新增项目'
        },
        {
          value: '2',
          label: '合同签订'
        },
        {
          value: '3',
          label: '施工完成'
        },
        {
          value: '4',
          label: '并网完成'
        },
        {
          value: '6',
          label: '回款完成'
        },
        {
          value: '9',
          label: '项目终止'
        }
      ],
      overdueoptions: [
        {
          value: 'all',
          label: '全部(可见范围)'
        },
        {
          value: '1',
          label: '正常'
        },
        {
          value: '0',
          label: '逾期'
        }
      ],
      contractvalue: '全部(可见范围)',
      overduevalue: '全部(可见范围)',
      searchvalue: '',
      currentPage4: 1,
      totalNum: 0,
      scdStatus: 'all',
      overDueStatus: 'all',
      pagesizeNum: 10,
      pageNum: 1,
      zdydate: 'today',
      user: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesizeNum = val
      this.formlistdata()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.formlistdata()
    },
    tjzqChange (e) {
      this.datevalue = []
      this.pageNum = 1
      this.overDueStatus = 'all'
      this.overduevalue = '全部(可见范围)'
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
        })
      }
    },
    selectdateChange (e) {
      this.pageNum = 1
      this.overduevalue = '全部(可见范围)'
      this.tjzqvalue = '自定义'
      this.datevalue = e
      console.log('时间统计', this.datevalue)
    },
    tdfwChange (e) {
      this.overduevalue = '全部(可见范围)'
      this.pageNum = 1
      console.log(e)
      this.teamLevel = e
      this.teamId = 'all'
      this.overDueStatus = 'all'
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
      } else {
        this.fuzerenshow = true
        this.fuzerenvalue = '全部(可见范围)'
      }
    },
    teannameChange (e) {
      this.overduevalue = '全部(可见范围)'
      this.overDueStatus = 'all'
      this.pageNum = 1
      console.log('团队名称ID', e)
      this.teamId = e
      this.fuzerenoptions = [
        {
          name: '全部(可见范围)'
        }
      ]
      if (!e) {
        this.fuzerenshow = true
        this.teamId = 'all'
      }
      this.fuzerenvalue = this.fuzerenoptions[0].name
      this.planOwner = 'all'
      for (let i = 0; i < this.fuzerenoptionsAll.length; i++) {
        if (e === Number(this.fuzerenoptionsAll[i].team_id)) {
          this.fuzerenoptions.push(this.fuzerenoptionsAll[i])
          this.fuzerenshow = false
          console.log('进来了', this.fuzerenshow)
        }
      }
    },
    requestdata () {
      axios.get('/api/pc/select/date/' + this.zdydate).then(res => {
        if (this.datevalue.length === 0) {
          this.datevalue.push(res.beginDate, res.endDate)
        }
        console.log('不执行')
        console.log('统计周期', this.datevalue)
      })
      //      axios.get('/api/pc/select/team').then(res => {
      //        console.log('团队范围', res)
      //        res.teams.forEach(item => {
      //          this.teamoptionsAll.push(item)
      //          this.teamoptions.push(item)
      //        })
      //        res.agents.forEach(item => {
      //          this.fuzerenoptions.push(item)
      //          this.fuzerenoptionsAll.push(item)
      //        })
      //        let teamoptionsarr = []
      //        let fuzerenoptionsarr = []
      //        for (let i = 0; i < this.teamoptionsAll.length; i++) {
      //          if (this.teamLevel === 'all') {
      //            this.planOwner = 'all'
      //            this.fuzerenvalue = '全部(可见范围)'
      //            this.teamoptions.push(this.teamoptionsAll[i])
      //            this.teannameshow = true
      //            this.fuzerenshow = true
      //          }
      //          if (Number(this.teamLevel) === Number(this.teamoptionsAll[i].level)) {
      //            this.fuzerenvalue = '全部(可见范围)'
      //            this.planOwner = 'all'
      //            this.teannameshow = false
      //            this.fuzerenshow = true
      //            teamoptionsarr.push(this.teamoptionsAll[i])
      //            console.log('这里是团队范围变化', this.teamoptionsAll[i], this.teamLevel)
      //          }
      //          if (Number(this.teamId) === Number(this.fuzerenoptionsAll[i].team_id)) {
      //            fuzerenoptionsarr.push(this.fuzerenoptionsAll[i])
      //            this.fuzerenshow = false
      //            console.log('进来了', this.fuzerenshow)
      //          }
      //        }
      //        this.teamoptions = teamoptionsarr
      //        this.fuzerenoptions = fuzerenoptionsarr
      //        if (this.teamname !== '全部(可见范围)') {
      //          this.teamname = this.teamoptions[0].name
      //        }
      //        console.log('团队名称', this.teamoptions, this.teamLevel, this.teamId)
      //        console.log('负责人', this.fuzerenoptions)
      //      })
    },
    fuzerenChange (e) {
      this.overduevalue = '全部(可见范围)'
      this.pageNum = 1
      this.fuzerenID = e
      console.log('sdjkfdsjfjdsjfdjs', e)
      this.planOwner = e
      if (!e) {
        this.planOwner = 'all'
      }
    },
    contractChange (e) {
      this.pageNum = 1
      this.scdStatus = e
      console.log(this.scdStatus)
    },
    overdueChange (e) {
      this.pageNum = 1
      this.overDueStatus = e
    },
    formlistdata () {
      setTimeout(() => {
        console.log('撒打算大所大所多', this.datevalue[0])
        let parameter = {
          beginDate: this.datevalue[0],
          endDate: this.datevalue[1],
          teamLevel: String(this.teamLevel),
          teamId: String(this.teamId),
          planOwner: this.planOwner,
          scdStatus: this.scdStatus,
          overDueStatus: this.overDueStatus,
          pageNumber: this.pageNum,
          pageSize: this.pagesizeNum,
          search: this.searchvalue
        }
        this.tableLoading = true
        axios.post('/api/pc/planSchedulePc', parameter).then(res => {
          this.tableLoading = false
          this.tableData = res.content
          this.totalNum = res.totalCount
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].scdTime = this.tableData[i].scdTime.slice(0, 10)
            if (this.tableData[i].scd_status === 0) {
              this.tableData[i].scd_status = '新增项目'
            }
            if (this.tableData[i].scd_status === 1) {
              this.tableData[i].scd_status = '意向沟通'
            }
            if (this.tableData[i].scd_status === 2) {
              this.tableData[i].scd_status = '合同签定'
            }
            if (this.tableData[i].scd_status === 3) {
              this.tableData[i].scd_status = '施工完成'
            }
            if (this.tableData[i].scd_status === 4) {
              this.tableData[i].scd_status = '并网完成'
            }
            if (this.tableData[i].scd_status === 6) {
              this.tableData[i].scd_status = '回款完成'
            }
            if (this.tableData[i].scd_status === 9) {
              this.tableData[i].scd_status = '项目终止'
            }
            if (this.tableData[i].overdue === -1) {
              this.tableData[i].overdue = '逾期'
            } else {
              this.tableData[i].overdue = '正常'
            }
            console.log('', this.tableData[i].overdue)
          }
          console.log('表格数据', this.tableData, res)
        }, () => {
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      }, 500)
    },
    searchChange () {
      this.formlistdata()
    },
    handleClick (id) {
      console.log('id:')
      console.log(id)
      this.$router.push({path: '/CustomerDetails', query: {planId: id, from: 1}})
    },
    submitClick () {
      this.formlistdata()
    },
    //  判断用户是否是管理员
    //    is_userRank (callback) {
    //      let openId = this.user.openid
    //      let maxTeamRank = this.user.maxTeamRank
    //      if (maxTeamRank && maxTeamRank === 1) {
    //        console.log('高级管理员')
    //        callback(1)
    //      } else {
    //        let obj = {
    //          openId: openId
    //        }
    //        axios.post('/api/pc/user/isRank', obj).then((data) => {
    //          console.log(data)
    //          if (data && data.data && data.data.team_company_id && (data.data.team_level || data.data.team_level === 0)) {
    //            console.log('底层是管理员')
    //            callback(1)
    //          }
    //          if (!data || !data.data || !data.data.team_company_id) {
    //            // 底层也是业务员
    //            console.log('底层是业务员')
    //            callback(2)
    //          }
    //        }).catch((err) => {
    //          console.log('开始判断底层是否是管理员失败')
    //          callback(3)
    //          console.log(err)
    //        })
    //      }
    //    },
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
        if (is === 1) {
          console.log('管理员')
          that.admin()
        }
        if (is === 2) {
          console.log('业务员')
          that.staff()
        }
      })
    }
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    this.user = sessionUser
    console.log('user表', sessionUser)
    console.log('传来的参数', this.$route.query)
    if (this.$store.state.settingDetails.form === 'home') {
      // 从首页跳转
      console.log('从首页跳转过来的')
      if (this.$route.query.overDueStatus === '0') {
        console.log('逾期')
        let overdueparameter = this.$route.query
        if (Object.keys(overdueparameter).length !== 0) {
          this.overDueStatus = overdueparameter.overDueStatus
          this.tjzqvalue = '累计'
          this.overduevalue = '逾期'
          this.planOwner = overdueparameter.planOwner
          this.teamId = overdueparameter.teamId
          this.teamLevel = overdueparameter.teamLevel
          this.fuzerenvalue = overdueparameter.fuzerenvalue
          this.tdfwvalue = overdueparameter.tdfwvalue
          this.zdydate = 'total'
          this.scdStatus = String(overdueparameter.scdStatus)
          if (String(overdueparameter.scdStatus) === '3') {
            this.contractvalue = '施工完成'
          }
          if (String(overdueparameter.scdStatus) === '4') {
            this.contractvalue = '并网完成'
          }
          if (String(overdueparameter.scdStatus) === '6') {
            this.contractvalue = '回款完成'
          }

          if (overdueparameter.teamLevel === '1') {
            overdueparameter.tdfwvalue = '一级团队'
          }
          if (overdueparameter.teamLevel === '2') {
            overdueparameter.tdfwvalue = '二级团队'
          }
          if (overdueparameter.teamLevel === '3') {
            overdueparameter.tdfwvalue = '三级团队'
          }
          if (overdueparameter.teamLevel === 'one') {
            overdueparameter.tdfwvalue = '个人'
          }
          if (this.fuzerenvalue !== '全部(可见范围)') {
            this.fuzerenshow = false
          }
          if (this.teamname !== '全部(可见范围)' && this.teamname !== '个人') {
            this.teannameshow = false
          }
          //        axios.get('/api/pc/select/date/' + 'total').then(res => {
          //          this.datevalue.push(res.beginDate, res.endDate)
          //        })
        }
      } else {
        let parameter = this.$route.query
        if (Object.keys(parameter).length !== 0) {
          console.log('不是逾期')
          if (parameter.teamLevel === '1') {
            parameter.tdfwvalue = '一级团队'
          }
          if (parameter.teamLevel === '2') {
            parameter.tdfwvalue = '二级团队'
          }
          if (parameter.teamLevel === '3') {
            parameter.tdfwvalue = '三级团队'
          }
          if (parameter.teamLevel === 'one') {
            parameter.tdfwvalue = '个人'
          }
          if (String(parameter.scdStatus) === '0') {
            this.contractvalue = '新增项目'
          }
          if (String(parameter.scdStatus) === '2') {
            this.contractvalue = '合同签订'
          }
          if (String(parameter.scdStatus) === '3') {
            this.contractvalue = '施工完成'
          }
          if (String(parameter.scdStatus) === '4') {
            this.contractvalue = '并网完成'
          }
          if (String(parameter.scdStatus) === '6') {
            this.contractvalue = '回款完成'
          }
          this.tjzqvalue = parameter.tjzqvalue
          this.tdfwvalue = parameter.tdfwvalue
          this.datevalue.push(parameter.beginDate, parameter.endDate)
          this.planOwner = parameter.planOwner
          this.teamId = parameter.teamId
          this.teamLevel = parameter.teamLevel
          this.scdStatus = String(parameter.scdStatus)
          this.teamname = parameter.teamname
          if (this.fuzerenvalue !== '全部(可见范围)') {
            this.fuzerenshow = false
          }
          if (this.teamname !== '全部(可见范围)' && this.teamname !== '个人') {
            this.teannameshow = false
          }
        }
      }

      this.$store.state.settingDetails.form = ''
    } else {
      console.log('没有从首页跳转')
      //  判断是否有缓存
      if (this.$store.state.start) {
        console.log('有缓存')
      } else {
        console.log('没有缓存')
        // 执行最初加载
        this.show()
      }
    }
    this.requestdata()
    //    this.formlistdata()
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
  .el-card__body {
    padding: 20px !important;
  }
  .el-table td {
    border-right: 1px solid #ebeef5 !important;
  }
  .el-table th.is-leaf {
    border-right: 1px solid #ebeef5 !important;
  }
  .one-txt-cut{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .has-gutter>tr{
    background: #f5f8f8;
  }
</style>
