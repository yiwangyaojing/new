<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">

      <el-breadcrumb-item :to="{ path: '/Signin' }">签到统计</el-breadcrumb-item>
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
            <el-col :span="6" class="font-right">团队范围：</el-col>
            <el-col :span="18">
              <el-select @change="tdfwChange" size="small" class="fl" v-model="tdfwvalue">
                <el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
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
        <el-col :span="8" style="margin-top: 20px;margin-left: 30px;">
          <el-button type="success" @click="submitClick" size="mini">确认筛选</el-button>
            <el-button :offset="3"  @click="exportExcel" type="primary" size="mini">导出Excel</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 30px;">
        <el-table :data="tableData" size="mini" :border="true"
                  v-loading="tableLoading"
                  element-loading-text="加载中..."
                  element-loading-spinner="el-icon-loading"
                  style="width: 100%">
          <el-table-column  prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="team" label="所属团队">
          </el-table-column>
          <el-table-column prop="sign" label="签到次数" align="center">
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="gotoDetail(scope.row)" type="text" size="small" >详情</el-button>
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

    <!-- excle 导出-->
    <el-row>
      <el-col :span="24" style="margin-top: 30px;">
        <el-table :data="tableExcleList" id="outexcle"
                  v-show="false"
                  size="mini" :border="true"
                  element-loading-spinner="el-icon-loading"
                  style="width: 100%">
          <el-table-column prop="create_time" label="日期">
          </el-table-column>
          <el-table-column prop="tmName" label="所属团队">
          </el-table-column>
          <el-table-column prop="yongHu" label="成员" align="center">
          </el-table-column>
          <el-table-column prop="signNumber" label="签到次数" align="center">
          </el-table-column>
          <template v-for="index in signBigSize">
            <el-table-column v-bind:prop="'time'+(index)" v-bind:label="'签到时间'+(index)" align="center" :key="index">
            </el-table-column>
            <el-table-column v-bind:prop="'site'+(index)" v-bind:label="'签到地点'+(index)" align="center" :key="index+80">
            </el-table-column>
            <el-table-column v-bind:prop="'cst_name'+(index)" v-bind:label="'拜访客户'+(index)" align="center" :key="index+100">
            </el-table-column>
          </template>

        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import axios from 'axios'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      tableExcleList: [],
      teamLevel: 'all',
      teamId: 'all',
      planOwner: 'all',
      tjzqvalue: '今天',
      tdfwvalue: '全部(可见范围)',
      fuzerenvalue: '全部(可见范围)',
      teamname: '全部(可见范围)',
      teannameshow: true,
      tableLoading: false,
      fuzerenshow: true,
      signBigSize: 1,
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
      fuzerenoptions: [

      ],
      fuzerenoptionsAll: [],
      datevalue: [],
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
      tableData: [],
      totalNum: 0,
      pagesizeNum: 10,
      currentPage4: 0,
      pageNum: 1
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesizeNum = val
      this.statisticaldata()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.statisticaldata()
    },
    tjzqChange (e) {
      this.datevalue = []
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
        })
      } else {
        axios.get('/api/pc/select/date/today').then(res => {
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
      this.tableSign()
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
      } else {
        this.fuzerenshow = true
        this.fuzerenvalue = '全部(可见范围)'
      }
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
    },
    fuzerenChange (e) {
      this.fuzerenID = e
      console.log('sdjkfdsjfjdsjfdjs', e)
      this.planOwner = e
      if (!e) {
        this.planOwner = 'all'
      }
    },
    statisticaldata () {
      let req = {
        // 开始时间 - 结束时间
        beginDate: this.datevalue[0],
        endDate: this.datevalue[1],
        teamLevel: String(this.teamLevel),
        teamId: String(this.teamId),
        owner: this.planOwner,
        pageNumber: this.pageNum,
        pageSize: this.pagesizeNum
      }
      this.tableLoading = true
      axios.post('/api/pc/signPc', req).then(res => {
        console.log('这里是查询签到结果===>>', res)
        this.tableLoading = false
        this.tableData = res.content
        this.totalNum = res.totalCount
      }, () => {
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    requestdata (fn) {
      axios.get('/api/pc/select/date/' + 'today').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
        this.tableSign()
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
          if (fn) {
            fn()
          }
        })
      })
    },
    gotoDetail (row) {
      console.log('这里是跳转到详情===>>', row)
      this.$router.push({path: '/SigninDetails',
        query: {
          teamname: row.team,
          openid: row.openid,
          name: row.name,
          tjzqvalue: this.tjzqvalue,
          datevalue: this.datevalue,
          tdfwvalue: this.tdfwvalue,
          fuzerenshow: this.fuzerenshow
        }})
    },
    submitClick () {
      this.statisticaldata()
      this.tableSign()
    },
    // 导出excle
    exportExcel () {
      if (this.tableExcleList.length < 1) {
        this.$message({
          message: '无签到信息，重新选择条件并确认',
          type: 'warning'
        })
        return
      }
      console.log('导出之前==========')
      var wb = XLSX.utils.table_to_book(document.querySelector('#outexcle'))
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '签到详情.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // 获取导出签到详情的表格数据
    tableSign () {
      this.show1 = true
      let req = {
        // 开始时间 - 结束时间
        beginDate: this.datevalue[0],
        endDate: this.datevalue[1],
        teamLevel: String(this.teamLevel),
        teamId: String(this.teamId),
        owner: this.planOwner,
        pageNumber: this.pageNum,
        pageSize: this.pagesizeNum
      }
      console.log('开始时间======>>>>', req.beginDate, req.endDate)
      axios.post('/api/teamUser/excleExport', req).then(resp => {
        this.tableExcleList = []
        console.log('导出数据', resp)
        for (let i = 0; i < resp.length; i++) {
          let signs = resp[i].sign
          let signsSize = signs.length
          let tableExcel = {}
          tableExcel.yongHu = resp[i].yongHu // 成员
          tableExcel.create_time = resp[i].create_time // 日期
          tableExcel.signNumber = signsSize // 签到次数
          tableExcel.tmName = ''
          let tmNames = new Set()
          if (this.signBigSize < signsSize) {
            this.signBigSize = signsSize
          }
          for (let j = 0; j < signsSize; j++) {
            tmNames.add(signs[j].tmName) // 所属团队
            tableExcel['time' + (j + 1)] = signs[j].create_time // 签到时间
            tableExcel['site' + (j + 1)] = signs[j].site // 签到地点
            tableExcel['cst_name' + (j + 1)] = signs[j].cst_name // 拜访客户
          }
          console.log(tmNames)
          for (let tmName of tmNames) { // 遍历Array
            if (tmName == null) {
              continue
            }
            tableExcel.tmName = tableExcel.tmName + tmName + ','
          }
          this.tableExcleList.push(tableExcel)
        }
        console.log('转换后数组======》', this.tableExcleList)
      })
    }
  },
  mounted () {
    this.requestdata(this.statisticaldata)
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
