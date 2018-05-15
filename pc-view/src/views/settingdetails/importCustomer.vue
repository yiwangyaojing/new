<template>
    <div id="hot-preview">
        <HotTable ref="hotTable" :root="root" :settings="hotSettings"></HotTable>
        <el-button @click="getTableData()" size="medium" style="margin-top: 40px;background: #67c23a;color: #fff;">导入</el-button>
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
      // hotSettings: {
      //   data: [
      //     ["上海分公司", "张三", "示例客户", 13815165465, "上海市徐汇区xxx", 285, 10, "土瓦，客户要多装", 20000, 10000, "2018-05-02", "2018-05-03", "2018-05-04", "2018-05-05", "2018-05-06"],
      //   ],
      //   colHeaders: ['所属团队（选填）','项目负责人（选填）','客户名称（必填）','联系电话（选填）','项目地址（选填）','组件规格（W）（选填）','组件数量（块）（选填）','备注（选填）','合同金额（元）（选填）','回款金额（元）（选填）','新建项目时间（选填）','签订合同时间（选填）','施工完成时间（选填）','并网完成时间（选填）','回款完成（选填）'],
      //   columns:[
      //       {
      //           // 所属团队（选填）
      //           type: 'text',
      //       },
      //       {
      //           // 项目负责人（选填）
      //           type: 'text',
      //       },
      //       {
      //           // 客户名称（必填）
      //           type: 'text',
      //       },
      //       {
      //           // 联系电话（选填）
      //           type: 'numeric',
      //       },
      //       {
      //           // 项目地址（选填）
      //           type: 'text',
      //       },
      //       {
      //           // 组件规格（W）（选填）
      //           type: 'numeric',
      //       },
      //       {
      //           // 组件数量（块）（选填）
      //           type: 'numeric',
      //       },
      //       {
      //           // 备注（选填）
      //           type: 'text',
      //       },
      //       {
      //           // 合同金额（元）（选填）
      //           type: 'numeric',
      //       },
      //       {
      //           // 回款金额（元）（选填）
      //           type: 'numeric',
      //       },
      //       {
      //           // 新建项目时间（选填）
      //           type: 'date',
      //           dateFormat: 'YYYY-MM-DD'
      //       },
      //       {
      //           // 签订合同时间（选填）
      //           type: 'date',
      //           dateFormat: 'YYYY-MM-DD'
      //       },
      //       {
      //           // 施工完成时间（选填）
      //           type: 'date',
      //           dateFormat: 'YYYY-MM-DD'
      //       },
      //       {
      //           // 并网完成时间（选填）
      //           type: 'date',
      //           dateFormat: 'YYYY-MM-DD'
      //       },
      //       {
      //           // 回款完成（选填）
      //           type: 'date',
      //           dateFormat: 'YYYY-MM-DD'
      //       },
      //   ]
      // },
    }
  },
  components: {
    HotTable
  },
  mounted: function () {
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    const _this = this
    // 从后台获取该用户下的所有团队和成员信息
    axios.get('/api/pc/customerDataPc/getTeamAndUser/'+sessionUser.openid).then((resp) => {
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
          if (resp.agents[i].team_name === teamArray[j]) {
            userArray[j].push(resp.agents[i].name)
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
            validator: function (value, callback) {
              if (!value || value.length === 0) {
                callback(false)
              } else {
                callback(true)
              }
            }
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
          }
          return cellMeta
        }
        // modifyData: function(row, column, valueHolder, ioMode) {
        //     // if (this.toPhysicalColumn(column) === 2 && ioMode === 'get') {
        //     // valueHolder.value = getOwnerTeam(this.getDataAtCell(this.toVisualRow(row), this.toVisualColumn(1)));
        //     // }
        //     if(column === 0){

        //     }
        //     console.log(row, column, valueHolder, ioMode)
        // }

        // beforeChange: function (changes) {
        //     var instance = this.$refs.hotTable.table,
        //         ilen = changes.length,
        //         clen = instance.countCols(),
        //         rowColumnSeen = {},
        //         rowsToFill = {},
        //         i,
        //         c;

        //     for (i = 0; i < ilen; i++) {
        //         // if oldVal is empty
        //         if (changes[i][2] === null && changes[i][3] !== null) {
        //         if (isEmptyRow(instance, changes[i][0])) {
        //             // add this row/col combination to cache so it will not be overwritten by template
        //             rowColumnSeen[changes[i][0] + '/' + changes[i][1]] = true;
        //             rowsToFill[changes[i][0]] = true;
        //         }
        //         }
        //     }
        //     for (var r in rowsToFill) {
        //         if (rowsToFill.hasOwnProperty(r)) {
        //         for (c = 0; c < clen; c++) {
        //             // if it is not provided by user in this change set, take value from template
        //             if (!rowColumnSeen[r + '/' + c]) {
        //             changes.push([r, c, null, null]);
        //             }
        //         }
        //         }
        //     }
        // }
      }
      // 往表格里添加事件
      // 每次修改数据后触发
      // this.$refs.hotTable.table.addHook('afterChange', function(changes, row, prop){
      //     console.log(changes)
      //     // changes 是数组，[0]:row, [1]:col, [2]:old value, [3]:new value
      //     // if(changes != null){
      //     //     for(let i=0;i<changes.length;i++){
      //     //         if(changes[i][1] === 2 &&  _this.trim(changes[i][3]) === ""){
      //     //             return false
      //     //         }else{
      //     //             return 0
      //     //         }
      //     //     }
      //     // }
      //     _this.$refs.hotTable.table.validateCells()
      // })

      // this.$refs.hotTable.table.addHook('afterChange', function(){
      //     console.log('afterChange')
      //     _this.$refs.hotTable.table.validateCells()
      // })

      this.$refs.hotTable.table.addHook('afterRender', function () {
        console.log('afterRender')
        _this.$refs.hotTable.table.validateCells()
      })

      // const tableObj = this.$refs.hotTable.table
      // this.$refs.hotTable.table.addHook('afterChange', function(changes, row, prop){
      //     console.log(changes)
      //     // changes 是数组，[0]:row, [1]:col, [2]:old value, [3]:new value
      //     // if(changes !== null && changes === ""){
      //     //     return false
      //     // }else{
      //     //     return 0
      //     // }
      //     //this.getCellMeta(0,1).source=['123','321']
      //     if(changes != null){
      //         for(let i=0;i<changes.length;i++){
      //             // 如果修改了所属团队->动态修改项目负责人下拉框的内容
      //             if(changes[i][1] === 0){
      //                 // const cellProp = tableObj.getCellMeta(changes[i][0],1)
      //                 // // cellProp.source=['123','321']
      //                 // tableObj.setCellMeta(changes[i][0], 1, 'source', '123')
      //                 // const cellProp2 = tableObj.getCellMeta(changes[i][0],1)
      //                 // console.log(changes[i][0]+"       "+i)
      //                 //this.getCellMeta(changes[i][0],1).source=['123','321']
      //                 tableObj.setCellMeta(changes[i][0], 1, 'source', ['123','321'])
      //                 console.log(changes[i][0]+"       "+i)
      //             }
      //         }
      //     }
      //     // changes.forEach(change => {
      //     //     // 如果修改了所属团队->动态修改项目负责人下拉框的内容
      //     //     if(change[1] === 0){
      //     //         this.getCellMeta(change[0],1).source=['123','321']
      //     //     }
      //     // });
      //     })
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
            let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
            // 把json格式的数据传到后台
            return axios.post('/api/pc/customerDataPc/importExcelData/'+sessionUser.openid, tableData).then(response => {
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
    // emptyValidator: function (value, callback) {
    //   if (!value || value.length === 0) {
    //     callback(false)
    //   } else {
    //     callback(true)
    //   }
    // },
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
  height: 400px;
  overflow: hidden;
}
</style>
