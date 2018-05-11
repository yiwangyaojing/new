<template>
  <el-card class="box-card">
    <el-row>
      <!--<div class="y-Center clearfix">-->
      <!--<div class="fl"><img style="width: 50px;height: 50px;border-radius: 50%;" src="/static/img/00_logo_xiaosolar.png"/></div>-->
      <!--<div class="fl" style="margin-left: 10px;font-size: 18px;">董忽悠团队</div>-->
      <!--</div>-->
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
              <el-date-picker @change="selectdateChange" value-format="yyyy-MM-dd" size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-col>
        </div>
        <div style="margin-top: 20px;" class="clearfix">
          <el-col :span="8" class="y-Center">
            <div class="fl" style="font-size: 14px;margin-right: 20px;">团队范围</div>
            <el-select size="small" class="fl" v-model="tdfwvalue" placeholder="请选择">
              <el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8" class="y-Center">
            <div class="fl" style="font-size: 14px;;width: 100px;">负责人</div>
            <el-select size="small" class="fl" v-model="fuzerenvalue" placeholder="请选择">
              <el-option v-for="item in fuzerenoptions" :key="item.value" :label="item.label" :value="item.value">
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
        <el-col :span="2"><div style="font-size: 14px;">搜索</div></el-col>
        <el-col :span="20">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search">
          </el-input>
        </el-col>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;">
      <el-col :span="24">
        <el-table :data="tableData" size="mini" border style="width: 100%" stripe>
          <el-table-column fixed prop="cst_name" label="客户名称">
          </el-table-column>
          <el-table-column prop="user_name" label="负责人">
          </el-table-column>
          <el-table-column prop="cst_address" show-overflow-tooltip label="地址" width="200">
          </el-table-column>
          <el-table-column prop="zj_capacity" label="装机容量" >
          </el-table-column>
          <el-table-column prop="h_is_finish" label="拍房子">
          </el-table-column>
          <el-table-column prop="d_is_finish" label="收资料" >
          </el-table-column>
          <el-table-column prop="rf_is_finish" label="排版子" >
          </el-table-column>
          <el-table-column prop="created_at" label="添加时间" >
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <!--<router-link to="/customerdetails" type="text">详情</router-link>-->
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">详情</el-button>
              <el-button type="text" size="small">下载</el-button>
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
export default {
  data () {
    return {
      tableData: [],
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
          value: '选项1',
          label: '全部'
        },
        {
          value: '选项2',
          label: '总团队'
        },
        {
          value: '选项3',
          label: '子团队1'
        },
        {
          value: '选项4',
          label: '子团队2'
        },
        {
          value: '选项5',
          label: '子团队3'
        }
      ],
      contractoptions: [
        {
          value: '选项11',
          label: '全部'
        },
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
      fuzerenoptions: [],
      tjzqvalue: '2018-01-01',
      datevalue: ['2018-01-01', '2018-05-09'],
      tdfwvalue: '',
      fuzerenvalue: '',
      contractvalue: '',
      overduevalue: '',
      searchvalue: '',
      currentPage4: 1,
      cs: {
        tjzqvalue: '2018-01-01',
        datevalue: ['2018-01-01', '2018-05-09'],
        tdfwvalue: '',
        fuzerenvalue: '',
        contractvalue: '',
        overduevalue: '',
        searchvalue: ''
      }
    }
  },
  methods: {
    handleClick (id) {
      console.log('id:')
      console.log(id)
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
    selectdateChange () {
      this.tjzqvalue = '自定义'
    },
    requestdata () {
      axios.get('/api/select/date/' + 'today').then(res => {
        console.log(res)
        this.datevalue.push(res.beginDate, res.endDate)
      })
    },
    handleSizeChange () {
    },
    handleCurrentChange () {
    },
    initPlan () {
      axios.post('/api/customerDataPc/customerList', this.cs).then(res => {
        console.log('列表数据', res)
        this.tableData = res
        console.log('tabdata', this.tableData)
      })
    }

  },
  mounted () {
    this.initPlan()
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
