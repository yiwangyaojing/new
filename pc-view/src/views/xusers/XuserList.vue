<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户列表</span>
    </div>
    <el-row style="margin:15px">
      <el-col :span=8>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
            <el-select v-model="searchSelect" slot="prepend" placeholder="请选择" @change="changeSelect">
              <el-option label="用户名" value="nickName"/>
              <el-option label="OpenID" value="openid"/>
              <el-option label="性别" value="gender"/>
              <el-option label="省" value="province"/>
              <el-option label="市" value="city"/>
              <el-option label="最后登录" value="updated_at"/>
              <el-option label="注册时间" value="created_at"/>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="initUser"/>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="24">
        <el-table :data="pageUser.content" style="width: 100%; margin-top: 25px; " stripe border>
          <el-table-column prop="nickName" label="用户名" sortable/>
          <el-table-column label="头像" width="80" sortable>
            <template scope="scope">
              <img :src="scope.row.avatarUrl" width="40" height="40" class="head_pic" @click="showMax(scope.row.avatarUrl)"/>
            </template>
          </el-table-column>
          <el-table-column prop="openid" label="OpenID" sortable/>
          <el-table-column prop="gender" label="性别" sortable :formatter="genderFormatter"/>
          <!--<el-table-column prop="age" label="年龄" sortable > </el-table-column>-->
          <el-table-column prop="province" label="省" sortable/>
          <el-table-column prop="city" label="市" sortable/>
          <!--<el-table-column prop="sex" label="终端型号" sortable > </el-table-column>-->
          <el-table-column prop="updated_at" label="最后登录" sortable :formatter="dateFormatter"/>
          <el-table-column prop="created_at" label="注册时间" sortable :formatter="dateFormatter"/>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end" style="margin: 15px">
      <el-col :span="12" style="text-align: right">
        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page=pageUser.pageNumber
            :page-size=pageUser.pageSize
            layout="total, prev, pager, next, jumper"
            :total=pageUser.totalCount>
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="imgVisible"
      width="40%">
      <img :src="imgUrl" style="width: 100%;"/>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'xuser-list',
  data () {
    return {
      imgVisible: false,
      imgUrl: '',
      searchSelect: 'nickName',
      searchInput: '',
      table: {
        border: true,
        stripe: true
      },
      pageUser: {
        pageSize: 10,
        pageNumber: 1,
        pageIndex: 0,
        totalCount: 0,
        content: [],
        params: {}
      }
    }
  },
  methods: {
    dateFormatter (row, col, val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss') // 服务器时间
    },
    changeSelect (val) {
      this.searchSelect = val
    },
    genderFormatter (row) {
      if (row.gender === 1) {
        return '男'
      } else {
        return '女'
      }
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.initUser()
    },
    initUser () {
      this.pageUser.params = {}
      if (this.searchInput) {
        console.log(this.searchInput)
        let key = this.searchSelect
        let value = this.searchInput
        this.pageUser.params[key] = value
      }
      this.pageUser.pageIndex = (this.pageUser.pageNumber - 1) * this.pageUser.pageSize
      axios.post('/backend/users', this.pageUser).then(resp => {
        this.pageUser = resp
      })
    },
    showMax (url) {
      console.log(url)
      this.imgVisible = true
      this.imgUrl = url
    }
  },
  mounted () {
    this.initUser()
  }
}
</script>
<style>
  .bg-purple-dark {
    background: #99a9bf;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 100px;
  }

  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
