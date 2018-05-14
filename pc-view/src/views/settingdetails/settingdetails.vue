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
              <el-select size="small" class="fl" v-model="fuzerenvalue" :disabled="fuzerenshow">
                <el-option v-for="(item, index) in fuzerenoptions" :key="index" :label="item.name" :value="item.openid">
                </el-option>
              </el-select>
            </el-col>
          </div>
          <div style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">合同状态</div>
              <el-select size="small" class="fl" v-model="contractvalue" placeholder="请选择">
                <el-option v-for="item in contractoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;;width: 100px;">逾期状态</div>
              <el-select size="small" class="fl" v-model="overduevalue" placeholder="请选择">
                <el-option v-for="item in overdueoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </div>
        </div>
        <el-col :span="12" class="y-Center" style="margin-top: 20px;">
          <el-col :span="2"><div style="font-size: 16px;">搜索</div></el-col>
          <el-col :span="20">
            <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchvalue">
            </el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" size="mini" stripe style="width: 100%;border: 1px solid #ebeef5;margin-top: 30px;">
              <el-table-column fixed prop="date" label="客户" ></el-table-column>
              <el-table-column prop="name" label="负责人" ></el-table-column>
              <el-table-column prop="address" :show-overflow-tooltip="showOverflowTooltip" label="地址" width="200"></el-table-column>
              <el-table-column prop="city" label="装机容量" ></el-table-column>
              <el-table-column prop="zip" label="合同金额" ></el-table-column>
              <el-table-column prop="zip" label="回款金额" ></el-table-column>
              <el-table-column prop="date" label="开始时间"></el-table-column>
              <el-table-column prop="zip" label="合同状态"></el-table-column>
              <el-table-column prop="tag" label="逾期状态" width="100" filter-placement="bottom-end">
                <template slot-scope="scope">
                  <el-tag size="mini" :type="scope.row.tag === '正常' ? 'success' : 'danger'" disable-transitions>{{scope.row.tag}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <router-link to="/customerdetails" type="text">详情</router-link>
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
        :total="tableData.length">
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

      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄asdfasdfasdfasdfasdfasdfsaf',
        zip: 200333,
        tag: '正常'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄asdfasdfasdfasdfasdfasdfsaf',
        zip: 200333,
        tag: '逾期'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        tag: '正常'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        tag: '逾期'
      }],
      datevalue: [

      ],

      contractoptions: [
        {
          value: '选项1',
          label: '合同签订'
        },
        {
          value: '选项2',
          label: '施工完成'
        },
        {
          value: '选项3',
          label: '并网完成'
        },
        {
          value: '选项4',
          label: '回款完成'
        }
      ],
      overdueoptions: [
        {
          value: '选项1',
          label: '全部'
        },
        {
          value: '选项2',
          label: '正常'
        },
        {
          value: '选项3',
          label: '逾期'
        }
      ],

      contractvalue: '',
      overduevalue: '',
      searchvalue: '',
      currentPage4: 1
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    tjzqChange (e) {
      this.datevalue = []
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
        })
      }
    },
    selectdateChange (e) {
      this.tjzqvalue = '自定义'
      this.datevalue = e
      console.log('时间统计', this.datevalue)
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
          this.teamoptions.push(this.teamoptionsAll[i])
          this.teannameshow = true
          this.fuzerenshow = true
        }
        if (e === Number(this.teamoptionsAll[i].level)) {
          this.teannameshow = false
          this.fuzerenshow = true
          this.teamoptions.push(this.teamoptionsAll[i])
          console.log('这里是团队范围变化=====', this.teamoptionsAll[i])
        }
        this.teamname = this.teamoptions[0].name
      }
      if (e === 'one') {
        this.teannameshow = true
        this.planOwner = 'one'
        this.teamoptions = [
          {
            name: '个人',
            id: 'one'
          }
        ]
        this.fuzerenoptions = [
          {
            name: '全部(可见范围)'
          }
        ]
        this.teamname = this.teamoptions[0].name
        for (let i = 0; i < this.fuzerenoptionsAll.length; i++) {
          if (String(e) === String(this.fuzerenoptionsAll[i].team_id)) {
            this.fuzerenoptions.push(this.fuzerenoptionsAll[i])
            this.fuzerenshow = false
            console.log('进来了', this.fuzerenshow)
          }
        }
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
    requestdata () {
      axios.get('/api/select/date/' + 'today').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
      })
      axios.get('/api/select/team').then(res => {
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
    }
  },
  mounted () {
    this.requestdata()
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    console.log('user表', sessionUser)
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
