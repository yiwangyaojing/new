<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: 18px;">签到统计</span>
    </div>
    <el-row>
      <el-col :span="24">
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">统计周期</el-col>
          <el-select class="fl" v-model="value" placeholder="请选择">
            <el-option v-for="item in cycleoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">自定义时间段</el-col>
          <el-date-picker v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-col>
      <el-col :span="24" style="margin-top: 30px;">
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">团队范围</el-col>
          <el-select class="fl" v-model="value" placeholder="请选择">
            <el-option v-for="item in teamoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10" class="y-Center">
          <el-col :span="4" class="fl">人员</el-col>
          <el-select class="fl" v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="date" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="province" label="省份" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
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
      ]
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
