<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: 18px;">客户详情</span>
    </div>
    <el-row>
      <div class="clearfix" style="font-size: 18px;">
        <div class="fl">冬至用</div>
        <div class="fr" style="border: 1px solid #999;padding: 5px;border-radius: 5px;">打包下载</div>
      </div>
      <el-col :span="24" style="margin-top: 10px;font-size: 16px;line-height: 50px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="概况" name="0" class="clearfix">
            <div class="clearfix">
              <div :span="10" class="clearfix fl" style="width: 400px;">
                <div class="fl" style="width: 100px;">电话</div>
                <div class="fl">133333333888</div>
              </div>
              <div :span="10" class="clearfix fl">
                <div class="fl" style="width: 100px;">地址</div>
                <div class="fl" >上海市徐汇区万科中心</div>
              </div>
            </div>
            <div class="clearfix">
              <div :span="10" class="clearfix fl" style="width: 400px;">
                <div class="fl" style="width: 100px;">组件规格</div>
                <div class="fl" >168瓦</div>
              </div>
              <div :span="10" class="clearfix fl">
                <div class="fl" style="width: 100px;">组件数量</div>
                <div class="fl" >36块</div>
              </div>
            </div>
            <div class="clearfix">
              <div :span="10" class="clearfix fl" style="width: 400px;">
                <div class="fl" style="width: 100px;">装机容量</div>
                <div class="fl">100千瓦</div>
              </div>
              <div :span="10" class="clearfix fl">
                <div class="fl" style="width: 100px;">系统单价</div>
                <div class="fl">0.5元/瓦</div>
              </div>
            </div>
            <div class="clearfix">
              <div :span="10" class="clearfix fl" style="width: 400px;">
                <div class="fl" style="width: 100px;">系统总价</div>
                <div class="fl">200元</div>
              </div>
              <div :span="10" class="clearfix fl">
                <div class="fl" style="width: 100px;">已回款</div>
                <div class="fl">200元</div>
              </div>
            </div>
            <div>备注: XXXXXXXX</div>
            <div class="clearfix">
              <div :span="10" class="clearfix fl" style="width: 400px">
                <div class="fl" style="width: 100px;">合同状态</div>
                <div class="fl">施工完成</div>
              </div>
              <div :span="10" class="clearfix fl">
                <div class="fl" style="width: 100px;">更新时间</div>
                <div class="fl">2018/05/03</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="合同动态" name="1">
            <div style="border: 1px solid #ebeef5; padding: 0 20px;margin-bottom: 20px;">
              <div>2018年3月20日 15:23</div>
              <div>张三于 将合同状态由 施工完成 改为 并网完成</div>
              <div>备注：XXXXXXXXXXXXX</div>
            </div>
            <div style="border: 1px solid #ebeef5; padding: 0 20px;">
              <div>2018年3月20日 15:23</div>
              <div>张三于 将合同状态由 施工完成 改为 并网完成</div>
              <div>备注：XXXXXXXXXXXXX</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="回款" name="2">
            <div style="border: 1px solid #ebeef5; padding: 0 20px;margin-bottom: 20px;">
              <div>2018年3月20日 15:23</div>
              <div>张三 回款 1000元</div>
              <div>备注：XXXXXXXXXXXXX</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="拍房子" name="3">
            <div class="clearfix">
              <div class="fl" style="width: 100px;">房屋朝向</div>
              <div class="fl">165°南</div>
            </div>
            <div class="clearfix">
              <div class="fl" style="width: 100px;">房屋照片</div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
            </div>
            <div class="clearfix">
              <div class="fl" style="width: 100px;">电表箱</div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
            </div>
            <div class="clearfix">
              <div class="fl" style="width: 100px;">其他</div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
            </div>
            <div>备注: XXXXXXXXXXXXXXXX</div>
          </el-tab-pane>
          <el-tab-pane label="收资料" name="4">
            <div class="clearfix">
              <div class="fl" style="width: 100px;">身份证/户口本/结婚证</div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
            </div>
            <div class="clearfix">
              <div class="fl" style="width: 100px;">产权证明/电费单/银行卡</div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
            </div>
            <div class="clearfix">
              <div class="fl" style="width: 100px;">并网申请/合同/其他</div>
              <div class="fl" style="margin-right: 5px;"><img style="width: 60px; height: 60px;" src="/static/img/sky.871d198.jpg" alt=""></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="排版子" name="5">
            <div class="clearfix">
              <div :span="10" class="clearfix fl" style="width: 300px;">
                <div class="fl" style="width: 100px;">组件规格</div>
                <div class="fl" >168瓦</div>
              </div>
              <div :span="10" class="clearfix fl">
                <div class="fl" style="width: 100px;">组件数量</div>
                <div class="fl" >36块</div>
              </div>
            </div>
            <div :span="10" class="clearfix" style="width: 400px;">
              <div class="fl" style="width: 100px;">装机容量</div>
              <div class="fl" >168千瓦</div>
            </div>
            <div>备注: XXXXXXXXXXXXXXXXXXX</div>
            <div>排布示意图</div>
            <div><img width="400" src="/static/img/sky.871d198.jpg" alt=""></div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      activeName: '0'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
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
</style>
