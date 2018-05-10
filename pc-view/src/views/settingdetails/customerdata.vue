<template>
  <el-card class="box-card">
    <el-row>
      <!--<div class="y-Center clearfix">-->
      <!--<div class="fl"><img style="width: 50px;height: 50px;border-radius: 50%;" src="/static/img/00_logo_xiaosolar.png"/></div>-->
      <!--<div class="fl" style="margin-left: 10px;font-size: 18px;">董忽悠团队</div>-->
      <!--</div>-->
      <div>
        <div :span="24" style="margin-top: 20px;" class="clearfix">
          <el-col :span="8" class="y-Center">
            <div class="fl" style="font-size: 14px;margin-right: 20px;">统计周期</div>
            <el-select size="small" class="fl" v-model="tjzqvalue" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="16" class="y-Center">
            <div class="grid-content bg-purple" style="font-size: 14px;width: 100px;">自定义时间段</div>
            <div class="block">
              <el-date-picker size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
          <el-table-column fixed prop="customerName" label="客户名称">
          </el-table-column>
          <el-table-column prop="name" label="负责人">
          </el-table-column>
          <el-table-column prop="address" show-overflow-tooltip label="地址" width="200">
          </el-table-column>
          <el-table-column prop="city" label="装机容量" >
          </el-table-column>
          <el-table-column prop="zip" label="拍房子">
          </el-table-column>
          <el-table-column prop="zip" label="收资料" >
          </el-table-column>
          <el-table-column prop="zip" label="排版子" >
          </el-table-column>
          <el-table-column prop="date" label="添加时间" >
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <router-link to="/customerdetails" type="text">详情</router-link>
              <!--<el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>-->
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
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        customerName: '董志永',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        customerName: '董志永',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        customerName: '董志永',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        customerName: '董志永',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }],
      options: [{
        value: '选项1',
        label: '今天'
      }, {
        value: '选项2',
        label: '昨天'
      }, {
        value: '选项3',
        label: '本周'
      }, {
        value: '选项4',
        label: '上周'
      }, {
        value: '选项5',
        label: '本月'
      }, {
        value: '选项6',
        label: '上月'
      }, {
        value: '选项7',
        label: '本年'
      }, {
        value: '选项8',
        label: '累计'
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
      tjzqvalue: '',
      datevalue: '',
      tdfwvalue: '',
      fuzerenvalue: '',
      contractvalue: '',
      overduevalue: '',
      searchvalue: '',
      currentPage4: 1
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
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
</style>
