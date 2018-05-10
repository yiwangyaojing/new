<template>
  <el-card class="box-card">
    <el-row>
      <div class="clearfix" style="font-size: 14px;">
        <div class="fl">董志永</div>
        <div class="fr" style="border: 1px solid #999;padding: 5px;border-radius: 5px;">打包下载</div>
      </div>
      <el-col :span="24" style="margin-top: 10px;font-size: 14px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="概况" name="0" class="clearfix">
            <div class="clearfix">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">电话</div>
                <div class="fl" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;">133333333888</div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">地址</div>
                <div class="fl one-txt-cut" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >上海市徐汇区万科中心</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">组件规格</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">186</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">瓦</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">组件数量</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">32</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">块</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">系统容量</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">186</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">千瓦</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">系统单价</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">32</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">元</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">系统总价</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">186</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">元</div>
                </div>
              </div>
              <div :span="10" class="clearfix fl y-Center">
                <div class="fl" style="width: 80px;">已回款</div>
                <div class="fl clearfix" style="border: 1px solid #e4e7ed;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
                  <div class="fl" style="width: 70%;padding-left: 10px">32</div>
                  <div class="fr" style="width: 25%;background: #f5f8f8;text-align: center;">元</div>
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">备注</div>
              <div class="fl">
                <div style="width: 520px;height: 70px;border: 1px solid #e4e7ed;border-radius: 5px;"></div>
                <div class="clearfix" style="margin-top: 20px;">
                  <div :span="4" class="clearfix fl" style="width: 200px">
                    <div class="fl" style="width: 80px;">合同状态:</div>
                    <div class="fl" style="color: #01cb32;">施工完成</div>
                  </div>
                  <div :span="4" class="clearfix fl">
                    <div class="fl" style="width: 80px;">更新时间:</div>
                    <div class="fl" style="color: #01cb32;">2018/05/03</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="合同动态" name="1">
            <el-col :span="24" style="margin-bottom: 20px;">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div>2018年3月20日 15:23</div>
                  <div>张三于 将合同状态由 <span style="color: #01cb32">施工完成</span> 改为 <span style="color: #01cb32">并网完成</span></div>
                  <div style="color: #999;">备注：XXXXXXXXXXXXX</div>
                </el-card>
              </el-col>
            </el-col>
            <el-col :span="24" style="margin-bottom: 20px;">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div>2018年3月20日 15:23</div>
                  <div>张三于 将合同状态由 <span style="color: #01cb32">施工完成</span> 改为 <span style="color: #01cb32">并网完成</span></div>
                  <div style="color: #999;">备注：XXXXXXXXXXXXX</div>
                </el-card>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="回款" name="2">
            <el-col :span="24" style="margin-bottom: 20px;">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div>2018年3月20日 15:23</div>
                  <div>张三 回款 <span style="color: #01cb32">1000</span> 元</div>
                  <div style="color: #999;">备注：XXXXXXXXXXXXX</div>
                </el-card>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="拍房子" name="3">
            <div class="clearfix">
              <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                <div class="fl" style="width: 80px;">房屋朝向</div>
                <div class="fl" style="border: 1px solid #e4e7ed;padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;counter-reset: #c0c4cc;">165°正南</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">房屋照片</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄房屋正面及侧面照片</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">电表箱</div>
              <div class="fl imgs" style="width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄用户的电表</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">其他</div>
              <div class="fl imgs" style="margin-right: 5px;width: 70px; height: 70px;">
                <img style="width: 70px; height: 70px;" src="/static/img/sky.871d198.jpg" alt="">
              </div>
              <div class="fl imgs">
                <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">可以拍摄用户房屋周边环境</div>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="fl" style="width: 80px;">备注</div>
              <div class="fl" style="width: 4 00px;height:60px;border: 1px solid rgb(228, 231, 237);border-radius: 5px; "></div>
            </div>
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
  .one-txt-cut{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-tabs__item.is-active {
    color: #01cb32;
  }
  .el-tabs__item:hover {
    color: #01cb32;
  }
  .el-tabs__item {
    padding: 0 35px;
    height: 35px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  .imgs {
    margin-right: 10px;
  }
</style>
