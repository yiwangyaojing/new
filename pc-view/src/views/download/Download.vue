<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="8">
      <el-card class="download-box-card">
        <div slot="header" class="clearfix">
          <span>请输入提取密码：</span>
        </div>
        <div>
          <el-row>
            <el-col :span="15">
              <input class="el-input__inner" v-model="shortUrl" type="text"/>
            </el-col>
            <el-col :span="5" :offset="1">
              <a class="el-button el-button--success" @click="getFiles">提取文件</a>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import ElRow from 'element-ui/packages/row/src/row'

export default {
  components: {ElRow},
  name: 'download',
  data () {
    return {
      shortUrl: this.$route.query.shortUrl
    }
  },
  methods: {
    getFiles () {
      if (!this.shortUrl) {
        this.$message.error('请输入文件提取密码！')
        return
      }

      let uat = '/test'
      let context = 'https://mp.xiaosolar.com/backend-api'
      // 判断环境
      let href = window.location.href

      if (href.indexOf(uat) !== -1) {
        context = 'https://mpa.xiaosolar.com/backend-api' // 测试环境
      }

      let url = context + '/backend/file/download/' + this.shortUrl
      window.open(encodeURI(url))
    }
  }
}
</script>

<style scoped>
  .row-bg {
    margin-top: 15%;
  }
</style>
