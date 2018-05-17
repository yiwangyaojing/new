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
      <el-col :span="18" class="y-Center" style="margin-top: 20px;">
        <el-col :span="2"><div style="font-size: 16px;">搜索</div></el-col>
        <el-col :span="22">
          <el-input size="small" @input="searchChange" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchvalue">
          </el-input>
        </el-col>
      </el-col>
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
          <el-table-column :formatter="finishFormat" prop="h_is_finish" label="项目勘测" align="center"></el-table-column>
          <el-table-column :formatter="finishFormat" prop="d_is_finish" label="资料收集" align="center"></el-table-column>
          <el-table-column :formatter="finishFormat" prop="rf_is_finish" label="方案设计" align="center"></el-table-column>
          <el-table-column prop="short_url" label="提取码" width="70" align="center"></el-table-column>
          <el-table-column prop="scdTime" label="添加时间" width="100" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100"  align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.id)" type="text" size="small" >详情</el-button>
              <el-button :disabled="scope.row.h_is_finish == 0 && scope.row.d_is_finish == 0" type="text" @click="downLoadData()" size="small">下载</el-button>
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
      disabled: true,
      showOverflowTooltip: true,
      tableLoading: false,
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
    finishFormat (row, column, cellValue, index) {
      return cellValue === 0 ? '否' : '是'
    },
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
    tjzqChange (e, isExcute) {
      this.datevalue = []
      this.pageNum = 1
      this.tjzqvalue = e
      console.log('这里是时间范围变化===>>', e, this.tjzqvalue)
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
          if (!isExcute) {
            this.formlistdata()
          }
        })
      } else {
        if (!isExcute) {
          this.formlistdata()
        }
      }
    },
    selectdateChange (e) {
      this.pageNum = 1
      this.tjzqvalue = '自定义'
      this.datevalue = e
      console.log('时间统计', this.datevalue)
      this.formlistdata()
    },
    tdfwChange (e, openid, fn) {
      this.pageNum = 1
      console.log('团队范围变化', e)
      this.teamLevel = e
      this.tdfwvalue = e
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

      if (openid) {
        if (fn) {
          this.fuzerenChange(openid, fn)
        } else {
          this.fuzerenChange(openid)
        }
      } else {
        this.formlistdata()
      }
    },
    teannameChange (e) {
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
    requestdata (fn, voidGetDate, openid) {
      if (!voidGetDate) {
        if (openid) {
          this.getDateData(fn, openid)
        } else {
          this.getDateData(fn)
        }
      } else {
        if (openid) {
          this.getTeamData(fn, openid)
        } else {
          this.getTeamData(fn)
        }
      }
    },
    getDateData (fn, openid) {
      axios.get('/api/pc/select/date/' + 'today').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
        this.getTeamData(fn, openid)
      })
    },
    getTeamData (fn, openid) {
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
        if (openid) {
          this.tdfwChange('one', openid, fn)
        } else {
          if (fn) {
            fn()
          }
        }
      })
    },
    fuzerenChange (e, fn) {
      this.pageNum = 1
      this.fuzerenID = e
      console.log('sdjkfdsjfjdsjfdjs', e)
      this.planOwner = e
      if (!e) {
        this.planOwner = 'all'
      }
      if (fn) {
        fn()
      } else {
        this.formlistdata()
      }
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
      this.tableLoading = true
      setTimeout(() => {
        console.log('客户资料列表', this.datevalue[0])
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
          search: this.searchvalue,
          type: 'customer'
        }
        axios.post('/api/pc/planSchedulePc', parameter).then(res => {
          this.tableLoading = false
          this.tableData = res.content
          console.log('表格数据11111111111111111111', this.tableData)
          this.totalNum = res.totalCount
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].scdTime = this.tableData[i].scdTime.slice(0, 10)
          }
          console.log('表格数据11111111111111111111', this.tableData, res)
        }, () => {
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      }, 300)
    },
    searchChange () {
      this.formlistdata()
    },
    handleClick (id) {
      console.log('id:')
      console.log(id)
      this.$router.push({path: '/CustomerDetails', query: {planId: id}})
    },
    downLoadData () {
      let shortUrl = this.tableData.short_url
      if (!shortUrl) {
        this.$message.error('下载提取码自动获取失败！手动填写')
        this.$router.push({path: '/download', query: {shortUrl: ''}})
      }
      this.$router.push({path: '/download', query: {shortUrl: shortUrl}})
    }
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    console.log('user表', sessionUser)
    let params = this.$route.query
    console.log('这里是传过来的负责人===>>', params)
    if (Object.keys(params).length !== 0) {
      this.requestdata(this.tjzqChange('total', false), true, params.openid)
    } else {
      this.requestdata(this.formlistdata)
    }
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
