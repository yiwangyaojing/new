<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div>
    <el-row class="breadcrumb warp" type="flex" align="middle">
      <el-col>
        <h2>参数管理</h2>
        <p>配置系统使用参数。</p>
      </el-col>
      <el-col class="flex-1"></el-col>
      <el-col>
        <el-input placeholder="请输入关键字" class="text" size="small" prefix-icon="el-icon-search"
                  v-model="params.keywords"></el-input>
      </el-col>
    </el-row>

    <el-card class="main">
      <el-row type="flex" justify="start" align="middle" :gutter="8" class="warp">
        <el-col>
          <el-button type="text">参数列表</el-button>
        </el-col>
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
                    <el-date-picker size="small" type="date" placeholder="选择日期" v-model="params.startDate"
                                    style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line">-</el-col>
                  <el-col class="flex-1">
                    <el-time-picker size="small" type="fixed-time" placeholder="选择时间" v-model="params.endDate"
                                    style="width: 100%;"></el-time-picker>
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
        <el-col>
          <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="views.form.show = true">
            添加参数
          </el-button>
        </el-col>
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
          <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
          <el-table-column prop="key" label="参数名" width="160"></el-table-column>
          <el-table-column prop="value" label="参数值" width="250"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100"
                           :filters="[{ text: '正常', value: '0' }, { text: '暂停', value: '1' }]"
                           :filter-method="filterStatus" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.status" @change="statusChanger(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-edit" @click="editClicker(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button type="text" size="small" icon="el-icon-delete" @click="removeClicker(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <!-- 添加修改Dialog -->
    <!-- 新增 -->
    <el-dialog title="参数添加/编辑" :visible.sync="views.form.show" width="540px">
      <el-form :model="views.form.data" :rules="views.form.rules" ref="views.form.data" label-width="140px">
        <el-form-item label="参数名" prop="key">
          <el-input v-model="views.form.data.key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="views.form.data.value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="views.form.data.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="views.form.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('views.form.data')">确 定</el-button>
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
            key: [
              {required: true, message: '请输入参数名', trigger: 'blur'},
              {min: 2, message: '长度在不能少于2个字符', trigger: 'blur'}
            ],
            value: [
              {required: true, message: '请输入参数值', trigger: 'blur'}
            ]
          },
          data: {
            id: null,
            key: '',
            value: '',
            status: 0,
            remark: ''
          }
        }
      },
      /** 页面查询参数控制 */
      params: {
        key: '',
        value: '',
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
      this.$axios.get('/parameters', this.params, {params: pageable}).then(response => {
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
        key: '',
        value: '',
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
    statusChanger: function (row) {
      // TODO
    },
    removeClicker: function (row) {
      this.$axios.delete('/parameters/' + row.id).then(response => {
        this.$message.success('删除成功')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    handleSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.views.form.data.id) {
            this.$axios.put('/parameters/' + this.views.form.data.id, this.views.form.data).then(response => {
              this.views.form.show = false
              this.$message.success('保存成功')
              this.init()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          } else {
            this.$axios.post('/parameters', this.views.form.data).then(response => {
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
    filterStatus: function () {

    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
