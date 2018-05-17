<template>
    <div id="hot-preview">
        <div style="background-color:white">
            <HotTable ref="hotTable" :root="root" :settings="hotSettings"></HotTable>
        </div>
        <div>
            <el-button @click="getTableData()" size="medium" style="margin-top: 40px;background: #67c23a;color: #fff;">导入</el-button>
        </div>
        <div>
            导入规则：</br>
                1.导入功能表格第一行默认一条示例客户，可删除</br>
                2.右击表格，进行插入行、删除行操作</br>
                3.单元格黄色表示单元格内容出错，团队或负责人不匹配</br>
                4.所属团队列单元格黄色时表示为空或者团队名称有错误，请从下拉框内选择所属团队</br>
                5.项目负责人列单元格黄色时表示为空或者改团队无此人</br>
                6.客户名称列单元格黄色时表示内容为空</br>
                7.'联系电话'、'组件规格'、'组件数量'、'合同金额'、'回款金额'这几列只能填入数字,'组件规格'和'组件数量'不能为0</br>
                8.回款金额不能大于合同金额
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import HotTable from '@handsontable/vue'
import values from '../../utils/values'
export default {
  data: function () {
    return {
      root: 'test-hot',
      hotSettings: {}
    }
  },
  components: {
    HotTable
  },
  mounted: function () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    const _this = this
    // 从后台获取该用户下的所有团队和成员信息
    axios.get('/api/pc/customerDataPc/getTeamAndUser/' + sessionUser.openid).then((resp) => {
      console.log(resp)
      // resp.agents 公司所有用户信息
      // resp.teams 公司所有团队信息
      let teamArray = []
      let userArray = []
      for (let i = 0; i < resp.teams.length; i++) {
        teamArray.push(resp.teams[i].teamName)
        userArray[i] = []
      }
      for (let i = 0; i < resp.agents.length; i++) {
        for (let j = 0; j < teamArray.length; j++) {
          for (let k = 0; k < resp.agents[i].teams.length; k++) {
            if (resp.agents[i].teams[k].teamName === teamArray[j]) {
              userArray[j].push(resp.agents[i].name)
            }
          }
        }
      }
      console.log(userArray)
      const tableObj = this.$refs.hotTable.table
      this.hotSettings = {
        data: [
          ['上海分公司', '张三', '示例客户', 13815165465, '上海市徐汇区xxx', 285, 10, '土瓦，客户要多装', 20000, 10000, '2018-05-02', '2018-05-03', '2018-05-04', '2018-05-05', '2018-05-06']
        ],
        colHeaders: ['所属团队（必填）', '项目负责人（必填）', '客户名称（必填）', '联系电话（选填）', '项目地址（选填）', '组件规格（W）（选填）', '组件数量（块）（选填）', '备注（选填）', '合同金额（元）（选填）', '回款金额（元）（选填）', '新建项目时间（选填）', '签订合同时间（选填）', '施工完成时间（选填）', '并网完成时间（选填）', '回款时间（选填）'],
        columns: [
          {
            // 所属团队（必填）
            // type: 'dropdown',
            // 把团队作为选项供用户选择
            // source: teamArray,
            allowEmpty: false
          },
          {
            // 项目负责人（必填）
            // type: 'dropdown',
            // source: ['张三'],
            allowEmpty: false
          },
          {
            // 客户名称（必填）
            type: 'text',
            allowEmpty: false,
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
        minRows: 1,
        // minSpareRows: 1,
        fillHandle: {
          autoInsertRow: true
        },
        cells: function (row, column) {
          var cellMeta = {}
          if (column === 0) {
            cellMeta.type = 'dropdown'
            cellMeta.source = teamArray
          } else if (column === 1) {
            cellMeta.type = 'dropdown'
            let index = teamArray.indexOf(tableObj.getDataAtCell(row, 0))
            if (index >= 0) {
              cellMeta.source = userArray[index]
            } else {
              cellMeta.source = []
            }
          } else if (column === 5) {
            if (tableObj.getDataAtCell(row, 5) === 0) {
              cellMeta.valid = false
            }
          } else if (column === 6) {
            if (tableObj.getDataAtCell(row, 6) === 0) {
              cellMeta.valid = false
            }
          } else if (column === 9) {
            // 如果合同金额和回款金额都不为空
            if (tableObj.getDataAtCell(row, 8) !== '' && tableObj.getDataAtCell(row, 9) !== '') {
              if (tableObj.getDataAtCell(row, 9) > tableObj.getDataAtCell(row, 8)) {
                cellMeta.valid = false
              }
            }
          }
          return cellMeta
        }

      }

      this.$refs.hotTable.table.addHook('afterRender', function () {
        console.log('afterRender')
        _this.$refs.hotTable.table.validateCells()
      })
    }, (response) => {
      this.$message.error(response.message ? response.message : '系统或网络异常')
    })
  },
  methods: {
    // 获取表格内所有数据
    getTableData: function () {
      const _this = this
      this.$refs.hotTable.table.validateCells(function (callback) {
        if (callback === false) {
          confirm('表格内仍有错误项，请按照规则填写后提交')
          return false
        } else {
          let r = confirm('可以提交，确认提交吗？')
          if (r === true) {
            const tableData = _this.$refs.hotTable.table.getData()
            console.log(tableData)
            let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
            // 把json格式的数据传到后台
            return axios.post('/api/pc/customerDataPc/importExcelData/' + sessionUser.openid, tableData).then(response => {
              if (response === 'import success') {
                confirm('导入成功')
              } else {
                confirm('导入失败')
              }
            })
          }
        }
      })
      // console.log(this.$refs.hotTable.table.validateCells())
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
</style>
