<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div>
    <el-row class="breadcrumb">
      <h2>用户查询</h2>
      <p>查询系统登陆用户数据</p>
    </el-row>
    <br/>
    <el-card>
      <el-row type="flex" justify="start" :gutter="8" class="warp">
        <el-col><el-button size="small" round icon="el-icon-circle-plus-outline">创建用户</el-button></el-col>
        <el-col><el-button size="small" round icon="el-icon-edit">编辑</el-button></el-col>
        <el-col><el-button size="small" round icon="el-icon-delete">删除</el-button></el-col>
        <el-col><el-button size="small" round icon="el-icon-more-outline"></el-button></el-col>
        <el-col class="flex-1"></el-col>
        <el-col>
          <el-popover ref="find" placement="bottom-end" width="500" v-model="find.show">
            <el-input slot="reference" placeholder="请输入关键字" class="round" size="small" prefix-icon="el-icon-search" v-model="params.keywords"></el-input>
            <br/>
            <el-form ref="form" size="small" :model="params" label-width="80px">
              <el-form-item label="活动名称">
                <el-input size="small" v-model="params.name"></el-input>
              </el-form-item>
              <el-form-item label="活动区域">
                <el-select size="small" v-model="params.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-col :span="11">
                  <el-date-picker size="small" type="date" placeholder="选择日期" v-model="params.startDate" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-time-picker size="small" type="fixed-time" placeholder="选择时间" v-model="params.endDate" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="即时配送">
                <el-switch v-model="params.delivery"></el-switch>
              </el-form-item>
              <el-form-item label="特殊资源">
                <el-radio-group v-model="params.resource">
                  <el-radio label="线上品牌商赞助"></el-radio>
                  <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="活动形式">
                <el-input size="small" type="textarea" v-model="params.desc"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                <el-button size="small" @click="find.show = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-popover>

        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-table size="medium" :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit"></el-button>
              <el-button type="text" size="small" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="page" type="flex" justify="end">
        <el-pagination
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>
<script>

export default {
  data () {
    return {
      params: {
        keywords: '',
        name: '',
        region: '',
        startDate: '',
        endDate: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      find: {
        show: false
      },
      tableData: [
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-04', name: '王小虎', address: '上海市普陀区金沙江路 1517 弄' },
        { date: '2016-05-01', name: '王小虎', address: '上海市普陀区金沙江路 1519 弄' },
        { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1516 弄' }
      ]
    }
  },
  methods: {
    onSearch: function () {

    }
  },
  computed: {}
}
</script>

<style scoped>

  .breadcrumb {
    border-bottom: solid 1px #EDF2FC;
    margin: 0px -20px;
    line-height: 24px;
    padding: 0px 20px 17px 20px;
  }
  .el-card {
    box-shadow: 0 2px 50px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border: 0px;
  }
  .round.el-input >>> .el-input__inner {
    border-radius: 20px;
  }

  .page {
    margin-top: 12px;
  }

</style>
