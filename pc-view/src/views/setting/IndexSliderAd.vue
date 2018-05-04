<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>轮播图片列表</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="addSliderImage">添加图片</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100% ;margin: 15px" border>
      <el-table-column
        prop="file_name"
        label="图片名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="显示顺序"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.url" style="height: 50px;"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="mini_url"
        label="链接地址">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.mini_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--添加轮播界面-->
    <div>
      <el-dialog :visible.sync="showModal" title="添加广告图片" :modal="true">
        <el-form ref="addForm" :model="addForm" label-width="100">
          <el-form-item>
            <img class="indexAd" :src="addForm.imageUrl"/>
          </el-form-item>
          <el-form-item>
            <vue-core-image-upload
              :crop="false"
              @imageuploaded="imageUploaded"
              :max-file-size="5242880"
              class="ivu-btn ivu-btn-success"
              :url="uploadUrl"
              extensions="gif,jpg,jpeg,png,webp"
              inputAccept="image/png,image/gif,image/jpeg,image/webp"
              :headers="headers">
              <el-button type="primary">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
            </vue-core-image-upload>
          </el-form-item>
          <el-form-item label="链接地址">
            <el-input type="text" v-model="addForm.linkUrl" placeholder="地址可以为空">
              <i class="ios-locked-outline" slot="prepend"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input type="text" v-model="addForm.order" placeholder="数字越大，越排名靠前">
              <i class="ios-locked-outline" slot="prepend"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" :loading="loadingBtn" @click="handleSubmit('addForm')">保存</el-button>
          <el-button type="ghost" :loading="loadingBtn" @click="showModal=false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
import VueCoreImageUpload from 'vue-core-image-upload'
import cookie from '../../utils/cookie'
import values from '../../utils/values'

export default {
  name: 'image-setting',
  components: {
    VueCoreImageUpload
  },
  data () {
    return {
      headers: {},
      showModal: false,
      loadingBtn: false,
      tableData: [],
      uploadUrl: process.env.CONTEXT + '/file',
      addForm: {
        id: null,
        linkUrl: '',
        imageUrl: '',
        order: null
      },
      fromTemp: {}
    }
  },
  methods: {
    init () {
      axios.get('/security/setting/queryIndexSliderAd').then(response => {
        this.tableData = response.body.content
      })
    },
    addSliderImage () {
      this.addForm = {}
      this.fromTemp = {}
      this.showModal = true
    },
    // 保存首页图片
    handleSubmit () {
      this.loadingBtn = true
      axios.post('/security/setting/saveIndexSliderAd', this.addForm).then(response => {
        this.$message.success('保存成功！')
        this.loadingBtn = false
        this.showModal = false
        this.init()
      }, response => {
        this.$message.error(response.message)
        this.loadingBtn = false
      })
    },
    imageUploaded (res) {
      this.addForm = {}

      if (this.fromTemp) {
        this.addForm.id = this.fromTemp.id
        this.addForm.order = this.fromTemp.order
        this.addForm.linkUrl = this.fromTemp.linkUrl
      }
      this.addForm.imageUrl = res.url
      this.addForm.file_name = res.file_name
      this.addForm.oss_file_name = res.oss_file_name
    },
    handleEdit (index, row) {
      this.showModal = true
      this.addForm.id = row.id
      this.addForm.imageUrl = row.url
      this.addForm.linkUrl = row.mini_url
      this.addForm.order = row.sort
      this.fromTemp = this.addForm

      console.log(row)
    },
    handleDelete (index, row) {
      const params = {
        id: row.id,
        oss_file_name: row.oss_file_name
      }
      console.log(params)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingBtn = true
        throw axios.post('/security/setting/delete', params).then(resp => {
          this.$message.success('删除成功！')
          this.loadingBtn = false
          this.init()
        }).catch(resp => {
          this.$message.error('删除失败！')
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'})
      })
    }
  },
  mounted () {
    let csrfToken = cookie.getCookie(values.storage.csrfToken)
    this.headers = {'x-csrf-token': csrfToken}
    this.init()
  }
}
</script>

<style scoped>
  .indexAd {
    width: 50%;
    height: 30%;
  }
</style>
