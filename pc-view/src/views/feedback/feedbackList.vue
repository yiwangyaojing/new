<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>首页反馈列表</span>
    </div>
    <!--<el-row style="margin:15px">-->
      <!--<el-col :span=16>-->
        <!--<div style="margin-top: 15px;">-->
          <!--用户名:-->
          <!--<el-select v-model="open_id" filterable placeholder="请选择所属用户" style="width: 200px" @change="initData">-->
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
    <!--</el-row>-->
    <el-row style="margin:15px">
      <el-col :span="24">
        <el-table :data="pageInfo.content" style="width: 100%; margin-top: 25px; " stripe border>
          <el-table-column prop="open_id" label="用户昵称" :formatter="userFormatter"/>
          <el-table-column prop="phone" label="联系方式"></el-table-column>
          <el-table-column prop="content" label="反馈内容"  />
          <el-table-column prop="created_at" label="反馈时间" :formatter="dateFormatter" />
        </el-table>

        <!--<el-table :data="pageInfo.content" style="width: 100%; margin-top: 25px; ">-->
          <!--<el-table-column width="180" prop="open_id" label="用户" :formatter="userFormatter"/>-->
          <!--<el-table-column width="240" prop="content" label="文字"></el-table-column>-->
          <!--<el-table-column label="图片"  >-->
            <!--<template scope="scope">-->
              <!--<img  v-for="item in scope.row.images" :key="item" :src="item.mini_url" width="40" height="40" class="head_pic"/>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column width="180" prop="created_at" label="时间" :formatter="dateFormatter" />-->
        <!--</el-table>-->

      </el-col>
    </el-row>
    <el-row type="flex" justify="end" style="margin:15px">
      <el-col style="text-align: right">
        <div class="block">
          <el-pagination
            background=""
            @current-change="handleCurrentChange"
            :current-page=pageInfo.pageNumber
            :page-size=pageInfo.pageSize
            layout="total, prev, pager, next, jumper"
            :total=pageInfo.totalCount>
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
      pageInfo: {
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
    userFormatter (row, col, val) {
      for (let user of this.options) {
        if (user.value === val) {
          return user.label
        }
      }
      return ''
    },
    handleCurrentChange (val) {
      this.pageInfo.pageNumber = val
      this.initData()
    },
    initData () {
      this.pageInfo.params = {}
      this.pageInfo.params.type = 0
      if (this.open_id) {
        this.pageInfo.params.open_id = this.open_id
      }
      this.pageInfo.pageIndex = (this.pageInfo.pageNumber - 1) * this.pageInfo.pageSize

      const loading = this.$loading({lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'
      })
      axios.post('/feedback', this.pageInfo).then(resp => {
        this.pageInfo = resp
        loading.close()
      })
    },
    initSelect () {
      axios.get('/users').then(resp => {
        for (let user of resp) {
          let option = {}
          option.label = user.nickName
          option.value = user.openid
          this.options.push(option)
        }
      })
    }
  },
  mounted () {
    this.initData()
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
    width: 200px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
