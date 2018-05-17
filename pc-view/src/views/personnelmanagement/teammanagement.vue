<template>
  <el-card class="box-card">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span style="color: #FF0000;">确定解散团队？解散后将会删除所有团队信息，且不可恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dissolveTeamJuge">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="saveDialogVisible"
      width="20%">
      <span>确定保存修改?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleChange">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="sendCodeVisible"
      width="20%"
      center>
      <el-row class="font-size-20">
        <el-col :span="10">注册手机号：</el-col>
        <el-col :span="14">{{phone}}</el-col>
      </el-row>
      <el-row class="m-t-10 font-size-20">
        <el-col :span="10">验证码：</el-col>
        <el-col :span="14">
          <el-input size="small" v-model="code" placeholder="请输入验证码"></el-input>
        </el-col>
      </el-row>
      <el-row class="m-t-10 font-size-20">
        <el-col :offset="10" :span="14">
          <el-button size="small" style="width: 120px" :loading="sendLoading" type="success" @click="sendCode">{{sendButtonContent}}</el-button>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="sendCodeVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dissolveCompany">确 定</el-button>
      </span>
    </el-dialog>
    <el-row class="f-m">
      <el-col :span="24">
        <el-col :span="5">
          <el-tree :data="data" :props="defaultProps" node-key="id" :default-checked-keys="defaultKey" :highlight-current='hightlight' :auto-expand-parent="hightlight" :default-expanded-keys="defaultKey" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="19">
          <el-row class="row-d">
            <el-col :span="2" style="line-height: 30px;">创建者: &nbsp;&nbsp;</el-col>
            <el-col :span="3" style="line-height: 30px;">{{founder.name}}</el-col>
            <el-col :span="5">
              <el-button v-if="founder.isCompanyManage" type="danger" style="margin-left: 20px; height: 30px;" size="mini" @click="dialogVisible = true">解散团队</el-button>
            </el-col>
          </el-row>
          <el-row class="row-d" style="margin-top: 20px;">
            <el-col :span="2" class="f-m" style="line-height: 30px;">管理员: &nbsp;&nbsp;</el-col>
            <el-col :span="12">
              <el-select style="width: 100%;" size="small" class="fl" v-model="selectedItems" :disabled="!founder.isSaveShow" filterable multiple placeholder="请选择" @change="selectChange">
                <el-option v-for="item in users" :key="item.openid" :label="item.name" :value="item.openid">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5" :offset="1" >
              <el-button type="success" v-if="founder.isSaveShow" size="small" @click="saveDialogVisible = true">保存</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-table size="mini" border stripe :data="tableData"
                      v-loading="tableLoading"
                      element-loading-text="加载中..."
                      element-loading-spinner="el-icon-loading"
                      style="width: 100%">
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="user_rank"  label="角色" :formatter="formatterUserRank">
              </el-table-column>
              <el-table-column prop="num" label="客户数量" :formatter="formatterNum">
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="gotoDetail(scope.row)" type="text" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination style="margin-top: 20px;"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage4"
                           :page-sizes="[10, 20, 30, 40,50]"
                           :page-size="100"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totalNum">
            </el-pagination>
          </el-row>
        </el-col>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import axios from 'axios'
import { getUserInfo } from '../../utils/tools'
import UTree from '../../component/tree/UTree'
export default {
  components: {UTree},
  data () {
    return {
      saveDialogVisible: false,
      dialogVisible: false,
      sendCodeVisible: false,
      hightlight: true,
      sendLoading: false,
      tableLoading: false,
      sendButtonContent: '发送验证码',
      phone: '',
      defaultKey: [],
      data: [],
      selectedTeam: null,
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      code: '',
      founder: {},
      users: [],
      selectedItems: [],
      changeItems: [],
      currentPage4: 1,
      totalNum: 0,
      pagesizeNum: 10,
      pageNum: 1
    }
  },
  methods: {
    dissolveTeamJuge () {
      // 判断当前团队是否是公司团队
      console.log('this is team ===>>', this.selectedTeam)
      if (this.selectedTeam.id === this.selectedTeam.company_id) {
        this.sendCodeVisible = true
      } else {
        this.dissolveTeam()
      }
    },
    sendCode () {
      this.sendLoading = true
      const loading = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      axios.post('/api/teamPc/sms', {phone: this.phone}).then((res) => {
        this.$notify({
          title: '成功',
          message: '验证码发送成功',
          type: 'success'
        })
        loading.close()
        this.changeSendBtn()
      }, () => {
        loading.close()
        this.sendButtonContent = '发送验证码'
        this.sendLoading = false
      }).catch(() => {
        loading.close()
        this.sendButtonContent = '发送验证码'
        this.sendLoading = false
      })
    },
    changeSendBtn () {
      this.sendButtonContent = 120
      let id = setInterval(() => {
        this.sendButtonContent--
        if (this.sendButtonContent === 0) {
          this.sendButtonContent = '发送验证码'
          this.sendLoading = false
          clearInterval(id)
        }
      }, 1000)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesizeNum = val
      this.loadData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.loadData()
    },
    formatterUserRank (row, column, cellValue, index) {
      console.log('this is table ===>>>', row, column, cellValue, index)
      return row.user_rank === 1 ? '管理员' : '业务员'
    },
    formatterNum (row, column, cellValue, index) {
      return row.num ? row.num : '0'
    },
    gotoDetail (row) {
      this.$router.push({path: '/TeamUserDetail', query: {openid: row.openid, team_id: row.team_id}})
    },
    selectChange (data) {
      console.log('这里是已经选择的===>>', data)
      this.changeItems = []
      this.users.forEach(item => {
        if (data.indexOf(item.openid) > -1 && item.user_rank === 2) {
          this.changeItems.push({
            open_id: item.openid,
            user_rank: 1
          })
        } else if (data.indexOf(item.openid) === -1 && item.user_rank === 1) {
          this.changeItems.push({
            open_id: item.openid,
            user_rank: 2
          })
        }
      })
    },
    saveRoleChange () {
      if (!this.changeItems || this.changeItems.length === 0) {
        this.saveDialogVisible = false
        return
      }
      let userInfo = getUserInfo()
      console.log('this is userInfo ===>>', userInfo)
      let openid = userInfo.openid
      let isSelf = false
      if (this.founder.company_founder === openid) {
        this.changeItems.forEach(item => {
          if (item.open_id === openid) {
            isSelf = true
          }
        })
      }
      if (isSelf) {
        this.saveDialogVisible = false
        this.$message.error('公司创建者不可将自己变为业务员')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      let _this = this
      axios.put('/api/pc/teamPc/changeTeamUsersRole', {open_id: openid, team_id: this.selectedTeam.id, users: this.changeItems}).then(res => {
        this.saveDialogVisible = false
        console.log('保存成功===>>', res)
        _this.$notify({
          title: '提示',
          message: '保存成功!',
          type: 'success'
        })
        loading.close()
        this.loadData()
        console.log('这个是请求结果===>>', res)
      }, () => {
        console.log('保存失败')
        this.saveDialogVisible = false
        loading.close()
      }).catch(() => {
        this.saveDialogVisible = false
        loading.close()
      })
    },
    dissolveTeam () {
      let userInfo = getUserInfo()
      console.log('this is userInfo ===>>', userInfo)
      let openid = userInfo.openid
      const loading = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      axios.delete('/api/pc/teamPc/' + openid + '/' + this.selectedTeam.id, {}).then(res => {
        loading.close()
        this.dialogVisible = false
        this.$notify({
          title: '提示',
          message: '操作成功!',
          type: 'success'
        })
        console.log('这里是删除结果===>>', res)
      }, (fail) => {
        console.log('fail ===>>', fail)
        this.$message.error(fail.message)
        loading.close()
      }).catch((err) => {
        console.log('err ===>>', err)
        this.dialogVisible = false
        this.sendCodeVisible = false
        loading.close()
      })
    },
    dissolveCompany (value) {
      console.log('解散团队===>>', value)
      let userInfo = getUserInfo()
      console.log('this is userInfo ===>>', userInfo)
      if (!this.code) {
        this.$message.error('请输入验证码！')
        return false
      }
      let openid = userInfo.openid
      const loading = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      axios.delete('/api/pc/teamPc/' + openid + '/' + this.selectedTeam.id + '/' + this.phone + '/' + this.code, {}).then(res => {
        loading.close()
        this.dialogVisible = false
        this.$notify({
          title: '提示',
          message: '操作成功!',
          type: 'success'
        })
        console.log('这里是删除结果===>>', res)
      }, (fail) => {
        console.log('fail ===>>', fail)
        this.$message.error(fail.message)
        // this.dialogVisible = false
        // this.sendCodeVisible = false
        loading.close()
      }).catch((err) => {
        console.log('err ===>>', err)
        this.dialogVisible = false
        this.sendCodeVisible = false
        loading.close()
      })
    },
    handleNodeClick (data) {
      console.log('选择的团队===>>', data)
      this.selectedTeam = data
      console.log('this is axios ===>>', this.selectedTeam, axios)
      this.loadData()
    },
    loadData () {
      let userInfo = getUserInfo()
      console.log('this is userInfo ===>>', userInfo, this.selectedTeam)
      let openid = userInfo.openid
      this.tableLoading = true
      axios.get('/api/pc/teamPc/' + openid + '/' + this.pageNum + '/' + this.pagesizeNum + '/' + this.selectedTeam.id, {}).then((res) => {
        console.log('这里是请求结果handleNodeClick===>>', res)
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
        this.selectedItems = []
        this.tableData = res.users.data
        this.totalNum = res.users.total
        this.users = res.users.data
        this.founder = res.founder
        this.users.forEach((item) => {
          if (item.user_rank === 1) {
            this.selectedItems.push(item.openid)
          }
        })
      }, () => {
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
      }).catch(() => {
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
      })
    },
    getSelectedItem (teams, value) {
      teams.forEach(item => {
        console.log('这里是递归第一层===>>', item, value)
        if (Number(item.id) === Number(value)) {
          console.log('=========', item, value)
          this.selectedTeam = item
          this.defaultKey = [value]
        }
        if (item.children) {
          this.getSelectedItem(item.children, value)
        }
      })
    },
    init (value) {
      let userInfo = getUserInfo()
      console.log('this is userInfo ===>>', userInfo, value)
      let openid = userInfo.openid
      // console.log('this is axios ===>>', this, axios)
      this.tableLoading = true
      axios.get('/api/pc/teamPc/' + openid, {}).then((res) => {
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
        console.log('这里是请求结果init===>>', res, value, res.teams)
        this.selectedItems = []
        this.data = res.teams
        if (!value) {
          this.selectedTeam = res.teams[0]
          this.defaultKey = [res.teams[0].id]
        } else {
          this.getSelectedItem(res.teams, value)
          setTimeout(() => {
            this.loadData()
          }, 100)
        }
        this.tableData = res.data.users.data
        this.users = res.data.users.data
        this.totalNum = res.data.users.total
        this.founder = res.data.founder
        this.users.forEach((item) => {
          if (item.user_rank === 1) {
            this.selectedItems.push(item.openid)
          }
        })
      }, () => {
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
      }).catch(() => {
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
      })
    }
  },
  mounted () {
    let userInfo = getUserInfo()
    this.phone = userInfo.phone
    let params = this.$route.query
    console.log('这里是跳转过来的参数===>>', params)
    if (params.id) {
      this.init(params.id)
    } else {
      this.init()
    }
  }
}
</script>
<style>
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix:after {
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
  }
  .clearfix {
    zoom: 1;
  }
  .x-Center{
    display: flex;
    display: -webkit-flex;
    -webkit-justify-content: center;
    justify-content: center;
  }
  .xy-Center{
    display: flex;
    display: -webkit-flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
  .y-Center{
    display: flex;
    display: -webkit-flex;
    -webkit-align-items: center;
    align-items: center;
  }
  .m-t-10 {
    margin-top: 10px;
  }
  .font-size-20 {
    font-size: 18px
  }
  .row-d {
    height: 25px;
  }
</style>
