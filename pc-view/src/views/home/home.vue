<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <!--<div class="y-Center clearfix">-->
          <!--<div class="fl"><img style="width: 50px;height: 50px;border-radius: 50%;" src="/static/img/00_logo_xiaosolar.png"/></div>-->
          <!--<div class="fl" style="margin-left: 10px;font-size: 18px;">董忽悠团队</div>-->
        <!--</div>-->

        <div v-if="!yqgzgzsz">
          <div style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">统计周期</div>
              <el-select class="fl" v-model="tjzqvalue" placeholder="请选择" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16" class="y-Center">
              <div class="grid-content bg-purple" style="font-size: 14px;width: 100px">自定义时间段</div>
              <div class="block">
                <el-date-picker size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-col>
          </div>
          <div style="margin-top: 20px;" class="clearfix">
            <el-col :span="8" class="y-Center">
              <div class="fl" style="font-size: 14px;margin-right: 20px;">团队范围</div>
              <el-select size="small" class="fl" v-model="tdfwvalue" placeholder="请选择">
                <el-option v-for="item in tdfwoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="y-Center">
              <div class="fl"  style="font-size: 14px;width: 100px;">负责人</div>
              <el-select size="small" class="fl" v-model="fuzerenvalue" placeholder="请选择">
                <el-option v-for="item in fuzerenoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </div>
        </div>
        <div v-if="!yqgzgzsz" style="margin-top: 20px;">
          <div style="font-size: 16px;">项目更新</div>
          <el-row style="margin-top: 20px;">
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">合同签订</div>
                <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00cc30;font-size: 30px;">6</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                <div class="fl" style="width: 59%;font-size: 18px;">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">138 <span style="color: #999;font-size: 12px;">千瓦</span></div>
                  <div style="padding: 12px 0">10.8 <span style="color: #999;font-size: 12px;">万元</span></div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">施工完成</div>
                <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00abca;font-size: 30px;">3</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                <div class="fl" style="width: 59%;font-size: 18px;">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">138 <span style="color: #999;font-size: 12px;">千瓦</span></div>
                  <div style="padding: 12px 0">10.8 <span style="color: #999;font-size: 12px;">万元</span></div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">并网完成</div>
                <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #ca9b00;font-size: 30px;">3</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                <div class="fl" style="width: 59%;font-size: 18px;">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">138 <span style="color: #999;font-size: 12px;">千瓦</span></div>
                  <div style="padding: 12px 0">10.8 <span style="color: #999;font-size: 12px;">万元</span></div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" class="clearfix" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">回款完成</div>
                <div class="fl xy-Center" style="border-right: 1px solid #dcdfe6;padding: 30px 0;width: 40%"><span style="color: #00cc87;font-size: 30px;">3</span><span style="color: #999;font-size: 12px;">&nbsp; 个</span></div>
                <div class="fl" style="width: 59%;font-size: 18px;">
                  <div style="border-bottom: 1px solid #dcdfe6;padding: 13px 0">138 <span style="color: #999;font-size: 12px;">千瓦</span></div>
                  <div style="padding: 12px 0">10.8 <span style="color: #999;font-size: 12px;">万元</span></div>
                </div>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <div v-if="!yqgzgzsz" style="margin-top: 20px;">
          <div style="font-size: 16px;"><span>逾期项目</span> <span style="font-size: 10px;color: #409EFF;" @click="gzshow">规则设置</span></div>
          <el-row style="margin-top: 20px;">
            <el-col :span="6" class="x-Center">
              <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">施工逾期</div>
                <div style="padding: 10px 0;">
                  <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">3</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                  <div style="color: #999;font-size: 12px;">最长9天</div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">并网逾期</div>
                <div style="padding: 10px 0;">
                  <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">3</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                  <div style="color: #999;font-size: 12px;">最长9天</div>
                </div>
              </el-col>
            </el-col>
            <el-col :span="6" class="x-Center">
              <el-col :span="20" style="border: 1px solid #dcdfe6;text-align: center;font-size: 14px;">
                <div style="border-bottom: 1px solid #dcdfe6;padding: 10px 0;">回款逾期</div>
                <div style="padding: 10px 0;">
                  <div class="xy-Center"><span style="color: #e3023b;font-size: 30px;">3</span> <span style="font-size: 12px;color: #999;">&nbsp;个</span></div>
                  <div style="color: #999;font-size: 12px;">最长9天</div>
                </div>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <el-row v-if="yqgzgzsz" style="margin-top: 20px;">
          <div style="font-size: 20px;">逾期规则设置</div>
          <el-col :span="24">
            <el-col :span="6" class="clearfix" style="margin-top: 20px;padding: 20px;font-size: 16px;border: 1px solid #ccc;border-radius: 5px;">
              <div class="fl" style="margin-top: 20px;">合同签订</div>
              <div class="fl" style="margin:0 10px 10px;;border-bottom: 1px solid #666;width: 110px;position: relative;">
                <input style="width: 50px;font-size: 28px;text-align: center;border: none;margin-left: 15px;color: #01cd33;" value="15" type="text">天
                <div style="position: absolute;right: 4px;bottom: -1px;border-left: 1px solid #666;width: 1px;height: 10px;transform: rotate(-45deg)"></div>
              </div>
              <div class="fl" style="margin-top: 20px;">施工完成</div>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6" class="clearfix" style="margin-top: 20px;padding: 20px;font-size: 16px;border: 1px solid #ccc;border-radius: 5px;">
              <div class="fl" style="margin-top: 20px;">施工完成</div>
              <div class="fl" style="margin:0 10px 10px;;border-bottom: 1px solid #666;width: 110px;position: relative;">
                <input style="width: 50px;font-size: 28px;text-align: center;border: none;margin-left: 15px;color: #01cd33;" value="15" type="text">天
                <div style="position: absolute;right: 4px;bottom: -1px;border-left: 1px solid #666;width: 1px;height: 10px;transform: rotate(-45deg)"></div>
              </div>
              <div class="fl" style="margin-top: 20px;">并网完成</div>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6" class="clearfix" style="margin-top: 20px;padding: 20px;font-size: 16px;border: 1px solid #ccc;border-radius: 5px;">
              <div class="fl" style="margin-top: 20px;">并网完成</div>
              <div class="fl" style="margin:0 10px 10px;;border-bottom: 1px solid #666;width: 110px;position: relative;">
                <input style="width: 50px;font-size: 28px;text-align: center;border: none;margin-left: 15px;color: #01cd33;" value="15" type="text">天
                <div style="position: absolute;right: 4px;bottom: -2px;border-left: 1px solid #666;width: 1px;height: 10px;transform: rotate(-45deg)"></div>
              </div>
              <div class="fl" style="margin-top: 20px;">回款完成</div>
            </el-col>
          </el-col>
        </el-row>
        <el-button v-if="yqgzgzsz" @click="sunmitClick" size="medium" class="x-Center" style="margin-top: 30px;background: #01cd33;color: #fff;">保存修改</el-button>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      options: [{
        value: '选项1',
        label: '今天'
      }, {
        value: '选项2',
        label: '昨天'
      }, {
        value: '选项3',
        label: '本周'
      }, {
        value: '选项4',
        label: '上周'
      }, {
        value: '选项5',
        label: '本月'
      }, {
        value: '选项6',
        label: '上月'
      }, {
        value: '选项7',
        label: '本年'
      }, {
        value: '选项8',
        label: '累计'
      }],
      tdfwoptions: [
        {
          value: '选项1',
          label: '全部'
        },
        {
          value: '选项2',
          label: '总团队'
        },
        {
          value: '选项3',
          label: '子团队1'
        },
        {
          value: '选项4',
          label: '子团队2'
        },
        {
          value: '选项5',
          label: '子团队3'
        }
      ],
      fuzerenoptions: [],
      tjzqvalue: '',
      datevalue: '',
      tdfwvalue: '',
      fuzerenvalue: '',
      htqdday: '',
      sgwcday: '',
      bwwcday: '',
      yqgzgzsz: false
    }
  },
  methods: {
    gzshow () {
      this.yqgzgzsz = !this.yqgzgzsz
    },
    sunmitClick () {
      this.yqgzgzsz = !this.yqgzgzsz
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
  .el-date-editor .el-range-separator {
    width: 10%;
  }
</style>
