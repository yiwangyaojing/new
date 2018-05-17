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
      shortUrl: ''
    }
  },
  methods: {
    getFiles () {
      if (!this.shortUrl) {
        this.$message.error('请输入文件提取密码！')
        return
      }
      let url = 'http://localhost:8002/backend/file/download/' + this.shortUrl
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
