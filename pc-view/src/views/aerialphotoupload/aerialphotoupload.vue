<template>
  <el-card class="box-card">
        <el-breadcrumb separator="/" style="padding-bottom: 20px;">
            <el-breadcrumb-item>项目信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="padding-left:10px">
            <el-col :span="24" class="y-Center">
                <el-col :span="2" style="font-size: 14px;">项目名称<font color="red">*</font></el-col>
                <el-col :span="4"><el-input v-model="projectName" size="small" placeholder="必填，请输入内容"></el-input></el-col>
            </el-col>
            <el-col :span="24" class="y-Center" style="margin-top: 10px;">
                <el-col :span="2" style="font-size: 14px;">联系人<font color="red">*</font></el-col>
                <el-col :span="4"><el-input v-model="linkman" size="small" placeholder="必填，请输入内容"></el-input></el-col>
            </el-col>
            <el-col :span="24" class="y-Center" style="margin-top: 10px;">
                <el-col :span="2" style="font-size: 14px;">电话<font color="red">*</font></el-col>
                <el-col :span="4"><el-input v-model="phone" size="small" placeholder="必填，请输入内容"></el-input></el-col>
            </el-col>
            <el-col :span="24" class="y-Center" style="margin-top: 10px;">
                <el-col :span="2" style="font-size: 14px;">邮箱</el-col>
                <el-col :span="4"><el-input v-model="mail" size="small" placeholder="请输入内容"></el-input></el-col>
            </el-col>
            <div style="clear:both"></div>
            <font style="font-weight: normal;color: #606266;cursor: text;padding-top: 10px">为确保我们的工作人员能够及时与您取得联系并正确向您交付相关工作成果，请务必完整地填写上述资料</font>
        </div>
        <br>
        <br>
        <el-breadcrumb separator="/" style="padding-bottom: 20px;">
            <el-breadcrumb-item>图片列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table
            :data="tableData"
            size="small" stripe
            style="width: 100%;border: 1px solid #ebeef5;">
        <el-table-column
            prop="fileName"
            label="文件名">
        </el-table-column>
        <el-table-column
            prop="gps"
            label="GPS信息">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
        </el-table-column>
        <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <!-- <span class="el-button el-button--default el-button--medium fileinput-button" style="background: #67c23a;color: #fff;margin-top:10px">
            <span>添加图片</span>
            <input type="file" multiple="multiple" value="添加图片" @change="uploadFile" accept="image/jpeg, image/jpg">
        </span> -->
        <el-upload
            ref="fileUpload"
            class="upload-demo"
            action="api/file/upload/"
            :before-upload="beforeUpload"
            :http-request="fileUpload"
            multiple
            accept="image/jpeg, image/jpg"
            :show-file-list="false"
            >
            <el-button class="el-button el-button--default el-button--medium" size="medium" style="margin-top:10px" type="primary">添加图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg文件</div>
        </el-upload>
        <br>
        <br>
        <el-breadcrumb separator="/" style="padding-bottom: 20px;">
            <el-breadcrumb-item>设计备注</el-breadcrumb-item>
        </el-breadcrumb>
        <textarea v-model="remark" placeholder="如果您需要测量特定位置的外形尺寸或者对方案设计有任何特殊要求，请在此处予以说明" style="border: 1px solid #e4e6eb;width: 100%;height: 100px;font-size: 14px">
        </textarea>

        <button class="el-button el-button--default el-button--medium" ref="nextStep" @click="save()" size="medium" style="margin-top: 5px;background: #67c23a;color: #fff;float: left;font-size: 14px">提交</button>
        <div style="clear:both"></div>
        <font style="font-weight: normal;color: #606266;cursor: text;padding-top: 10px">我们的工作人员会在收到您的需求后尽快于您取得联系，谢谢</font>
        <div ref="vmodel" tabindex="-1" role="dialog" aria-modal="true" aria-label="标题名称" class="el-message-box__wrapper" style="z-index: 2072;display: none"><div class="el-message-box" style="padding-bottom: 0px;width: auto"><div class="el-message-box__content"><!----><div class="el-message-box__message" style="text-align: center"><p>文件上传中<img src="../../../static/img/loading.gif" style="width: 24px;height: 24px;margin-bottom: -5px;"></p></div><div class="el-message-box__input" style="display: none;"><div class="el-input"><!----><input type="text" autocomplete="off" placeholder="" class="el-input__inner"><!----><!----><!----></div><div class="el-message-box__errormsg" style="visibility: hidden;"></div></div></div></div></div>
        <div class="v-modal" ref="vbackmodel" tabindex="0" style="z-index: 2070;display: none"></div>
  </el-card>
</template>
<script>
import axios from 'axios'
// import values from '../../utils/values'
import exif from 'exif-js'
export default {
  data () {
    return {
      tableData: [],
      fileData: [],
      projectName: '',
      linkman: '',
      mail: '',
      phone: '',
      remark: ''
    }
  },
  methods: {
    beforeUpload (file) {
    // 在文件上传之前读取它的exif信息，保存在页面中。省去流量消耗
      const _this = this
      exif.getData(file, function () {
        const fileObj = {}
        const GPSLatitude = exif.getTag(file, 'GPSLatitude')
        if (GPSLatitude) {
          const GPSLatitudeArray = []
          for (let i = 0; i < GPSLatitude.length; i++) {
            GPSLatitudeArray.push(GPSLatitude[i])
          }
          fileObj.GPSLatitude = GPSLatitudeArray.toString()
        }

        const GPSLongitude = exif.getTag(file, 'GPSLongitude')
        if (GPSLongitude) {
          const GPSLongitudeArray = []
          for (let i = 0; i < GPSLongitude.length; i++) {
            GPSLongitudeArray.push(GPSLongitude[i])
          }
          fileObj.GPSLongitude = GPSLongitudeArray.toString()
        }

        const GPSAltitude = exif.getTag(file, 'GPSAltitude')
        // GPSAltitude 没法直接取，需要计算一下
        if (GPSAltitude) {
          fileObj.GPSAltitude = GPSAltitude.numerator / GPSAltitude.denominator
        }

        fileObj.file_name = file.name
        _this.fileData.push(fileObj)
      })
    },
    // 控件的成功回调on-success只会触发一次，对于多文件上传算是bug。自己实现上传功能
    fileUpload (item) {
      const _this = this
      // 显示上传中状态
      if (_this.$refs.vmodel.style.display === 'none') {
        _this.$refs.vmodel.style.display = ''
      }
      if (_this.$refs.vbackmodel.style.display === 'none') {
        _this.$refs.vbackmodel.style.display = ''
      }
      const formData = new FormData()
      formData.append('source_type', 7)
      formData.append('data_type', 0)
      formData.append('file', item.file)
      axios.post(item.action, formData, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response => {
        console.log(response)
        // 清除按钮下方的上传记录
        // _this.$refs.fileUpload.clearFiles()
        // 遍历上传文件列表，把有gps信息的文件在表格里显示‘有’
        for (let i = 0; i < _this.fileData.length; i++) {
          if (_this.fileData[i].file_name === response.file_name) {
            if (_this.fileData[i].GPSLatitude || _this.fileData[i].GPSLongitude || _this.fileData[i].GPSAltitude) {
              response.gps = '有'
              response.GPSLatitude = _this.fileData[i].GPSLatitude
              response.GPSLongitude = _this.fileData[i].GPSLongitude
              response.GPSAltitude = _this.fileData[i].GPSAltitude
            } else {
              response.gps = '无'
            }
            response.status = '已上传'
          }
        }
        response.fileName = response.file_name
        _this.tableData.push(response)

        // 隐藏上传中状态
        if (_this.tableData.length === _this.fileData.length) {
          _this.$refs.vmodel.style.display = 'none'
          _this.$refs.vbackmodel.style.display = 'none'
        }
      })
    },
    handleDelete (index, row) {
      const _this = this
      this.$confirm('确认删除该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,删除文件
        axios.post('api/file/del/', {oss_file_name: row.oss_file_name}).then(response => {
          // 删除oss文件成功
          if (response.res.status === 204) {
            // 移除表格里的数据
            for (let i = 0; i < _this.tableData.length; i++) {
              if (_this.tableData[i].fileName === row.fileName) {
                _this.tableData.splice(i, 1)
                break
              }
            }
          }
          console.log(response)
        })
      }).catch(() => {
        // 点击取消
      })
    },
    save () {
      const uploadObj = {}
      if (this.projectName === '') {
        this.$message.error('项目名称不能为空')
        return
      }
      if (this.linkman === '') {
        this.$message.error('联系人不能为空')
        return
      }
      if (this.phone === '') {
        this.$message.error('电话不能为空')
        return
      }
      uploadObj.projectName = this.projectName
      uploadObj.linkman = this.linkman
      uploadObj.phone = this.phone
      uploadObj.mail = this.mail
      uploadObj.remark = this.remark
      uploadObj.file = this.tableData
      console.log(uploadObj)
      axios.post('api/pc/aerial/save/', uploadObj).then(response => {
        if (response === 'success') {
          this.$alert('提交成功', '', {
            confirmButtonText: '确定',
            callback: action => {
              // 刷新当前页
              location.reload()
            }
          })
        }
      }).catch(error => {
        console.log(error)
        this.$alert('提交失败，请稍后再试', '', {
          confirmButtonText: '确定',
          callback: action => {
            // 什么也不做
          }
        })
      })
    }
  }
  // mounted () {

  // }
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
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .fileinput-button input{
    position:absolute;
    right: 0px;
    top:0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    font-size: 200px;
  }
</style>
