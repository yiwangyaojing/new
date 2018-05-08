<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div>
    <el-row class="breadcrumb warp" type="flex" align="middle">
      <el-col>
        <h2>资源查询</h2>
        <p>查询系统菜单及功能资源数据</p>
      </el-col>
      <el-col class="flex-1"></el-col>
      <el-col><el-input placeholder="请输入关键字" class="text" size="small" prefix-icon="el-icon-search" v-model="params.keywords"></el-input></el-col>
    </el-row>

    <el-card class="main">
      <el-row type="flex" justify="start" align="middle" :gutter="8" class="warp">
        <el-col><el-button type="text">资源列表</el-button></el-col>
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
        <el-col><el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="createClicker">添加资源</el-button></el-col>
        <el-col><el-button size="small" type="primary" plain icon="el-icon-more-outline"></el-button></el-col>
      </el-row>
      <br/>
      <el-row>
        <el-table size="small" :data="views.table.data" border style="width: 100%">
          <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
          <el-table-column prop="name" label="资源名称">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-for="index in scope.row.level" :key="index"> </el-button>
              <template v-if="scope.row.children">
                <i v-if="scope.row.expanded" class="el-icon-arrow-down" @click="resourceClicker(scope.row)"/>
                <i v-else class="el-icon-arrow-right" @click="resourceClicker(scope.row)"/>
              </template>
              <!--<i class="el-icon-news"/>{{scope.row.name}}-->
              <el-button type="text" size="small" icon="el-icon-news">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="资源代码" width="120"></el-table-column>
          <el-table-column prop="resourceType" label="资源类型" width="90" :filters="[{ text: '菜单组', value: '菜单组' }, { text: '菜单', value: '菜单' }, { text: '功能', value: '功能' }, { text: '其他', value: '其他' }]" :filter-method="filterGender" filter-placement="bottom-end"></el-table-column>
          <el-table-column prop="url" label="资源路径" width="150"></el-table-column>
          <el-table-column prop="permission" label="权限" width="150"></el-table-column>
          <el-table-column prop="available" label="启用" align="center" width="60">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.available" @change="availableClicker(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="rank" label="排序" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-sort-up" @click="rankClicker(scope.row, 'up')"></el-button>
              <el-button type="text" size="small" icon="el-icon-sort-down" @click="rankClicker(scope.row, 'down')"></el-button>
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
    <el-dialog title="资源添加/编辑" :visible.sync="views.form.show" width="540px">
      <el-form :model="views.form.data" :rules="views.form.rules" ref="views.form.data" label-width="140px">
        <el-form-item label="选择上级资源" prop="parents">
          <el-cascader v-model="views.form.data.parents"
            :options="data.content"
            change-on-select clearable
            :props="{value:'code', label: 'name'}">
          </el-cascader>
        </el-form-item>
        <el-form-item label="资源名称" prop="name" >
          <el-input v-model="views.form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="resourceType">
          <el-radio-group v-model="views.form.data.resourceType">
            <el-radio-button label="菜单组"></el-radio-button>
            <el-radio-button label="菜单"></el-radio-button>
            <el-radio-button label="功能"></el-radio-button>
            <el-radio-button label="其他"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="views.form.data.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input v-model="views.form.data.permission" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="views.form.data.theme.icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标颜色" prop="color">
          <el-color-picker v-model="views.form.data.theme.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="启用" prop="available">
          <el-checkbox v-model="views.form.data.available"></el-checkbox>
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

export default {
  data () {
    return {
      /** 组件状态控制 */
      views: {
        filter: {show: false},
        tree: {
          data: [],
          props: {
            children: 'children',
            label: 'name'
          },
          expandedKeys: []
        },
        form: {// 添加和修改的form（默认）
          show: false,
          labelWidth: '140px',
          rules: {
            name: [
              {required: true, message: '请输入资源名称', trigger: 'blur'},
              {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
            ],
            resourceType: [
              {required: true, message: '请选择资源类型', trigger: 'blur'}
            ]
          },
          data: {
            id: '',
            name: '',
            resourceType: '菜单',
            url: '',
            parentCode: '',
            permission: '',
            theme: {
              icon: '',
              color: '#409EFF'
            },
            available: true
          }
        },
        table: {
          expandedKeys: [],
          data: []
        }
      },
      /** 页面查询参数控制 */
      params: {
        name: '',
        resourceType: '',
        url: '',
        parentId: '',
        icon: '',
        permission: '',
        color: ''
      },
      /** 页面数据控制 */
      data: {
        content: []
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init: function () {
      this.$axios.get('/resources').then(response => {
        this.data.content = response.body
        this.views.table.data = this.tableDataConverter(response.body)
      })
    },
    tableDataConverter: function (content) {
      if (!content) return []
      let result = []
      for (let item of content) {
        let expanded = this.views.table.expandedKeys.indexOf(item.code) >= 0

        let copy = JSON.parse(JSON.stringify(item))
        copy.expanded = expanded

        let children = expanded ? this.tableDataConverter(item.children) : []

        copy.children = item.children && item.children.length > 0
        result = result.concat(copy, children)
      }
      return result
    },
    createClicker: function () {
      this.views.form.show = true
      this.views.form.data = {
        id: null,
        parents: this.views.form.data.parents ? this.views.form.data.parents : [],
        name: '',
        resourceType: this.views.form.data.resourceType ? this.views.form.data.resourceType : '菜单',
        url: '',
        parentCode: '',
        permission: '',
        theme: {
          icon: '',
          color: '#409EFF'
        },
        available: true
      }
    },
    resourceClicker: function (row) {
      let expandedKeys = this.views.table.expandedKeys
      let index = expandedKeys.indexOf(row.code)
      if (index >= 0) {
        expandedKeys.splice(index, 1)
      } else {
        expandedKeys.push(row.code)
      }
      this.views.table.expandedKeys = expandedKeys

      this.views.table.data = this.tableDataConverter(this.data.content, row.code)
    },
    rankClicker: function (row, mode) {
      this.$axios.put('/resources/order/' + row.id, null, { params: { mode: mode } }).then(response => {
        this.$message.success('保存成功')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    availableClicker: function (row) {
      let param = { params: { available: row.available } }
      this.$axios.put('/resources/available/' + row.id, null, param).then(response => {
        this.$message.success('保存成功')
        this.init()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    editClicker: function (row) {
      this.views.form.show = true
      let copy = JSON.parse(JSON.stringify(row))
      this.views.form.data = copy
    },
    removeClicker: function (row) {
      this.$axios.delete('/resources/' + row.id).then(response => {
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
            this.$axios.put('/resources/' + this.views.form.data.id, this.views.form.data).then(response => {
              this.views.form.show = false
              this.$message.success('保存成功')
              this.init()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          } else {
            this.$axios.post('/resources', this.views.form.data).then(response => {
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
    filterGender: function () {

    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
