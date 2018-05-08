<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24">
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">统计周期</el-col>
          <el-select size="small" class="fl" v-model="value" placeholder="请选择">
            <el-option v-for="item in cycleoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">自定义时间段</el-col>
          <el-date-picker size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-col>
      <el-col :span="24" style="margin-top: 30px;">
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">团队范围</el-col>
          <el-select class="fl" size="small" v-model="value" placeholder="请选择">
            <el-option v-for="item in teamoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">人员</el-col>
          <el-select class="fl" size="small" v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 30px;">
        <el-table :data="tableData" size="mini" border="true" style="width: 100%">
          <el-table-column  prop="date" label="姓名">
          </el-table-column>
          <el-table-column prop="name" label="所属团队">
          </el-table-column>
          <el-table-column prop="province" label="签到次数">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <router-link to="/signindetails" @click="handleClick(scope.row)" type="text" size="small">详情</router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      datevalue: '',
      cycleoptions: [
        {
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
        }
      ],
      teamoptions: [
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
      tableData: [{
        date: '董志永团队',
        name: '王小虎',
        address: '2'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {

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
