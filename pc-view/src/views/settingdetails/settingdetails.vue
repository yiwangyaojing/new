<template>
    <el-card class="box-card">
      <el-row>
        <div>
          <div :span="24" style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">统计周期</div>
              <el-select @change="tjzqChange" class="fl" v-model="tjzqvalue" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16" class="y-Center">
              <div class="grid-content bg-purple" style="font-size: 14px;;width: 100px;">自定义时间段</div>
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
              <el-select size="small" class="fl" v-model="fuzerenvalue" @change="fuzerenChange" :disabled="fuzerenshow">
                <el-option v-for="(item, index) in fuzerenoptions" :key="index" :label="item.name" :value="item.openid">
                </el-option>
              </el-select>
            </el-col>
          </div>
          <div style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">合同状态</div>
              <el-select size="small" class="fl" @change="contractChange" v-model="contractvalue" placeholder="请选择">
                <el-option v-for="item in contractoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;;width: 100px;">逾期状态</div>
              <el-select size="small" class="fl" @change="overdueChange" v-model="overduevalue" placeholder="请选择">
                <el-option v-for="item in overdueoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </div>
        </div>
        <el-col :span="12" class="y-Center" style="margin-top: 20px;">
          <el-col :span="2"><div style="font-size: 16px;">搜索</div></el-col>
          <el-col :span="20">
            <el-input size="small" @input="searchChange" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchvalue">
            </el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" size="small" stripe style="width: 100%;border: 1px solid #ebeef5;margin-top: 30px;">
              <el-table-column prop="cst_name" label="客户" ></el-table-column>
              <el-table-column prop="user_name" label="负责人" ></el-table-column>
              <el-table-column prop="cst_address" :show-overflow-tooltip="showOverflowTooltip" label="地址" width="200"></el-table-column>
              <el-table-column prop="zj_input_capacity" label="装机容量" ></el-table-column>
              <el-table-column prop="zj_price" label="合同金额" ></el-table-column>
              <el-table-column prop="pay_sum" label="回款金额" ></el-table-column>
              <el-table-column prop="scdTime" label="开始时间"></el-table-column>
              <el-table-column prop="scd_status" label="合同状态"></el-table-column>
              <el-table-column prop="overdue" label="逾期状态" width="100" filter-placement="bottom-end">
                <template slot-scope="scope">
                  <el-tag size="mini" :type="scope.row.overdue === '正常' ? 'success' : 'danger'" disable-transitions>{{scope.row.overdue}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="short_url" label="下载提取码"></el-table-column>
              <el-table-column fixed="right" label="操作">
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
      pageNum: 1
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
      this.formlistdata()
    },
    selectdateChange (e) {
      this.pageNum = 1
      this.overduevalue = '全部(可见范围)'
      this.tjzqvalue = '自定义'
      this.datevalue = e
      console.log('时间统计', this.datevalue)
      this.formlistdata()
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
      }
      this.formlistdata()
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
      this.formlistdata()
    },
    requestdata () {
      axios.get('/api/pc/select/date/' + 'today').then(res => {
        if (this.datevalue.length === 0) {
          this.datevalue.push(res.beginDate, res.endDate)
        }
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
        let teamoptionsarr = []
        let fuzerenoptionsarr = []
        for (let i = 0; i < this.teamoptionsAll.length; i++) {
          if (this.teamLevel === 'all') {
            this.planOwner = 'all'
            this.fuzerenvalue = '全部(可见范围)'
            this.teamoptions.push(this.teamoptionsAll[i])
            this.teannameshow = true
            this.fuzerenshow = true
          }
          if (Number(this.teamLevel) === Number(this.teamoptionsAll[i].level)) {
            this.fuzerenvalue = '全部(可见范围)'
            this.planOwner = 'all'
            this.teannameshow = false
            this.fuzerenshow = true
            teamoptionsarr.push(this.teamoptionsAll[i])
            console.log('这里是团队范围变化', this.teamoptionsAll[i], this.teamLevel)
          }
          if (Number(this.teamId) === Number(this.fuzerenoptionsAll[i].team_id)) {
            fuzerenoptionsarr.push(this.fuzerenoptionsAll[i])
            this.fuzerenshow = false
            console.log('进来了', this.fuzerenshow)
          }
        }
        this.teamoptions = teamoptionsarr
        this.fuzerenoptions = fuzerenoptionsarr
        if (this.teamname !== '全部(可见范围)') {
          this.teamname = this.teamoptions[0].name
        }
        console.log('团队名称', this.teamoptions, this.teamLevel, this.teamId)
        console.log('负责人', this.fuzerenoptions)
      })
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
      this.formlistdata()
    },
    contractChange (e) {
      this.pageNum = 1
      this.scdStatus = e
      console.log(this.scdStatus)
      this.formlistdata()
    },
    overdueChange (e) {
      this.pageNum = 1
      this.overDueStatus = e
      this.formlistdata()
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
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)'
        })
        axios.post('/api/pc/planSchedulePc', parameter).then(res => {
          loading.close()
          this.tableData = res.content
          this.totalNum = res.totalCount
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].scdTime = this.tableData[i].scdTime.slice(0, 10)
            if (this.tableData[i].scd_status === 0) {
              this.tableData[i].scd_status = '新增项目'
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
            if (this.tableData[i].overdue === -1) {
              this.tableData[i].overdue = '逾期'
            } else {
              this.tableData[i].overdue = '正常'
            }
            console.log('', this.tableData[i].overdue)
          }
          console.log('表格数据', this.tableData, res)
        }, () => {
          loading.close()
        }).catch(() => {
          loading.close()
        })
      }, 500)
    },
    searchChange () {
      this.formlistdata()
    },
    handleClick (id) {
      console.log('id:')
      console.log(id)
      this.$router.push({path: '/CustomerDetails', query: {planId: id}})
    }
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    console.log('user表', sessionUser)
    console.log('传来的参数', this.$route.query)
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
        this.scdStatus = 'all'
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
        axios.get('/api/pc/select/date/' + 'total').then(res => {
          this.datevalue.push(res.beginDate, res.endDate)
        })
      }
    } else {
      let parameter = this.$route.query

      if (Object.keys(parameter).length !== 0) {
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
        if(String(parameter.scdStatus) === '0') {
          this.contractvalue = '新增项目'
        }
        if(String(parameter.scdStatus) === '2') {
          this.contractvalue = '合同签订'
        }
        if(String(parameter.scdStatus) === '3') {
          this.contractvalue = '施工完成'
        }
        if(String(parameter.scdStatus) === '4') {
          this.contractvalue = '并网完成'
        }
        if(String(parameter.scdStatus) === '6') {
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
    this.requestdata()
    this.formlistdata()
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
