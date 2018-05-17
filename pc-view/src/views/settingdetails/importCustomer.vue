<template>
    <div>
        <div ref="hotPreview">
          <el-card class="box-card">
            <div>
              当前选中的团队为：<span v-html="selectTeamName"></span>
            </div>
            <div style="background-color:white">
                <HotTable ref="hotTable" :root="root" :settings="hotSettings"></HotTable>
            </div>
            <div>
                <el-button @click="getTableData()" size="medium" style="margin-top: 40px;background: #67c23a;color: #fff;">导入</el-button>
            </div>
            <div>
                导入规则：<br>
                1  导入功能表格第一行默认一条示例客户，可删除<br>
                2  右击表格，进行插入行、删除行等操作<br>
                3  通过“ctrl+V”可以将excel表格中的内容添加到表格内，也可以手动输入<br>
                4  项目负责人列单元格黄色时表示为空或者改团队无此人<br>
                5  客户名称列单元格黄色时表示内容为空<br>
                6  联系电话'、'组件规格'、'组件数量'、'合同金额'、'回款金额'这几列只能填入数字,'组件规格'和'组件数量'不能为0<br>
                7  回款金额不能大于合同金额
            </div>
          </el-card>
        </div>
        <!-- 选择团队窗口 -->
        <div ref="selectTeam" style="background-color:white">
           <el-card class="box-card">
              <div style="padding-bottom: 20px;font-weight: bolder;">
                请选择客户导入团队：
              </div>
               <el-col :span="8" class="y-Center">
                    <div class="fl" style="font-size: 14px;margin-right: 20px;">团队范围</div>
                    <el-select @change="tdfwChange" size="small" class="fl" v-model="tdfwvalue">
                    <el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8" class="y-Center">
                    <div class="fl"  style="font-size: 14px;width: 100px;">团队名称</div>
                    <el-select  @change="teamNameChange" size="small" class="fl" v-model="teamname">
                    <el-option v-for="(item, index) in teamoptions" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                    </el-select>
                </el-col>
                <el-button @click="saveTeamName()" size="medium" style="background: #67c23a;color: #fff;">确认</el-button>
           </el-card>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import HotTable from '@handsontable/vue'
// import values from '../../utils/values'
// import '../../../static/js/datepicker-zh-CN.js'
export default {
  data: function () {
    return {
      root: 'test-hot',
      hotSettings: {},
      tdfwoptions: [],
      tdfwvalue: '',
      teamname: '',
      teamoptionsAll: [],
      teamoptions: [],
      selectTeam: '',
      allTeamData: {},
      selectTeamName: ''
    }
  },
  components: {
    HotTable
  },
  mounted: function () {
    // let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    const _this = this
    _this.$refs.hotPreview.style.display = 'none'
    axios.post('/api/pc/customerDataPc/getUserManageTeam').then(response => {
      console.log('getUserManageTeam', response)
      if (response.maxLevel === 0) {
        // 公司级别管理员
        _this.tdfwoptions = [
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
          }
        ]
      } else if (response.maxLevel === 1) {
        // 公司级别管理员
        _this.tdfwoptions = [
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
          }
        ]
      } else if (response.maxLevel === 2) {
        // 公司级别管理员
        _this.tdfwoptions = [
          {
            value: 2,
            label: '二级团队'
          },
          {
            value: 3,
            label: '三级团队'
          }
        ]
      } else if (response.maxLevel === 3) {
        // 公司级别管理员
        _this.tdfwoptions = [
          {
            value: 3,
            label: '三级团队'
          }
        ]
      }
    })
    // 获取团队信息
    _this.getTeamData()
  },
  methods: {
    // 获取表格内所有数据
    getTableData: function () {
      const _this = this
      this.$refs.hotTable.table.validateCells(function (callback) {
        if (callback === false) {
        //   confirm('表格内仍有错误项，请按照规则填写后提交')
          _this.$message.error('表格内仍有错误项，请按照规则填写后提交')
        } else {
          let r = confirm('可以提交，确认提交吗？')
          if (r === true) {
            let tableData = _this.$refs.hotTable.table.getData()
            let importData = []
            let array = ['', '', '', '', '', '', '', '', '', '', '', '', '', '']
            for (let i = 0; i < tableData.length; i++) {
              if (tableData[i].toString() !== array.toString()) {
                tableData[i].unshift(_this.selectTeam)
                importData.push(tableData[i])
              }
            }
            // console.log(importData)
            // let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
            // 把json格式的数据传到后台
            return axios.post('/api/pc/customerDataPc/importExcelData/' + _this.selectTeam, importData).then(response => {
              if (response === 'import success') {
                confirm('导入成功')
              } else {
                confirm('导入失败')
              }
            })
          }
        }
      })
    },
    // 去除字符串两边空格
    trim: function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    // Empty validator
    emptyValidator: function (value, callback) {
      if (!value || value.length === 0) {
        callback(false)
      } else {
        callback(true)
      }
    },
    dropdownValidator: function (value, callback) {
      if (value === '') {
        console.log('dropdown 1')
        callback(false)
      } else {
        console.log('dropdown 2')
        callback(true)
      }
    },
    // 上传excel,导数据入表格
    uploadExcel (event) {
      const files = event.target.files
      console.log(files)
      // 定义acceptFile来保存检查文件类型的结果
      let acceptFile = true
      // const BreakException = {}
      let file
      let fileArray = []
      // try {
      for (var i = 0; i < files.length; i++) {
        file = files[i]
        fileArray.push(file)
        // 判断上传的文件是不是csv格式
        // https://www.sitepoint.com/mime-types-complete-list/
        // https://blogs.msdn.microsoft.com/vsofficedeveloper/2008/05/08/office-2007-file-format-mime-types-for-http-content-streaming-2/
        // if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        //   acceptFile = false
        //   // 跳出循环
        //   throw BreakException
        // }
      }
      // } catch (e) {
      //   if (e !== BreakException) throw e
      // }
      if (acceptFile === false) {
        alert('请上传csv或excel文件')
      } else {
        // 上传文件至服务器
        const uploaders = fileArray.map(file => {
          const formData = new FormData()
          formData.append('file', file)
          return axios.post('/backend/uploadExcel', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => {
            console.log(response.data)
          })
        })
        axios.all(uploaders).then(() => {
          alert('upload success')
        })
      }
    },
    // 确认团队后加载表格数据
    loadTable () {
      const _this = this
      // 从后台获取该用户下的所有团队和成员信息
      // let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
      // axios.get('/api/pc/customerDataPc/getTeamAndUser/' + sessionUser.openid).then((resp) => {
      // console.log(resp)
      // resp.agents 公司所有用户信息
      // resp.teams 公司所有团队信息
      let teamArray = []
      let userArray = []
      console.log(_this.allTeamData)
      for (let i = 0; i < _this.allTeamData.teams.length; i++) {
        if (_this.allTeamData.teams[i].id === _this.selectTeam) {
          _this.selectTeamName = _this.allTeamData.teams[i].name
        }
      }
      for (let i = 0; i < _this.allTeamData.agents.length; i++) {
        if (_this.allTeamData.agents[i].team_id === _this.selectTeam) {
          userArray.push(_this.allTeamData.agents[i].name)
        }
        // for (let j = 0; j < teamArray.length; j++) {
        //   if(_this.allTeamData.agents[i].team_id === teamArray[j].id){
        //     userArray[j].push(_this.allTeamData.agents[i].name)
        //   }
        // }
      }
      // for (let i = 0; i < resp.teams.length; i++) {
      //   teamArray.push(resp.teams[i].teamName)
      //   userArray[i] = []
      // }
      // for (let i = 0; i < resp.agents.length; i++) {
      //   for (let j = 0; j < teamArray.length; j++) {
      //     for (let k = 0; k < resp.agents[i].teams.length; k++) {
      //       if (resp.agents[i].teams[k].teamName === teamArray[j]) {
      //         userArray[j].push(resp.agents[i].name)
      //       }
      //     }
      //   }
      // }
      console.log('teamArray', teamArray)
      console.log('userArray', userArray)
      // let selectOption = ''
      // for(let i=0;i<teamArray.length;i++){
      //   //   _this.$refs.selectTeam.append("<option value='" + teamArray[i] + "'>" + teamArray[i] + "</option>")
      //     selectOption += '<option value=' + teamArray[i] + '>' + teamArray[i] + '</option>'
      // }
      // _this.$refs.selectTeam.innerHtml = selectOption
      let emptyRow = []
      emptyRow[0] = ['张三', '示例客户', 13815165465, '上海市徐汇区xxx', 285, 10, '土瓦，客户要多装', 20000, 10000, '2018-05-02', '2018-05-03', '2018-05-04', '2018-05-05', '2018-05-06']
      for (let i = 1; i < 100; i++) {
        emptyRow.push(['', '', '', '', '', '', '', '', '', '', '', '', '', ''])
      }
      console.log(emptyRow)
      const tableObj = this.$refs.hotTable.table
      this.hotSettings = {
        data: emptyRow,
        // colHeaders: ['所属团队（必填）', '项目负责人（必填）', '客户名称（必填）', '联系电话（选填）', '项目地址（选填）', '组件规格（W）（选填）', '组件数量（块）（选填）', '备注（选填）', '合同金额（元）（选填）', '回款金额（元）（选填）', '新建项目时间（选填）', '签订合同时间（选填）', '施工完成时间（选填）', '并网完成时间（选填）', '回款时间（选填）'],
        colHeaders: ['项目负责人（必填）', '客户名称（必填）', '联系电话（选填）', '项目地址（选填）', '组件规格（W）（选填）', '组件数量（块）（选填）', '备注（选填）', '合同金额（元）（选填）', '回款金额（元）（选填）', '新建项目时间（选填）', '签订合同时间（选填）', '施工完成时间（选填）', '并网完成时间（选填）', '回款时间（选填）'],
        columns: [
          {
            // 项目负责人（必填）
            // type: 'dropdown',
            // source: ['张三'],
            type: 'dropdown',
            validator: _this.dropdownValidator
          },
          {
            // 客户名称（必填）
            type: 'text',
            validator: _this.emptyValidator
          },
          {
            // 联系电话（选填）
            type: 'numeric'
          },
          {
            // 项目地址（选填）
            type: 'text'
          },
          {
            // 组件规格（W）（选填）
            type: 'numeric'
          },
          {
            // 组件数量（块）（选填）
            type: 'numeric'
          },
          {
            // 备注（选填）
            type: 'text'
          },
          {
            // 合同金额（元）（选填）
            type: 'numeric'
          },
          {
            // 回款金额（元）（选填）
            type: 'numeric'
          },
          {
            // 新建项目时间（选填）
            type: 'date',
            dateFormat: 'YYYY-MM-DD'
          },
          {
            // 签订合同时间（选填）
            type: 'date',
            dateFormat: 'YYYY-MM-DD'
          },
          {
            // 施工完成时间（选填）
            type: 'date',
            dateFormat: 'YYYY-MM-DD'
          },
          {
            // 并网完成时间（选填）
            type: 'date',
            dateFormat: 'YYYY-MM-DD'
          },
          {
            // 回款完成（选填）
            type: 'date',
            dateFormat: 'YYYY-MM-DD'
          }
        ],
        contextMenu: {
          items: {
            'row_above': {
              name: '向上插入一行'
            },
            'row_below': {
              name: '向下插入一行'
            },
            'remove_row': {
              name: '删除行'
            },
            'undo': {
              name: '撤销'
            },
            'redo': {
              name: '重做'
            },
            'copy': {
              name: '复制'
            }
          }
        },
        rowHeaders: true,
        autoRowSize: true,
        // minRows: 100,
        // minSpareRows: 1,
        fillHandle: {
          autoInsertRow: true
        },
        cells: function (row, column) {
          var cellMeta = {}
          // if (column === 0) {
          //   cellMeta.type = 'dropdown'
          //   cellMeta.source = teamArray
          // } else if (column === 1) {
          //   cellMeta.type = 'dropdown'
          //   let index = teamArray.indexOf(tableObj.getDataAtCell(row, 0))
          //   if (index >= 0) {
          //     cellMeta.source = userArray[index]
          //   } else {
          //     cellMeta.source = []
          //   }
          // }
          if (column === 0) {
            if (tableObj.isEmptyRow(row)) {
              cellMeta.className = ''
            } else {
              if (tableObj.getDataAtCell(row, 0) !== '') {
                if (Array.indexOf(userArray, tableObj.getDataAtCell(row, 0)) < 0) {
                  cellMeta.className = 'yellow'
                } else {
                  cellMeta.className = ''
                }
              } else {
                cellMeta.className = 'yellow'
              }
            }
            cellMeta.source = userArray
          } else if (column === 1) {
            // 如果这行是空行，不判断客户名称是否为空
            if (tableObj.isEmptyRow(row)) {
              cellMeta.valid = true
            } else {
              if (tableObj.getDataAtCell(row, 1) === '') {
                cellMeta.valid = false
              } else {
                cellMeta.valid = true
              }
            }
          } else if (column === 4) {
            if (tableObj.getDataAtCell(row, 4) === 0) {
              cellMeta.valid = false
            }
          } else if (column === 5) {
            if (tableObj.getDataAtCell(row, 5) === 0) {
              cellMeta.valid = false
            }
          } else if (column === 8) {
            // 如果合同金额和回款金额都不为空
            if (tableObj.getDataAtCell(row, 7) !== '' && tableObj.getDataAtCell(row, 8) !== '') {
              if (tableObj.getDataAtCell(row, 8) > tableObj.getDataAtCell(row, 7)) {
                cellMeta.valid = false
              }
            }
          } else if (column === 9 || column === 10 || column === 11 || column === 12 || column === 13) {
            if (tableObj.getDataAtCell(row, 9) === '' || tableObj.getDataAtCell(row, 10) === '' || tableObj.getDataAtCell(row, 11) === '' || tableObj.getDataAtCell(row, 12) === '' || tableObj.getDataAtCell(row, 13) === '') {
              cellMeta.valid = true
            }
          }
          return cellMeta
        }
      }

      this.$refs.hotTable.table.addHook('beforeValidate', function (val, row, prop) {
        if (_this.$refs.hotTable.table.isEmptyRow(row)) {

        }
      })
      this.$refs.hotTable.table.addHook('afterValidate', function (isValid, value, row, prop, source) {
        if (!isValid) {
          if (_this.$refs.hotTable.table.isEmptyRow(row)) {
            console.log()
            return true
          } else {
            console.log(isValid, value, row, prop, source)
          }
        }
      })
      _this.$refs.hotPreview.style.display = ''
    // }, (response) => {
    // this.$message.error(response.message ? response.message : '系统或网络异常')
    // })
    },
    tdfwChange (e) {
      if (e === 'all') {
        this.teamoptions = this.teamoptionsAll
      } else if (e === 1 || e === 2 || e === 3) {
        let array = []
        for (let i = 0; i < this.teamoptionsAll.length; i++) {
          if (this.teamoptionsAll[i].level === e) {
            array.push(this.teamoptionsAll[i])
          }
        }
        this.teamoptions = array
      }
    },
    getTeamData () {
      axios.get('/api/pc/select/team').then(res => {
        console.log('团队范围', res)
        this.allTeamData = res
        res.teams.forEach(item => {
          this.teamoptionsAll.push(item)
        })
      })
    },
    teamNameChange (e) {
      this.selectTeam = e
    },
    saveTeamName () {
      if (this.selectTeam !== '') {
        this.$refs.selectTeam.style.display = 'none'
        this.loadTable()
      } else {
        this.$message.error('请先选择正确的团队信息')
      }
    }
  }
}
</script>
<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style>
#test-hot {
  width: 100%;
  height: 600px;
  overflow: hidden;
}
.handsontable td.htInvalid {
  background-color: yellow !important;
}
.handsontable .yellow {
  background: yellow;
}
</style>
