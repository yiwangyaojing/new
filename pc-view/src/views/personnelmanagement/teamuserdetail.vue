<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24">
        <el-row>
          <img :src="data.avatarUrl" width="80px" height="80px" class="fl" />
          <div class="fl top-name-wrap"><div class="top-name">{{data.name || ''}}</div></div>
        </el-row>
        <el-row class="row-top-margin f-m">
          <div class="fl label-name">手机号：</div><div class="fl">{{data.phone || ''}}</div>
        </el-row>
        <el-row class="row-top-margin f-m">
          <div class="fl label-name">加入时间：</div><div class="fl">{{ formatDate || ''}}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="row-top-margin">
      <el-col :span="12">
        <el-table
          :data="tableData"
          stripe
          @row-click="rowClick"
          style="width: 100%; border: 1px solid #efefef;">
          <el-table-column
            prop="name"
            label="所属团队">
          </el-table-column>
          <el-table-column
            prop="user_rank"
            :formatter="userRankFormat"
            label="角色">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="row-top-margin f-m">
      <el-row class="row-h">
        <div class="fl label-name">客户数量：</div><div class="fl label-view">{{data.c_num || 0}}</div>
        <el-button class="m-l-o label-view-btn" @click="gotoCustomer" type="success" size="mini">他的客户</el-button>
      </el-row>
      <el-row class="row-top-margin row-h">
        <el-col class="fl">
          <div class="fl">
            <div class="fl label-name">拍房子数量：</div><div class="fl label-view">{{data.h_is_finish_num || 0}}</div>
          </div>
          <div class="fl m-l-40">
            <div class="fl label-name">排板子数量：</div><div class="fl label-view">{{data.rf_is_finish_num || 0}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-top-margin row-h">
        <div class="fl label-name">收资料数量：</div><div class="fl label-view">{{data.d_is_finish_num || 0}}</div>
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'teamuserdetail',
  data () {
    return {
      team_id: '',
      open_id: '',
      img: 'http://haoxiaoshou-test.oss-cn-shanghai.aliyuncs.com/mp_xiaosolar-sales/20180509/6/0/25/wx6441dd4482409ffb.o6zAJs_OUqppBgNYIqSJwoknNI_E.cds2mvPTvMKH87052aae6769a4ed069d6795fe97e6b5.jpeg',
      tableData: [],
      data: {
        avatarUrl: '',
        name: '',
        phone: '',
        join_date: '',
        c_num: '',
        h_is_finish_num: '',
        d_is_finish_num: '',
        rf_is_finish_num: ''
      }
    }
  },
  methods: {
    loadData () {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      axios.get('/api/pc/teamUserPc/' + this.team_id + '/' + this.open_id, {}).then(res => {
        loading.close()
        console.log('这里是查询结果===>>', res)
        this.data = res.data
        this.tableData = res.teams
      }, () => {
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    userRankFormat (row) {
      return row.user_rank === 1 ? '管理员' : '业务员'
    },
    rowClick (row) {
      console.log('这里是点击一行===>>', row)
      this.$router.push({path: '/PersonnelManagement', query: {teamid: row.team_id, id: row.id}})
    },
    gotoCustomer () {
      this.$router.push({path: '/CustomerData', query: {openid: this.open_id}})
    }
  },
  mounted () {
    let params = this.$route.query
    this.open_id = params.openid
    this.team_id = params.team_id
    this.loadData()
    console.log('这里是参数===>>', params)
  },
  computed: {
    formatDate: function () {
      console.log('=============')
      return moment(this.data.join_date).utc().zone(-8).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.top-name-wrap {
  height: 80px;
}
.fl {
  float: left;
}
.label-name {
  width: 120px;
  text-align: right;
}
.label-view {
  width: 200px;
  text-align: left;
}
.label-view-btn {
  margin-left: 25px;
  height: 25px;
}
.top-name {
  position: absolute;
  bottom: 15px;
  margin-left: 10px;
  font-size: 30px;
}
.row-top-margin {
  margin-top: 10px;
}
.m-l-o {
  margin-left: 35px;
}
.row-h {
  height: 30px;
}
</style>
