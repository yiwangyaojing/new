<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Signin' }">签到统计</el-breadcrumb-item>
      <el-breadcrumb-item><a>签到详情</a></el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <br>
    <div style="font-size: 14px;">{{name}}</div>
    <div style="margin-top: 20px;font-size: 14px;">{{team}}</div>
    <el-row>
      <div :span="24" style="margin-top: 20px;" class="clearfix">
        <el-col :span="8" class="y-Center">
          <div class="fl" style="font-size: 14px;margin-right: 20px;">统计周期</div>
          <el-select size="small" class="fl" v-model="tjzqvalue" @change="tjzqChange" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="16" class="y-Center">
          <div class="grid-content bg-purple" style="font-size: 14px;width: 100px;">自定义时间段</div>
          <div class="block">
            <el-date-picker unlink-panels size="small" @change="dateChange" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-col>
      </div>
    </el-row>
    <div style="margin-top: 20px;font-size: 14px;">签到统计</div>
    <el-row>
      <el-col :span="24" style="margin-top: 30px;">
        <el-col :span="14">
          <el-col :span="23">
            <el-table :data="tableData" stripe border size="mini"
                      v-loading="tableLoading"
                      element-loading-text="加载中..."
                      element-loading-spinner="el-icon-loading"
                      style="width: 100%">
              <el-table-column prop="createTime" :formatter="finishFormat" label="时间" width="180">
              </el-table-column>
              <el-table-column prop="site" :show-overflow-tooltip="true" label="地点" width="180">
              </el-table-column>
              <el-table-column prop="cst_name" label="客户">
              </el-table-column>
              <el-table-column prop="remarks" label="备注">
              </el-table-column>
            </el-table>
            <el-pagination style="margin-top: 20px;"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage4"
                           :page-sizes="[10, 20, 30, 40,50]"
                           :page-size="100"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totalNum">
            </el-pagination>
          </el-col>
        </el-col>
        <el-col :span="9">
          <div class="amap-wrapper">
            <el-amap class="amap-box" :vid="'amap-vue'" :zoom="zoom" :center="center">
              <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
            </el-amap>
          </div>
          <!--<img style="width: 480px;" src="/static/img/sky.871d198.jpg" alt="">-->
        </el-col>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import axios from 'axios'
import dateFormat from 'dateformat'
export default {
  data () {
    return {
      tableLoading: false,
      name: '',
      team: '',
      openid: '',
      tjzqvalue: '今天',
      datevalue: [],
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
      totalNum: 0,
      pagesizeNum: 10,
      currentPage4: 0,
      pageNum: 1,
      tableData: [],
      zoom: 16,
      markers: [],
      center: [116.38, 39.9]
    }
  },
  methods: {
    finishFormat (row, column, cellValue, index) {
      console.log('44444444',cellValue)
      return  dateFormat(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    tjzqChange (e) {
      console.log('=====>>', e)
      this.tjzqvalue = e
      this.datevalue = []
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
          this.loadData()
        })
      } else {
        let params = this.$route.query
        if (params.datevalue && params.datevalue.length > 1) {
          this.datevalue.push(params.datevalue[0], params.datevalue[1])
          this.loadData()
        } else {
          axios.get('/api/pc/select/date/today').then(res => {
            console.log(res)
            for (let i in res) {
              this.datevalue.push(res[i])
            }
            this.loadData()
          })
        }
      }
    },
    dateChange () {
      this.loadData()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesizeNum = val
      this.loadData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.loadData()
    },
    requestdata (fn) {
      axios.get('/api/pc/select/date/' + 'today').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
        if (fn) {
          fn()
        }
      })
    },
    loadData () {
      let req = {
        // 开始时间 - 结束时间
        beginDate: this.datevalue[0],
        endDate: this.datevalue[1],
        owner: this.openid,
        pageNumber: this.pageNum,
        pageSize: this.pagesizeNum
      }
      this.tableLoading = true
      axios.post('/api/pc/signPc/detail', req).then(res => {
        console.log('这里是查询结果===>>', res)
        this.tableLoading = false
        this.tableData = res.content
        this.totalNum = res.totalCount
        res.content.forEach(item => {
          this.markers.push({
            position: [item.longitude, item.latitude],
            visible: true,
            draggable: false
          })
          this.center = [item.longitude, item.latitude]
        })
      }, () => {
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    }
  },
  mounted () {
    let params = this.$route.query
    this.openid = params.openid
    this.team = params.teamname
    this.name = params.name
    console.log('这里是===》》', params)
    this.tjzqChange(params.tjzqvalue)
    // this.requestdata(this.loadData)
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
  .amap-wrapper {
    width: 500px;
    height: 300px;
  }
</style>
