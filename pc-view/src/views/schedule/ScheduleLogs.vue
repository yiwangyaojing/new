<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div>
    <el-row class="breadcrumb warp" type="flex" align="middle">
      <el-col>
        <h2>执行日志</h2>
        <p>查询定时任务执行日志。</p>
      </el-col>
      <el-col class="flex-1"></el-col>
      <el-col><el-input placeholder="请输入关键字" class="text" size="small" prefix-icon="el-icon-search" v-model="params.keywords"></el-input></el-col>
    </el-row>

    <el-card class="main">
      <el-row type="flex" justify="start" align="middle" :gutter="8" class="warp">
        <el-col><el-button type="text">日志列表</el-button></el-col>
        <el-col class="flex-1"></el-col>
        <el-col>
          <el-popover ref="views.filter" placement="bottom-end" width="500" v-model="views.filter.show">
            <el-button size="small" slot="reference">过滤<i class="el-icon-vueboot-filter el-icon--right"/></el-button>
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
                <el-row type="flex" class="warp" :gutter="5">
                  <el-col class="flex-1">
                    <el-date-picker size="small" type="date" placeholder="选择日期" v-model="params.startDate" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line">-</el-col>
                  <el-col class="flex-1">
                    <el-time-picker size="small" type="fixed-time" placeholder="选择时间" v-model="params.endDate" style="width: 100%;"></el-time-picker>
                  </el-col>
                </el-row>
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
                <el-button size="small" @click="views.filter.show = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-popover>

        </el-col>
        <el-col><el-button size="small" disabled type="primary" icon="el-icon-circle-plus-outline" @click="views.form.show = true">添加日志</el-button></el-col>
        <el-col><el-button size="small" type="primary" plain icon="el-icon-more-outline"></el-button></el-col>
      </el-row>
      <br/>
      <el-row>
        <el-table size="small" :data="data.content" border style="width: 100%">
          <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
          <el-table-column prop="id" label="日志ID" width="60"></el-table-column>
          <el-table-column prop="jobId" label="任务ID" width="60"></el-table-column>
          <el-table-column prop="beanName" label="Bean 名称" width="140"></el-table-column>
          <el-table-column prop="methodName" label="方法名" width="140"></el-table-column>
          <el-table-column prop="params" label="参数"></el-table-column>
          <el-table-column prop="status" label="任务状态" align="center" width="100" :filters="[{ text: '正常', value: '0' }, { text: '暂停', value: '1' }]" :filter-method="filterStatus" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag type="success" size="small" v-if="scope.row.status == 0">正常</el-tag>
              <el-tag type="warning" size="small" v-if="scope.row.status == 1">暂停</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="times" label="耗时(毫秒)" width="80"></el-table-column>
          <el-table-column prop="createdTime" label="执行时间" width="150"></el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <!-- 添加修改Dialog -->
    <!-- 新增 -->

  </div>
</template>
<script>
import page from '@/utils/Page'

export default {
  data () {
    return {
      /** 组件状态控制 */
      views: {
        filter: {show: false}
      },
      /** 页面查询参数控制 */
      params: {
        beanName: '',
        methodName: '',
        params: '',
        cronExpression: '',
        status: 0,
        remark: ''
      },
      /** 页面数据控制 */
      data: {
        page: {
          total: 0,
          page: 0,
          size: 15,
          layout: page.layout,
          sizes: page.sizes
        },
        content: []
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init: function () {
      this.page(0)
    },
    page: function (page) {
      let pageable = {}
      pageable.page = page
      pageable.size = this.data.page.size
      this.loading = true
      this.$axios.get('/schedules/logs', this.params, {params: pageable}).then(response => {
        this.loading = false
        this.data.content = response.body.content
        this.data.page.total = response.body.totalElements
        this.data.page.page = response.body.number
        this.data.page.size = response.body.size
      }).catch(error => {
        this.loading = false
        this.$message.error(error.message)
      })
    },
    runClicker: function (row) {

    },
    onSearch: function () {

    },
    filterStatus: function () {

    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
