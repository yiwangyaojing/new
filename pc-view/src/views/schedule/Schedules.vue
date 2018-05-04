<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div>
    <el-row class="breadcrumb warp" type="flex" align="middle">
      <el-col>
        <h2>任务调度</h2>
        <p>查询定时任务列表数据，可以添加、修改、删除、执行、暂停任务，可以查看任务执行日志。</p>
      </el-col>
      <el-col class="flex-1"></el-col>
      <el-col><el-input placeholder="请输入关键字" class="text" size="small" prefix-icon="el-icon-search" v-model="params.keywords"></el-input></el-col>
    </el-row>

    <el-card class="main">
      <el-row type="flex" justify="start" align="middle" :gutter="8" class="warp">
        <el-col><el-button type="text">任务列表</el-button></el-col>
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
        <el-col><el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="views.form.show = true">添加任务</el-button></el-col>
        <el-col>
          <el-dropdown @command="moreHandler">
            <el-button size="small" type="primary" plain icon="el-icon-more-outline"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="pause">批量暂停</el-dropdown-item>
              <el-dropdown-item command="resume">批量恢复</el-dropdown-item>
              <el-dropdown-item command="run">立即执行</el-dropdown-item>
              <el-dropdown-item command="delete" divided>批量删除</el-dropdown-item>
              <el-dropdown-item command="logs" divided>日志列表</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-table size="small" :data="data.content" border style="width: 100%">
          <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
          <el-table-column prop="id" label="任务ID" width="60" align="center"></el-table-column>
          <el-table-column prop="beanName" label="Bean 名称" width="140"></el-table-column>
          <el-table-column prop="methodName" label="方法名" width="140"></el-table-column>
          <el-table-column prop="params" label="参数" width="150"></el-table-column>
          <el-table-column prop="cronExpression" label="Cron" width="150"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="status" label="任务状态" align="center" width="100" :filters="[{ text: '正常', value: '0' }, { text: '暂停', value: '1' }]" :filter-method="filterStatus" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag type="success" size="small" v-if="scope.row.status == 0">正常</el-tag>
              <el-tag type="warning" size="small" v-if="scope.row.status == 1">暂停</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="暂停" v-if="scope.row.status == 0" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-vueboot-zanting-yuanshijituantubiao" @click="pauseClicker(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="恢复" v-if="scope.row.status == 1" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-vueboot-bofang-yuanshijituantubiao" @click="resumeClicker(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="立即执行" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-vueboot-bofang" @click="runClicker(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-vueboot-xiugaiziliao" @click="editClicker(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-vueboot-shanchu" @click="removeClicker(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <!-- 添加修改Dialog -->
    <!-- 新增 -->
    <el-dialog title="任务添加/编辑" :visible.sync="views.form.show" width="540px">
      <el-form :model="views.form.data" :rules="views.form.rules" ref="views.form.data" label-width="140px">
        <el-form-item label="Spring Bean 名称" prop="beanName" >
          <el-input v-model="views.form.data.beanName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="方法名" prop="methodName">
          <el-input v-model="views.form.data.methodName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="params">
          <el-input v-model="views.form.data.params" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="views.form.data.cronExpression" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-radio-group v-model="views.form.data.status">
            <el-radio-button label="0">正常</el-radio-button>
            <el-radio-button label="1">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="views.form.data.remark" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="views.form.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('views.form.data')" >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import page from '@/utils/Page'

export default {
  data () {
    return {
      /** 组件状态控制 */
      views: {
        filter: {show: false},
        form: {// 添加和修改的form（默认）
          show: false,
          labelWidth: '140px',
          rules: {
            name: [
              {required: true, message: '请输入机构名称', trigger: 'blur'},
              {min: 2, message: '长度在不能少于2个字符', trigger: 'blur'}
            ],
            type: [
              {required: true, message: '请选择类型', trigger: 'blur'}
            ]
          },
          data: {
            id: null,
            beanName: '',
            methodName: '',
            params: '',
            cronExpression: '',
            status: 0,
            remark: ''
          }
        }
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
      this.$axios.get('/schedules', this.params, {params: pageable}).then(response => {
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
    createClicker: function () {
      this.views.form.data = {
        id: null,
        beanName: '',
        methodName: '',
        params: '',
        cronExpression: '* * * * * ?',
        status: 0,
        remark: ''
      }
      this.views.form.show = true
    },
    editClicker: function (row) {
      this.views.form.show = true
      let copy = JSON.parse(JSON.stringify(row))
      this.views.form.data = copy
    },
    removeClicker: function (row) {
      this.$axios.delete('/schedules/' + row.id).then(response => {
        this.$message.success('删除成功')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    runClicker: function (row) {
      this.$axios.post('/schedules/' + row.id + '/run').then(response => {
        this.$message.success('开始执行')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    resumeClicker: function (row) {
      this.$axios.post('/schedules/' + row.id + '/resume').then(response => {
        this.$message.success('恢复成功')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    pauseClicker: function (row) {
      this.$axios.post('/schedules/' + row.id + '/pause').then(response => {
        this.$message.success('暂停成功')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    handleSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.views.form.data.id) {
            this.$axios.put('/schedules/' + this.views.form.data.id, this.views.form.data).then(response => {
              this.views.form.show = false
              this.$message.success('保存成功')
              this.init()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          } else {
            this.$axios.post('/schedules', this.views.form.data).then(response => {
              this.views.form.show = false
              this.$message.success('保存成功')
              this.init()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          }
        } else {
          return false
        }
      })
    },
    onSearch: function () {

    },
    moreHandler: function (command) {
      if (command === 'logs') {
        console.log('logs clicker')
        this.$router.push('/schedule/logs')
      }
    },
    filterStatus: function () {

    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
