<template>
  <el-card :bordered="false">
    <p slot="title">首页开屏广告</p>
    <el-row justify="center">
      <el-col/>
      <el-col :xl="8" :md="18" :sm="18">
        <el-form :model="indexForm">
          <el-form-item>
            <img class="indexAd" :src="indexAdUrl"/>
          </el-form-item>
          <el-form-item style="text-align: left">
            <vue-core-image-upload
              :crop="false"
              @imageuploaded="imageUploaded"
              :max-file-size="5242880"
              class="ivu-btn ivu-btn-success"
              url="/backend/file"
              extensions="gif,jpg,jpeg,png,webp"
              inputAccept="image/png,image/gif,image/jpeg,image/webp"
              :headers="headers">
              <el-button type="primary">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
            </vue-core-image-upload>
          </el-form-item>
          <el-form-item label="链接地址">
            <el-input v-model="indexForm.linkUrl" placeholder="详细H5页面地址(以http开头)，如果为空则首页不显示"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveIndexAd" :loading="indexLoadingBtn">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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
      // 首页开屏广告图片地址
      indexAdUrl: '',
      indexForm: {
        linkUrl: '',
        id: null
      },
      indexLoadingBtn: false,
      headers: {},
      indexScrollImages: [
        {
          fileId: 'file2',
          ref: 'upload2',
          link: '',
          value: '',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522249615&di=afdc4136459df1b97db1ff62d57c16eb&imgtype=jpg&er=1&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F4bed2e738bd4b31cdfae124980d6277f9f2ff8b6.jpg'
        },
        {
          fileId: 'file3',
          ref: 'upload3',
          link: '',
          value: '',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521654896374&di=3d528dcd7e1c43589c7aacdd01ba6ef0&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F89%2F22%2F55G58PICamT_1024.jpg'
        },
        {
          fileId: 'file4',
          ref: 'upload4',
          link: '',
          value: '',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521654896374&di=3d528dcd7e1c43589c7aacdd01ba6ef0&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F89%2F22%2F55G58PICamT_1024.jpg'
        },
        {
          fileId: 'file5',
          ref: 'upload5',
          link: '',
          value: '',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521654896374&di=3d528dcd7e1c43589c7aacdd01ba6ef0&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F89%2F22%2F55G58PICamT_1024.jpg'
        },
        {
          fileId: 'file6',
          ref: 'upload6',
          link: '',
          value: '',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521654896374&di=3d528dcd7e1c43589c7aacdd01ba6ef0&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F89%2F22%2F55G58PICamT_1024.jpg'
        }
      ]
    }
  },
  methods: {
    init () {
      axios.get('/backend/security/setting/queryIndexAd').then(response => {
        if (response && response.id) {
          this.indexForm.id = response.id
          this.indexForm.linkUrl = response.linkUrl
          this.indexAdUrl = response.indexAdUrl
        }
      })
    },
    // 保存首页图片
    saveIndexAd () {
      this.indexLoadingBtn = true
      let req = {imageUrl: this.indexAdUrl, linkUrl: this.indexForm.linkUrl, id: this.indexForm.id}
      axios.post('/backend/security/setting/saveIndexAd', req).then(response => {
        this.$message.success('保存成功！')
        this.indexLoadingBtn = false
      }, response => {
        this.$message.error(response.message)
        this.indexLoadingBtn = false
      })
    },
    imageUploaded (res) {
      this.indexAdUrl = res.url
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
