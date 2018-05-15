<template>
  <el-card class="box-card">
    <el-row>
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
            <el-date-picker @change="selectdateChange" value-format="yyyy-MM-dd" size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 30px;">
        <el-table :data="tableData" size="mini" :border="true" style="width: 100%">
          <el-table-column  prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="team" label="所属团队">
          </el-table-column>
          <el-table-column prop="sign" label="签到次数">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="gotoDetail(scope.row)" type="text" size="small">详情</a>
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
export default {
  data () {
    return {
      teamLevel: 'all',
      teamId: 'all',
      planOwner: 'all',
      tjzqvalue: '今天',
      tdfwvalue: '全部(可见范围)',
      fuzerenvalue: '全部(可见范围)',
      teamname: '全部(可见范围)',
      teannameshow: true,
      fuzerenshow: true,
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
      axios.post('/api/pc/signPc', req).then(res => {
        console.log('这里是查询签到结果===>>', res)
        this.tableData = res.content
        this.totalNum = res.totalCount
      })
    },
    requestdata (fn) {
      axios.get('/api/pc/select/date/' + 'today').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
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
      this.$router.push({path: '/SigninDetails', query: {teamname: row.team, openid: row.openid, name: row.name}})
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
