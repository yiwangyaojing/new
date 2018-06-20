<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/CustomerData' }">客户资料</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-row class="f-m">
        <el-col :span="24" style="margin-top: 20px;" class="clearfix">
          <el-col :span="8" class="y-Center">
            <el-col :span="6" class="font-right">统计周期：</el-col >
            <el-col :span="18">
              <el-select @change="tjzqChange" v-model="tjzqvalue" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="8" class="y-Center">
            <el-col :span="6" class="grid-content bg-purple font-right">自定义时间：</el-col>
            <el-col :span="18">
              <el-date-picker unlink-panels @change="selectdateChange" value-format="yyyy-MM-dd" style="width: 88%" size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-col :offset="3" :span="4">
            <el-button  @click="exportExcel" type="primary" size="small">导出Excel</el-button>
            </el-col>
            <el-col :offset="3" :span="4">
            <el-button  @click="batchDownloadData" type="primary" size="small">批量下载图片</el-button>
            </el-col>
            <el-col  :offset="4" :span="6">
              <el-button @click="dialogFormVisible = true" type="primary" size="small">新建客户</el-button>
              <div style="margin-left: 10px"></div>
              <el-dialog title="新建客户" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="form">
                  <el-form-item label="客户名称" :label-width="formLabelWidth">
                    <el-col :span="20">
                      <el-input v-model="form.cst_name" size="small" auto-complete="off"></el-input>
                    </el-col>
                    <el-col :span="1" style="color: red;text-align: right;font-size: 20px;">*</el-col>
                  </el-form-item>
                  <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <el-col :span="20">
                      <el-input v-model="form.cst_phone" size="small" maxlength="11" auto-complete="off"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="详细地址" :label-width="formLabelWidth">
                    <el-col :span="20">
                      <el-input v-model="form.cst_address" type="textarea" autosize size="small" auto-complete="off"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="总价" :label-width="formLabelWidth">
                    <el-col :span="17">
                      <el-input v-model="form.zj_price" size="small" auto-complete="off"></el-input>
                    </el-col>
                    <el-col :span="3"  style="text-align: right;">元</el-col>
                  </el-form-item>
                  <el-form-item label="选择团队" :label-width="formLabelWidth">
                    <el-col :span="20">
                      <el-select v-model="teamselectvalue" @change="teamselectChange" size="small" style="width: 100%;">
                        <el-option
                          v-for="item in newteamoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-col :span="20">
                      <el-input v-model="form.cst_remark" type="textarea" autosize size="small" auto-complete="off"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align: center;">
                  <el-button type="primary" @click="newcustomerClick" size="small">保 存</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span="24" style="margin-top: 20px;" class="clearfix">
          <!--<el-col :span="8" class="y-Center">-->
            <!--<el-col :span="6" class="font-right">团队范围：</el-col>-->
            <!--<el-col :span="18">-->
              <!--<el-select @change="tdfwChange" size="small" class="fl" v-model="tdfwvalue">-->
                <!--<el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
          <!--</el-col>-->
          <el-col :span="8" class="y-Center">
            <el-col :span="6" class="font-right">团队名称：</el-col>
            <el-col :span="18">
              <el-select @change="teannameChange" size="small" style="width: 88%" class="fl" v-model="teamname">
                <el-option v-for="(item, index) in teamoptions" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="8" class="y-Center">
            <el-col :span="6" class="font-right">负责人：</el-col>
            <el-select size="small" v-model="fuzerenvalue" @change="fuzerenChange">
              <el-option v-for="(item, index) in fuzerenoptions" :key="index" :label="item.name" :value="item.openid">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="24" style="margin-top: 20px;" class="clearfix">
          <el-col :span="8" class="y-Center">
            <el-col :span="6" class="font-right">合同状态：</el-col>
            <el-select size="small" class="fl" @change="contractChange" v-model="contractvalue" placeholder="请选择">
              <el-option v-for="item in contractoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8" class="y-Center">
            <el-col :span="6" class="font-right">逾期状态：</el-col>
            <el-col :span="18">
              <el-select style="width: 88%" size="small" @change="overdueChange" v-model="overduevalue" placeholder="请选择">
                <el-option v-for="item in overdueoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span="24" style="margin-top: 20px;">
          <el-col :span="16" class="y-Center">
            <el-col :span="3" class="font-right">搜索条件：</el-col>
            <el-col :span="21">
              <el-col>
                <el-input style="width: 95%;" size="small" @input="searchChange" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchvalue">
                </el-input>
              </el-col>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span="3" style="margin-top: 20px;margin-left: 30px;">
          <el-button type="success" @click="submitClick" size="mini">确认筛选</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" size="small" stripe
                  v-loading="tableLoading"
                  element-loading-text="加载中..."
                  element-loading-spinner="el-icon-loading"
                  style="width: 100%;border: 1px solid #ebeef5;margin-top: 30px;">
          <el-table-column prop="cst_name" label="客户名称" ></el-table-column>
          <el-table-column prop="user_name" label="负责人" ></el-table-column>
          <el-table-column prop="cst_address" :show-overflow-tooltip="showOverflowTooltip" label="地址" width="200"></el-table-column>
          <!--<el-table-column prop="zj_input_capacity" label="装机容量" align="center"></el-table-column>-->
          <el-table-column prop="zj_price" label="合同金额" align="center"></el-table-column>
          <el-table-column :formatter="finishFormat" prop="h_is_finish" label="项目勘测" align="center"></el-table-column>
          <el-table-column :formatter="finishFormat" prop="d_is_finish" label="资料收集" align="center"></el-table-column>
          <!--<el-table-column prop="short_url" label="提取码" width="70" align="center"></el-table-column>-->
          <el-table-column prop="createTime" label="添加时间" width="100" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100"  align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.id)" type="text" size="small" >详情</el-button>
              <el-button :disabled="scope.row.h_is_finish == 0 && scope.row.d_is_finish == 0" type="text" @click="downLoadData(scope.row.short_url)" size="small">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination style="margin-top: 20px;"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage4"
                   :page-sizes="[10, 20, 30, 40,50]"
                   :page-size="100"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalNum">
    </el-pagination>
    <!--客户资料导出-->
    <el-row>
      <el-col :span="24" v-show="false">
        <el-table :data="tableCustomerDataList" size="small" stripe
                  id="outexcle"
                  style="width: 100%;border: 1px solid #ebeef5;margin-top: 30px;">
          <el-table-column prop="user_name" label="项目负责人" ></el-table-column>
          <el-table-column prop="cst_name" label="客户名称" ></el-table-column>
          <el-table-column prop="cst_phone" label="联系电话" ></el-table-column>
          <el-table-column prop="cst_address" :show-overflow-tooltip="showOverflowTooltip" label="项目地址" width="200"></el-table-column>
          <el-table-column prop="zj_input_format" label="组件规格" align="center"></el-table-column>
          <el-table-column prop="zj_input_num" label="组件数量" align="center"></el-table-column>
          <el-table-column prop="zj_input_capacity" label="装机容量" align="center"></el-table-column>
          <el-table-column prop="zj_price" label="合同金额" align="center"></el-table-column>
          <el-table-column prop="pay_sum" label="回款金额" align="center"></el-table-column>
          <el-table-column prop="xjxmsj" label="新建项目时间" align="center"></el-table-column>
          <el-table-column prop="qdhtsj" label="签订合同时间" align="center"></el-table-column>
          <el-table-column prop="sgwcsj" label="施工完成时间" align="center"></el-table-column>
          <el-table-column prop="bwwcsj" label="验收完成时间" align="center"></el-table-column>
          <el-table-column prop="pay_time" label="回款时间" align="center"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import axios from 'axios'
import values from '../../utils/values'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      options: [{
        value: 'today',
        label: '今天'
      }, {
        value: 'yesterday',
        label: '昨天'
      }, {
        value: 'thisWeek',
        label: '本周'
      }, {
        value: 'lastWeek',
        label: '上周'
      }, {
        value: 'thisMonth',
        label: '本月'
      }, {
        value: 'lastMonth',
        label: '上月'
      }, {
        value: 'thisYear',
        label: '本年'
      }, {
        value: 'total',
        label: '累计'
      }, {
        value: '自定义',
        label: '自定义'
      }],
      tdfwoptions: [
        {
          value: 'all',
          label: '全部(可见范围)'
        },
        {
          value: 1,
          label: '一级团队'
        },
        {
          value: 2,
          label: '二级团队'
        },
        {
          value: 3,
          label: '三级团队'
        },
        {
          value: 'one',
          label: '个人'
        }
      ],
      tableData: [],
      datevalue: [],
      contractoptions: [
        {
          value: 'all',
          label: '全部(可见范围)'
        },
        {
          value: '0',
          label: '新增项目'
        },
        {
          value: '2',
          label: '合同签订'
        },
        {
          value: '3',
          label: '施工完成'
        },
        {
          value: '4',
          label: '验收完成'
        },
        {
          value: '6',
          label: '回款完成'
        }
      ],
      overdueoptions: [
        {
          value: 'all',
          label: '全部(可见范围)'
        },
        {
          value: '1',
          label: '正常'
        },
        {
          value: '0',
          label: '逾期'
        }
      ],

      contractvalue: '全部(可见范围)',
      overduevalue: '全部(可见范围)',
      currentPage4: 1,
      totalNum: 0,
      scdStatus: 'all',
      overDueStatus: 'all',
      pagesizeNum: 10,
      pageNum: 1,
      dialogFormVisible: false,
      user: '',
      open_id: '',
      tableCustomerDataList: [], // 客户资料导出数据集合
      newTeamName: '全部(可见范围)', // 选择的团队名称
      newUserName: '全部(可见范围)', // 选择的成员名称
      newPlanStatus: '全部(可见范围)', // 选择的合同状态
      newOver: '全部(可见范围)', // 选择的逾期状态
      searchvalue: '', // 搜索文字
      disabled: true,
      showOverflowTooltip: true,
      tableLoading: false,
      teamLevel: 'all',
      teamId: 'all',
      planOwner: 'all',
      tjzqvalue: '累计',
      tdfwvalue: '全部(可见范围)',
      fuzerenvalue: '全部(可见范围)',
      teamname: '全部(可见范围)',
      teannameshow: true,
      fuzerenshow: true,
      teamoptions: [],
      teamoptionsAll: [],
      fuzerenoptions: [],
      fuzerenoptionsAll: [],
      team_all: [], // 当前所有团队的 id
      form: {
        cst_name: '',
        cst_phone: '',
        zj_input_format: '',
        zj_input_num: '',
        zj_input_capacity: '',
        zj_unit_price: '',
        zj_price: '',
        cst_remark: '',
        team_id: '',
        cst_address: ''
      },
      formLabelWidth: '120px',
      newteamoptions: [],
      teamselectvalue: ''
    }
  },
  methods: {
    finishFormat (row, column, cellValue, index) {
      return cellValue === 0 ? '否' : '是'
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesizeNum = val
      this.formlistdata()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.formlistdata()
    },
    // 时间选择
    tjzqChange (e, isExcute) {
      this.datevalue = []
      this.pageNum = 1
      this.tjzqvalue = e
      console.log('这里是时间范围变化===>>', e)
      if (this.tjzqvalue !== '自定义') {
        axios.get('/api/pc/select/date/' + e).then(res => {
          console.log(res)
          for (let i in res) {
            this.datevalue.push(res[i])
          }
          if (!isExcute) {

          }
        })
      } else {
        if (!isExcute) {

        }
      }
    },
    // 自定义时间
    selectdateChange (e) {
      this.pageNum = 1
      this.tjzqvalue = '自定义'
      this.datevalue = e
      console.log('时间统计', this.datevalue)
      this.customernformation()
    },
    // 选择团队范围时
    tdfwChange (e, openid, fn) {
      this.pageNum = 1
      console.log('团队范围变化', e)
      this.teamLevel = e
      this.tdfwvalue = e
      this.teamId = 'all'
      this.teamoptions = [
        {
          name: '全部(可见范围)'
        }
      ]
      for (let i = 0; i < this.teamoptionsAll.length; i++) {
        if (e === 'all') {
          this.planOwner = 'all'
          this.fuzerenvalue = '全部(可见范围)'
          this.teamoptions.push(this.teamoptionsAll[i])
          this.teannameshow = true
          this.fuzerenshow = true
        }
        if (e === Number(this.teamoptionsAll[i].level)) {
          this.fuzerenvalue = '全部(可见范围)'
          this.planOwner = 'all'
          this.teannameshow = false
          this.fuzerenshow = true
          this.teamoptions.push(this.teamoptionsAll[i])
          console.log('这里是团队范围变化=====', this.teamoptionsAll[i])
        }
        this.teamname = this.teamoptions[0].name
      }
      if (e === 'one') {
        this.planOwner = this.fuzerenID
        this.teannameshow = true
        this.teamoptions = [
          {
            name: '个人',
            id: 'one'
          }
        ]
        this.fuzerenoptions = []
        this.teamname = this.teamoptions[0].name
        for (let i = 0; i < this.fuzerenoptionsAll.length; i++) {
          if (String(e) === String(this.fuzerenoptionsAll[i].team_id)) {
            this.fuzerenoptions.push(this.fuzerenoptionsAll[i])
            this.fuzerenshow = false
            console.log('进来了', this.fuzerenshow)
          }
        }
        this.fuzerenvalue = this.fuzerenoptions[0].name
        this.planOwner = this.fuzerenoptions[0].openid
      } else {
        this.fuzerenshow = true
        this.fuzerenvalue = '全部(可见范围)'
      }

      if (openid) {
        if (fn) {
          this.fuzerenChange(openid, fn)
        } else {
          this.fuzerenChange(openid)
        }
      } else {

      }
    },
    // 选择团队名称时
    teannameChange (e) {
      this.pageNum = 1
      this.teamId = e
      for (let i in this.teamoptionsAll) {
        if (this.teamoptionsAll[i].id === e) {
          this.newTeamName = this.teamoptionsAll[i].name
          break
        }
      }
      console.log('团队名称ID:', e, this.newTeamName)
      if (e === 'one') {
        console.log('选择的是个人')
        this.fuzerenoptions = [{openid: 'one', name: '个人项目信息'}]
        this.fuzerenoptionsAll = [{openid: 'one', name: '个人项目信息'}]
        this.fuzerenvalue = '个人项目信息'
        this.teamLevel = 'one'
        return
      }
      if (e === 'all') {
        console.log('选择的是全部')
        this.fuzerenvalue = '全部(可见范围)'
        this.teamLevel = 'all'
        this.getTeamUser(this.team_all)
        return
      }
      this.teamLevel = -1

      let obj = {
        array: this.team_all,
        companyId: e
      }

      this.fuzerenvalue = '全部(可见范围)'
      axios.post('/api/pc/teamUser/userChooseAndUser', obj)
        .then(res => {
          console.log('获取选择的公司数据成功', res)
          if (res && res.length > 0) {
            this.getTeamUser(res)
          }
        })
        .catch(err => {
          console.log('获取选择的公司数据失败')
          console.log(err)
        })

      //      this.fuzerenoptions = [
      //        {
      //          name: '全部(可见范围)'
      //        }
      //      ]
      //      if (!e) {
      //        this.fuzerenshow = true
      //        this.teamId = 'all'
      //      }
      //      this.fuzerenvalue = this.fuzerenoptions[0].name
      //      this.planOwner = 'all'
      //      for (let i = 0; i < this.fuzerenoptionsAll.length; i++) {
      //        if (e === Number(this.fuzerenoptionsAll[i].team_id)) {
      //          this.fuzerenoptions.push(this.fuzerenoptionsAll[i])
      //          this.fuzerenshow = false
      //          console.log('进来了', this.fuzerenshow)
      //        }
      //      }
    },
    requestdata (fn, voidGetDate, openid) {
      if (!voidGetDate) {
        if (openid) {
          this.getDateData(fn, openid)
        } else {
          this.getDateData(fn)
        }
      } else {
        if (openid) {
          this.getTeamData(fn, openid)
        } else {
          this.getTeamData(fn)
        }
      }
    },

    getDateData (fn, openid) {
      this.datevalue = []
      axios.get('/api/pc/select/date/' + 'total').then(res => {
        this.datevalue.push(res.beginDate, res.endDate)
        console.log('统计周期', this.datevalue)
        this.getTeamData(fn, openid)
      })
    },
    //  获取团队成员
    getTeamUser (teamId) {
      if (!teamId || teamId.length === 0) {
        return
      }
      this.fuzerenoptions = []
      this.fuzerenoptionsAll = []

      console.log(this.fuzerenoptionsAll.length, this.fuzerenoptions.length)
      axios.post('/api/pc/teamUser/getTeamUser', {teamId}).then((data) => {
        console.log('获取团队成员成功', data)

        this.fuzerenoptions = data
        this.fuzerenoptionsAll = data
        this.fuzerenoptions.unshift({openid: 'all', name: '全部(可见范围)'})
      }).catch((err) => {
        console.log('获取团队成员失败', err)
      })
    },
    //  获取子团队
    get_son () {
      let openId = this.user.openid
      let companyId = this.user.company_id
      if (!openId || !companyId) {
        return
      }
      let obj = {
        openId,
        companyId
      }

      axios.post('/api/teamUser/manageTeam', obj).then((data) => {
        console.log('获取子团队成功', data)
        if (data && data.length > 0) {

        } else {
          this.tableLoading = false
        }
      }).catch((err) => {
        console.log('获取子团队失败', err)
      })
    },
    //  最初获取子团队和团队成员
    getTeamData (fn, openid) {
      this.teamoptionsAll = []
      this.teamoptions = []
      this.fuzerenoptions = []
      this.fuzerenoptionsAll = []
      let openId = this.user.openid
      let companyId = this.user.company_id
      if (!openId || !companyId) {
        return
      }
      let obj = {
        openId,
        companyId
      }

      axios.post('/api/teamUser/manageTeam', obj).then((data) => {
        console.log('获取子团队成功', data)
        if (data.length === 0) {
          console.log('是业务员')
          this.teamoptionsAll = [{id: 'one', name: '个人项目信息'}]
          this.teamoptions = [{id: 'one', name: '个人项目信息'}]
          this.fuzerenoptionsAll = [{openid: 'one', name: '个人项目信息'}]
          this.fuzerenoptions = [{openid: 'one', name: '个人项目信息'}]
          this.fuzerenvalue = '个人项目信息'
          this.teamname = '个人项目信息'
          this.newTeamName = '个人项目信息'
          this.newUserName = '个人项目信息'
          return
        }
        this.team_all = data[0]
        data[1].forEach(item => {
          this.teamoptionsAll.push(item)
          this.teamoptions.push(item)
        })
        this.teamoptionsAll.push({id: 'one', name: '个人项目信息'})
        this.teamoptionsAll.unshift({id: 'all', name: ' 全部(可见范围)'})
        this.teamoptions.push({id: 'one', name: '个人项目信息'})
        this.teamoptions.unshift({id: 'all', name: ' 全部(可见范围)'})
        if (data && data.length > 0) {
          // 获取团队成员
          axios.post('/api/pc/teamUser/getTeamUser', {teamId: data[0]}).then((data) => {
            data.forEach(item => {
              this.fuzerenoptions.push(item)
              this.fuzerenoptionsAll.push(item)
            })

            this.fuzerenoptions.unshift({openid: 'all', name: '全部(可见范围)'})
            this.fuzerenoptionsAll.unshift({openid: 'all', name: '全部(可见范围)'})
            console.log('获取团队成员成功', data)
          })
        } else {
          this.tableLoading = false
        }
      }).catch((err) => {
        console.log('获取子团队失败', err)
        this.tableLoading = false
      })

      //      axios.get('/api/pc/select/team').then(res => {
      //        console.log('团队范围', res)
      //        res.teams.forEach(item => {
      //          this.teamoptionsAll.push(item)
      //          this.teamoptions.push(item)
      //        })
      //        res.agents.forEach(item => {
      //          this.fuzerenoptions.push(item)
      //          this.fuzerenoptionsAll.push(item)
      //        })
      console.log('团队名称', this.teamoptions)
      console.log('负责人', this.fuzerenoptions)

      if (openid) {
        this.tdfwChange('one', openid, fn)
      } else {
        if (fn) {
          fn()
        }
      }

      //      })
    },
    //  团队成员筛选
    fuzerenChange (e, fn) {
      this.pageNum = 1
      this.fuzerenID = e
      for (let i in this.fuzerenoptionsAll) {
        if (this.fuzerenoptionsAll[i].openid === e) {
          this.newUserName = this.fuzerenoptionsAll[i].name
        }
      }
      console.log('当前选择的成员', e, this.newUserName)
      this.planOwner = e
      if (e === 'all') {
        this.planOwner = 'all'
      }
      if (fn) {
        fn()
      } else {

      }
    },
    //  合同状态筛选
    contractChange (e) {
      this.pageNum = 1
      this.scdStatus = e
      for (let i in this.contractoptions) {
        if (this.contractoptions[i].value === e) {
          this.newPlanStatus = this.contractoptions[i].label
        }
      }
      console.log('当前合同状态', this.scdStatus, '==>', this.newPlanStatus)
    },
    //  逾期状态筛选
    overdueChange (e) {
      this.pageNum = 1
      this.overDueStatus = e
      for (let i in this.overdueoptions) {
        if (this.overdueoptions[i].value === e) {
          this.newOver = this.overdueoptions[i].label
        }
      }
      console.log('当前逾期状态', e, this.newOver)
    },
    //  获取数据
    formlistdata () {
      this.tableLoading = true
      setTimeout(() => {
        let parameter = {
          beginDate: this.datevalue[0],
          endDate: this.datevalue[1],
          teamLevel: String(this.teamLevel),
          teamId: String(this.teamId),
          planOwner: this.planOwner,
          scdStatus: this.scdStatus,
          overDueStatus: this.overDueStatus,
          pageNumber: this.pageNum,
          pageSize: this.pagesizeNum,
          search: this.searchvalue,
          type: 'customer'
        }
        this.$store.state.customerData.parameter = parameter
        let time = ''
        let tjzqvalue = ''
        for (let i in this.options) {
          if (this.tjzqvalue === '累计') {
            time = '累计'
            tjzqvalue = 'total'
            break
          }
          if (this.options[i].label === this.tjzqvalue) {
            time = this.options[i].label
            tjzqvalue = this.options[i].value
            break
          }
          if (this.options[i].value === this.tjzqvalue) {
            time = this.options[i].label
            tjzqvalue = this.tjzqvalue
            break
          }
        }
        console.log('输出时间', time, tjzqvalue)
        this.$store.state.customerData.show_info = {
          tjzqvalue: tjzqvalue, // 显示的英文时间
          time: time, // 显示的中文时间
          newTeamName: this.newTeamName, // 公司名称
          newUserName: this.newUserName, // 成员名称
          newPlanStatus: this.newPlanStatus, // 合同状态
          newOver: this.newOver, // 逾期状态
          soso: this.searchvalue // 搜索文字
        }

        console.log('当前选择的公司名称', this.$store.state.customerData.show_info.newTeamName)
        this.$store.state.customerData.isStart = true

        axios.post('/api/pc/planSchedulePc', parameter).then(res => {
          console.log('获取数据成功1', res)
          this.tableLoading = false
          this.tableData = res.content
          this.totalNum = res.totalCount
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].createTime = this.tableData[i].createTime.slice(0, 10)
          }
        }, () => {
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      }, 300)
    },
    //  有缓存时的数据获取
    vuex_getInfo () {
      this.tableLoading = true
      let parameter = this.$store.state.customerData.parameter

      this.newTeamName = this.$store.state.customerData.show_info.newTeamName
      this.newUserName = this.$store.state.customerData.show_info.newUserName
      this.newPlanStatus = this.$store.state.customerData.show_info.newPlanStatus
      this.newOver = this.$store.state.customerData.show_info.newOver

      this.teamname = this.$store.state.customerData.show_info.newTeamName // 团队名称筛选
      this.fuzerenvalue = this.$store.state.customerData.show_info.newUserName // 团队成员筛选
      this.contractvalue = this.$store.state.customerData.show_info.newPlanStatus // 合同状态
      this.overduevalue = this.$store.state.customerData.show_info.newOver // 逾期状态
      this.searchvalue = this.$store.state.customerData.show_info.soso // 搜索

      this.tjzqvalue = this.$store.state.customerData.show_info.time // 时间
      this.datevalue = [this.$store.state.customerData.parameter.beginDate, this.$store.state.customerData.parameter.endDate]
      console.log('输出时间数组', this.datevalue)

      this.teamLevel = parameter.teamLevel
      this.teamId = parameter.teamId
      this.planOwner = parameter.planOwner
      this.scdStatus = parameter.scdStatus
      this.overDueStatus = parameter.overDueStatus
      this.pageNum = parameter.pageNumber
      this.pagesizeNum = parameter.pageSize
      this.searchvalue = parameter.search
      axios.post('/api/pc/planSchedulePc', parameter).then(res => {
        console.log('获取数据成功2', res)
        this.tableLoading = false
        this.tableData = res.content
        this.totalNum = res.totalCount
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].createTime = this.tableData[i].createTime.slice(0, 10)
        }
      }, () => {
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 客户资料导出返回数据方法
    customernformation () {
      this.show1 = true
      setTimeout(() => {
        let parameter = {
          beginDate: this.datevalue[0],
          endDate: this.datevalue[1],
          teamLevel: String(this.teamLevel),
          teamId: String(this.teamId),
          planOwner: this.planOwner,
          scdStatus: this.scdStatus,
          overDueStatus: this.overDueStatus,
          search: this.searchvalue,
          type: 'customer'
        }
        axios.post('/api/customerDataPc/excleExport', parameter).then(res => {
          this.tableLoading = false
          this.tableCustomerDataList = res
          for (let i = 0; i < this.tableCustomerDataList.length; i++) {
            if (this.tableCustomerDataList[i].pay_time) {
              this.tableCustomerDataList[i].pay_time = this.tableCustomerDataList[i].pay_time.slice(0, 10)
            }
            if (this.tableCustomerDataList[i].xjxmsj) {
              this.tableCustomerDataList[i].xjxmsj = this.tableCustomerDataList[i].xjxmsj.slice(0, 10)
            }
            if (this.tableCustomerDataList[i].qdhtsj) {
              this.tableCustomerDataList[i].qdhtsj = this.tableCustomerDataList[i].qdhtsj.slice(0, 10)
            }
            if (this.tableCustomerDataList[i].sgwcsj) {
              this.tableCustomerDataList[i].sgwcsj = this.tableCustomerDataList[i].sgwcsj.slice(0, 10)
            }
            if (this.tableCustomerDataList[i].bwwcsj) {
              this.tableCustomerDataList[i].bwwcsj = this.tableCustomerDataList[i].bwwcsj.slice(0, 10)
            }
            // 增加一列装机容量
            this.tableCustomerDataList[i].zj_input_capacity = this.tableCustomerDataList[i].zj_input_format * this.tableCustomerDataList[i].zj_input_num / 1000
          }
          console.log('客户资料导出数据11111111', this.tableCustomerDataList)
        }, () => {
        }).catch(() => {
        })
      }, 300)
    },
    searchChange () {
      this.formlistdata()
    },
    handleClick (id) {
      console.log('id:')
      console.log(id)
      // 通过替换生成新url,在新tab里打开网页
      const href = window.location.href.replace('CustomerData', 'CustomerDetails?planId=' + id)
      window.open(href)
      // this.$router.push({path: '/CustomerDetails', query: {planId: id}})
    },
    downLoadData (tqurl) {
      console.log('777777', tqurl)
      let uat = '/test'
      let context = 'https://mp.xiaosolar.cn/backend-api'
      // 判断环境
      let href = window.location.href

      if (href.indexOf(uat) !== -1) {
        context = 'https://mpa.xiaosolar.cn/backend-api' // 测试环境
      }

      let url = context + '/backend/file/download/' + tqurl
      window.location.href = url
    },
    //  点击确认筛选时
    batchDownloadData () {
      const tableData = this.tableCustomerDataList
      const shortUrlArray = []
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].h_is_finish !== 0 || tableData[i].d_is_finish !== 0) {
          shortUrlArray.push(tableData[i].short_url)
        }
      }
      console.log(shortUrlArray)
      let uat = '/test'
      let context = 'https://mp.xiaosolar.cn/backend-api'
      // 判断环境
      let href = window.location.href
      if (href.indexOf(uat) !== -1) {
        context = 'https://mpa.xiaosolar.cn/backend-api' // 测试环境
      }

      axios.post(context + '/backend/file/batchDownload', {shortUrlArray: shortUrlArray}).then(res => {
        console.log(res)
        window.location.href = context + '/backend/file/batchDownload' + '?path=' + res
      })
    },
    submitClick () {
      this.formlistdata()
      this.customernformation()
    },
    newcustomerClick () {
      if (this.form.cst_name === '') {
        this.$message.error('客户名称不能为空')
        return
      }
      this.dialogFormVisible = false
      axios.post('/api/pc/planPc', this.form).then(res => {
        console.log('新建客户保存', res)
        this.requestdata(this.formlistdata)
        this.form = {
          cst_name: '',
          cst_phone: '',
          zj_input_format: '',
          zj_input_num: '',
          zj_input_capacity: '',
          zj_unit_price: '',
          zj_price: '',
          cst_remark: '',
          team_id: this.form.team_id,
          cst_address: ''
        }
      })
    },
    teamdatalist () {
      axios.get('api/team/user/' + this.open_id).then(res => {
        for (let i = 0; i < res.length; i++) {
          let obj = {
            value: res[i].id,
            label: res[i].name
          }
          this.newteamoptions.push(obj)
        }
        console.log('团队下拉列表', res)
        this.teamselectvalue = res[0].name
        this.form.team_id = res[0].id
      })
    },
    teamselectChange (e) {
      console.log('8444444444444eeeeeeeeeeee', this.newteamoptions)
      this.form.team_id = e
    },
    // 导出excle
    exportExcel () {
      if (this.tableCustomerDataList.length < 1) {
        this.$message({
          message: '导出数据为空，重新选择条件并确认',
          type: 'warning'
        })
        return
      }
      var wb = XLSX.utils.table_to_book(document.querySelector('#outexcle'))
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '客户详情.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    countCapacity () {
      let zjFormat = this.form.zj_input_format
      let zjNum = this.form.zj_input_num
      if (zjFormat && zjNum) {
        this.form.zj_input_capacity = (zjFormat * zjNum / 1000).toFixed(2).toString()
      }
    }
  },
  mounted () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    this.user = sessionUser
    console.log('user表', sessionUser)
    this.open_id = sessionUser.openid
    let params = this.$route.query

    // 判读是否有缓存
    if (this.$store.state.customerData.isStart) {
      console.log('有缓存')
      this.getTeamData(this.vuex_getInfo)
      return
    }
    console.log('这里是传过来的负责人===>>', params)

    if (Object.keys(params).length !== 0) {
      this.requestdata(this.tjzqChange('total', false), true, params.openid)
    } else {
      this.requestdata(this.formlistdata)
    }

    this.teamdatalist()
    this.customernformation()
  }
}
</script>
<style scoped>
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
  .el-date-editor .el-range-separator {
    width: 10%;
  }
  .el-card__body {
    padding: 20px !important;
  }
  .el-table td {
    border-right: 1px solid #ebeef5 !important;
  }
  .el-table th.is-leaf {
    border-right: 1px solid #ebeef5 !important;
  }
  .one-txt-cut{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .has-gutter>tr{
    background: #f5f8f8;
  }
  .el-form-item {
    margin-bottom: 10px !important;
  }
</style>
