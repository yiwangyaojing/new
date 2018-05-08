<style scoped>
  @import '../../resources/css/flex.css';
  @import '../../resources/css/styles.css';
</style>
<template>
  <div>
    <el-row class="breadcrumb warp" type="flex" align="middle">
      <el-col>
        <h2>用户查询</h2>
        <p>查询系统登陆用户数据</p>
      </el-col>
      <el-col class="flex-1"></el-col>
      <el-col><el-input placeholder="请输入关键字" class="text" size="small" prefix-icon="el-icon-search" v-model="params.keywords"></el-input></el-col>
    </el-row>
    <br/>
    <el-card>
      <el-row type="flex" justify="start" align="middle" :gutter="8" class="warp">
        <el-col><el-button type="text">用户列表</el-button></el-col>
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
        <el-col><el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="showAddDialog">添加用户</el-button></el-col>
        <el-col>
          <el-dropdown :hide-on-click="false">
            <span><el-button size="small" type="primary" plain icon="el-icon-more-outline"></el-button></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleBatchDelete">批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <br/>
      <el-row v-loading="loading">
        <el-table size="small" style="width: 100%" :data="data.content" border @selection-change="selectionChange">
          <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
          <el-table-column prop="tenantCode" label="租户编码" width="100"></el-table-column>
          <el-table-column prop="username" label="用户名" width="120"></el-table-column>
          <el-table-column prop="realName" label="真实姓名" width="120"></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="roleNames" label="角色">
            <template slot-scope="scope">
              <el-tag style="margin-right: 10px" type="danger" v-for="(item, index) in scope.row.roleNames" :key="index">{{item}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" sortable label="日期" width="180"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-setting" @click.native="handleBind(scope.row)"></el-button>
              <el-button type="text" size="small" icon="el-icon-edit" @click.native="handleEdit(scope.row)"></el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click.native="handleDelete(scope.row)"></el-button>
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
          :current-page="data.page.page + 1"
          :layout="data.page.layout"
          :total="data.page.total">
        </el-pagination>
      </el-row>
      <el-dialog title="用户添加" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="padding-right: 50px">
          <el-form-item label="用户名：" prop="username" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名：" prop="realName" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.realName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="绑定角色" :visible.sync="role.dialogBind" width="540px">
        <el-row class="warp" type="flex" justify="center">
          <el-col>
            <el-transfer
              filterable
              :filter-method="filterMethod"
              :titles="['未绑定', '已绑定']"
              filter-placeholder="请输入关键字"
              v-model="role.roleBound"
              :data="role.roleList">
            </el-transfer>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="role.dialogBind=false">取 消</el-button>
          <el-button type="primary" @click="handleSubmitBind()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import page from '@/utils/Page'
import ElCol from 'element-ui/packages/col/src/col'
import ElRow from 'element-ui/packages/row/src/row'
import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
import ElCard from '../../../node_modules/element-ui/packages/card/src/main.vue'

export default {
  components: {
    ElButton,
    ElCard,
    ElCol,
    ElRow},
  data () {
    return {
      loading: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 绑定弹出框
      role: {
        userId: '',
        dialogBind: false,
        roleList: [],
        roleBound: []
      },
      ruleForm: {
        deleteIds: [],
        username: '',
        realName: '',
        password: '',
        mobile: '',
        email: '',
        tenantCode: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        realName: [{ required: true, message: '请输入真实姓名' }],
        mobile: [{ required: true, message: '请输入手机号' }],
        email: [{ required: true, message: '请输入邮箱' }]
      },
      /** 组件状态控制 */
      views: {
        filter: { show: false },
        form: { show: false }
      },
      /** 页面查询参数控制 */
      params: {
        keywords: '',
        username: '',
        realName: '',
        startCreate: '',
        endCreate: ''
      },
      /** 页面数据控制 */
      data: {
        page: {
          total: 0,
          page: 1,
          size: 10,
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
      this.$axios.post('/user/page', this.params, {params: pageable}).then(response => {
        this.loading = false
        this.data.content = response.body.content
        this.data.page.total = response.body.totalElements
        this.data.page.page = response.body.number
        this.data.page.size = response.body.size
      })
    },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            this.$axios.put('/user/' + this.ruleForm.id, this.ruleForm).then(response => {
              this.dialogFormVisible = false
              this.page(0)
            })
          } else {
            this.$axios.post('/user/save', this.ruleForm).then(response => {
              this.dialogFormVisible = false
              this.page(0)
            })
          }
        } else {
          return false
        }
      })
    },
    handleEdit (row) {
      this.dialogFormVisible = true
      let ids = this.ruleForm.deleteIds
      this.ruleForm = row
      this.ruleForm.deleteIds = ids
    },
    handleSizeChange (val) {
      this.data.page.size = val
      this.page(0)
    },
    handleCurrentChange (val) {
      this.page(val - 1)
    },
    selectionChange (selection) {
      let deleteIds = []
      selection.forEach(row => {
        deleteIds.push(row.id)
      })
      this.ruleForm.deleteIds = deleteIds
    },
    handleBatchDelete () {
      if (this.ruleForm.deleteIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除的行!'
        })
      } else {
        this.batchDelete()
      }
    },
    handleDelete (row) {
      this.ruleForm.deleteIds = [row.id]
      this.batchDelete()
    },
    batchDelete () {
      this.$confirm('将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/user/' + this.ruleForm.deleteIds).then(response => {
          this.dialogFormVisible = false
          this.page(0)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    cancel: function () {
      this.dialogFormVisible = false
    },
    next: function () {
      this.page(this.data.page.page + 1)
    },
    onSearch: function () {
      this.page(0)
    },
    handleBind (row) {
      this.role.dialogBind = true
      this.role.roleList = []
      this.role.roleBound = []
      this.role.userId = row.id
      this.$axios.get('/user/role/bind/' + row.id).then(response => {
        if (response.body.rolesResp) {
          response.body.rolesResp.forEach((roleResp, index) => {
            this.role.roleList.push({
              key: roleResp.id,
              label: roleResp.name
            })
          })
        }
        if (response.body.bindIds) {
          response.body.bindIds.forEach((id, index) => {
            this.role.roleBound.push(id)
          })
        }
      })
    },
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    handleSubmitBind () {
      this.$axios.put('/user/role/' + this.role.userId, {roleIds: this.role.roleBound}).then(response => {
        this.role.dialogBind = false
        this.page(0)
      })
    },
    showAddDialog () {
      this.dialogFormVisible = true
      this.ruleForm = {deleteIds: this.ruleForm.deleteIds}
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
