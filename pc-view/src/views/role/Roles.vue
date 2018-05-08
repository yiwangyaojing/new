<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div class="flex-v full">
    <el-row class="breadcrumb warp" type="flex" align="middle">
      <el-col>
        <h2>角色管理</h2>
        <p>管理角色数据，每个机构可以有自己独立的角色，点击机构查询该机构下的角色数据。</p>
      </el-col>
      <el-col class="flex-1"></el-col>
      <el-col>
        <el-input placeholder="请输入关键字" class="text" size="small" prefix-icon="el-icon-search" v-model="params.keywords"></el-input>
      </el-col>
    </el-row>
    <el-row class="flex-1" type="flex" :gutter="0">
      <el-col :span="6" class="border-right">
        <div class="main">
          <el-button type="text">组织机构</el-button>
          <el-tree
            ref="tree"
            :data="views.tree.data"
            :props="views.tree.props"
            :highlight-current="true"
            :default-expand-all="false"
            :expand-on-click-node="false"
            :default-expanded-keys="views.tree.expandedKeys"
            node-key="code"
            @node-click="nodeClicker">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="main">
          <el-row type="flex" justify="start" align="middle" :gutter="8" class="warp">
            <el-col><el-button type="text">角色列表</el-button></el-col>
            <el-col class="flex-1"></el-col>
            <el-col>
              <el-popover ref="find" placement="bottom-end" width="500" v-model="views.filter.show">
                <el-button size="small" slot="reference">过滤<i class="el-icon-vueboot-filter el-icon&#45;&#45;right"/></el-button>
                <br/>
                <el-form ref="form" size="small" :model="params" label-width="80px">
                  <el-form-item label="用户名">
                    <el-input size="small" v-model="params.username"></el-input>
                  </el-form-item>
                  <el-form-item label="租户编码">
                    <el-input size="small" v-model="params.tenantCode"></el-input>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <el-date-picker  size="small" v-model="params.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="views.filter.show = false">取消</el-button>
                      <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </el-popover>

            </el-col>
            <el-col><el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="createClicker">添加角色</el-button></el-col>
            <el-col>
              <el-dropdown :hide-on-click="false" size="medium">
                <span><el-button size="small" type="primary" plain icon="el-icon-more-outline"></el-button></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>批量删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <br/>
          <el-row>
            <el-table size="small" :data="data.content" border :max-height="500" style="width: 100%">
              <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
              <el-table-column prop="code" label="角色代码" width="150"></el-table-column>
              <el-table-column prop="name" label="角色名称" sortable width="150"></el-table-column>
              <el-table-column prop="role" label="角色标识" sortable width="150"></el-table-column>
              <el-table-column prop="description" label="角色描述"></el-table-column>
              <el-table-column fixed="right" label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="资源分配" placement="bottom">
                    <el-button type="text" size="small" icon="el-icon-setting" @click="bindClicker(scope.row)"></el-button>
                  </el-tooltip>
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
          <el-row class="page" type="flex" justify="end">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="data.page.sizes"
              :page-size="data.page.size"
              :current-page.sync="data.page.page + 1"
              :layout="data.page.layout"
              :total="data.page.total">
            </el-pagination>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增 -->
    <el-dialog title="角色添加/编辑" :visible.sync="views.form.show" width="540px">
      <el-form :model="views.form.data" :rules="views.form.rules" ref="views.form.data" label-width="140px">
        <el-form-item label="选择所属机构" prop="parents">
          <el-cascader v-model="views.form.data.parents"
                       :options="views.tree.data"
                       change-on-select clearable
                       :props="views.tree.props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色名称" prop="name" >
          <el-input v-model="views.form.data.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="role">
          <el-input v-model="views.form.data.role" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="views.form.data.description" auto-complete="off"></el-input>
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

    <el-dialog title="角色授权" :visible.sync="views.bindForm.show" width="40%">
      <el-tree
        ref="tree"
        :data="views.bindTree.data"
        :props="views.bindTree.props"
        show-checkbox
        node-key="code"
        default-expand-all
        :check-strictly="true"
        :expand-on-click-node="false">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="views.bindForm.show=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitBind()">确 定</el-button>
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
        tree: {
          data: [],
          props: {
            children: 'children',
            label: 'name',
            value: 'code'
          },
          expandedKeys: []
        },
        form: {// 添加和修改的form（默认）
          show: false,
          labelWidth: '140px',
          rules: {
            name: [
              {required: true, message: '请输入资源名称', trigger: 'blur'},
              {min: 2, max: 8, message: '长度在 2 到 5 个字符', trigger: 'blur'}
            ],
            role: [
              {required: true, message: '请输入角色标识', trigger: 'blur'},
              {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
            ]
          },
          data: {
            id: '',
            code: '',
            name: '',
            role: '',
            description: '',
            parents: [],
            available: true
          }
        },
        bindForm: {// 添加和修改的form（默认）
          show: false,
          data: {
            id: '',
            code: '',
            name: '',
            role: '',
            description: '',
            parents: [],
            available: true
          }
        },
        bindTree: {
          data: [],
          props: {
            children: 'children',
            label: 'name',
            isLeaf: true
          },
          expandedKeys: []
        }
      },
      /** 页面查询参数控制 */
      params: {
        name: '',
        role: '',
        description: '',
        parentId: ''
      },
      /** 页面数据控制 */
      data: {
        page: {
          total: 300,
          page: 1,
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
      this.$axios.get('/organizations').then(response => {
        let keys = []
        for (let item of response.body) {
          if (response.body.indexOf(item) === 0) {
            this.loadRoles(0, item.code)
            setTimeout(() => this.$refs.tree.setCurrentNode(item), 100)
          }
          keys.push(item.code)
        }
        this.views.tree.expandedKeys = keys
        this.views.tree.data = response.body
        console.log(response.body)
      }).catch(error => {
        this.$message.error(error.message)
      })

      // 获取所有的权限资源
      this.$axios.get('/resources').then(response => {
        this.views.bindTree.data = response.body

        console.log('init.resources.body: %o', response.body)
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    loadRoles: function (page, orgCode) {
      let pageable = {}
      pageable.page = page
      pageable.size = this.data.page.size
      this.views.loading = true

      this.$axios.get('/organizations/' + orgCode + '/roles', null, {params: pageable}).then(response => {
        this.views.loading = false
        // page.response(this.data, response);
        this.data.content = response.body.content
        this.data.page.total = response.body.totalElements
        this.data.page.page = response.body.number
        this.data.page.size = response.body.size
      }).catch(error => {
        this.views.loading = false
        this.$message.error(error.message)
      })
    },
    createClicker: function () {
      let org = this.$refs.tree.getCurrentNode()
      let parents = []
      if (org && org.parents) {
        for (let item of org.parents) {
          parents.push(item)
        }
      }
      parents.push(org.code)

      this.views.form.data = {
        id: '',
        code: '',
        name: '',
        role: '',
        description: '',
        parents: parents,
        available: true
      }
      this.views.form.show = true
    },
    editClicker: function (row) {
      this.views.form.show = true
      let copy = JSON.parse(JSON.stringify(row))
      console.log('editClicker> copy: %o', copy)
      this.views.form.data = copy
    },
    removeClicker: function (row) {
      this.$axios.delete('/roles/' + row.id).then(response => {
        this.$message.success('删除成功')
        this.loadRoles(this.data.page.page, this.$refs.tree.getCurrentKey())
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    bindClicker: function (row) {
      this.views.bindForm.show = true
      this.views.bindForm.role = row.code
      this.$axios.get('/roles/' + row.role + '/permissions').then(response => {
        console.log('bindClicker.response.body: %o', response.body)
        this.$refs.tree.setCheckedKeys(response.body)
      })
    },
    handleSubmitBind: function () {
      let keys = this.$refs.tree.getCheckedKeys()
      console.log('handleSubmitBind > keys: %o', keys)
      this.$axios.put('/roles/' + this.views.bindForm.role + '/permissions', keys).then(response => {
        this.views.bindForm.show = false
      }).catch((response) => {
        this.views.bindForm.show = false
        this.$message.error(response.message)
      })
    },

    resetForm: function (formName) {
      this.$refs[formName].resetFields()
    },
    handleSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.views.form.data.id) {
            this.$axios.put('/roles/' + this.views.form.data.id, this.views.form.data).then(response => {
              this.views.form.show = false
              this.$message.success('保存成功')
              this.init()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          } else {
            this.$axios.post('/roles', this.views.form.data).then(response => {
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
    handleBatchDelete: function () {
      if (!this.$refs.tree.getCurrentKey()) {
        this.$message({
          type: 'warning',
          message: '请选择删除的资源!'
        })
      } else {
        this.views.form.data = {}
        this.$axios.delete('/roles/' + this.$refs.tree.getCurrentKey()).then(response => {
          this.resetCurrentNode()
          this.init()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {

        })
      }
    },
    nodeClicker: function (item) {
      console.log('node: %o', item)
      this.loadRoles(0, item.code)
    },
    handleCurrentChange: function () {

    },
    handleSizeChange: function () {

    },
    onSearch: function () {

    }

  },
  computed: {}
}
</script>

<style scoped>
  .clear-bottom-space {
    margin-bottom: -20px;
  }

  .border-right {
    border-right: solid 1px #EBEEF5;
  }

  > > > .el-tree-node__label {
    font-size: 13px !important;
  }

</style>
