<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>客户列表</span>
    </div>
    <el-row style="margin:15px">
      <el-col :span=6>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
            <el-select v-model="searchSelect" slot="prepend" placeholder="请选择" @change="changeSelect">
              <el-option label="姓名" value="cst_name"/>
              <el-option label="手机号" value="cst_phone"/>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="initPlans"/>
          </el-input>
        </div>
      </el-col>
      <el-col :span=1>
        <div style="margin-top: 15px;"></div>
      </el-col>
      <!--<el-col :span=16>-->
        <!--<div style="margin-top: 15px;">-->
          <!--所属用户:-->
          <!--<el-select v-model="open_id" filterable placeholder="请选择所属用户" style="width: 200px" @change="changeUser">-->
            <!--<el-option-->
              <!--v-for="item in options"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</div>-->
      <!--</el-col>-->
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="24">
        <el-table :data="pagePlan.content" border style="width: 100%; margin-top: 25px;" stripe>
          <el-table-column prop="cst_name" label="客户名称"/>
          <el-table-column prop="cst_phone" label="联系电话" />
          <el-table-column prop="open_id" label="对应用户"  :formatter="userFormatter"/>
          <el-table-column prop="cst_address" label="地址" />
          <el-table-column prop="h_is_finish" label="拍房子"  :formatter="yesOrNoFormatter"/>
          <el-table-column prop="d_is_finish" label="收资料"   :formatter="yesOrNoFormatter"/>
          <el-table-column prop="rf_is_finish" label="排板子"   :formatter="yesOrNoFormatter"/>
          <el-table-column prop="created_at" label="添加时间"  :formatter="dateFormatter"/>
          <el-table-column prop="updated_at" label="更新时间"  :formatter="dateFormatter"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end" style="margin:15px">
      <el-col style="text-align: right">
        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page=pagePlan.pageNumber
            :page-size=pagePlan.pageSize
            layout="total, prev, pager, next, jumper"
            :total=pagePlan.totalCount>
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'xuser-list',
  data () {
    return {
      searchSelect: 'cst_name',
      searchInput: '',
      table: {
        border: true,
        stripe: true
      },
      options: [
        {
          label: '所有',
          value: ''
        }
      ],
      open_id: '',

      pagePlan: {
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
    changeSelect (val) {
      this.searchSelect = val
    },
    changeUser (val) {
      this.open_id = val
      this.initPlans()
    },
    dateFormatter (row, col, val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss') // 服务器时间
    },
    yesOrNoFormatter (row, col, val) {
      if (val === 0) {
        return '否'
      } else {
        return '是'
      }
    },
    userFormatter (row, col, val) {
      for (let user of this.options) {
        if (user.value === val) {
          return user.label
        }
      }
      return ''
    },
    handleCurrentChange (val) {
      this.pagePlan.pageNumber = val
      this.initPlans()
    },
    initPlans () {
      this.pagePlan.params = {}
      if (this.searchInput) {
        let key = this.searchSelect
        let value = this.searchInput
        this.pagePlan.params[key] = value
      }
      if (this.open_id) {
        this.pagePlan.params.open_id = this.open_id
      }
      this.pagePlan.pageIndex = (this.pagePlan.pageNumber - 1) * this.pagePlan.pageSize

      const loading = this.$loading({
        lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'
      })
      axios.post('/backend/plans', this.pagePlan).then(resp => {
        this.pagePlan = resp
        loading.close()
      })
    },
    initSelect () {
      axios.get('/backend/users').then(resp => {
        for (let user of resp) {
          let option = {}
          option.label = user.nickName
          option.value = user.openid
          this.options.push(option)
        }
      })
    },
    handleClick (row) {
      // console.log(row)
      this.$router.push({name: 'XCustomerDetail', query: {planId: row.id}})
    }
  },
  mounted () {
    this.initPlans()
    this.initSelect()
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
