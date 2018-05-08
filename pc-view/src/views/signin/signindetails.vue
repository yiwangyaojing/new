<template>
  <el-card class="box-card">
    <div style="font-size: 14px;">冬至用</div>
    <div style="margin-top: 20px;font-size: 14px;">所属团队: 邓康团队</div>
    <el-row>
      <div :span="24" style="margin-top: 20px;" class="clearfix">
        <el-col :span="8" class="y-Center">
          <div class="fl" style="font-size: 14px;margin-right: 20px;">统计周期</div>
          <el-select size="small" class="fl" v-model="tjzqvalue" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="16" class="y-Center">
          <div class="grid-content bg-purple" style="font-size: 14px;width: 100px;">自定义时间段</div>
          <div class="block">
            <el-date-picker size="small" v-model="datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-col>
      </div>
    </el-row>
    <div style="margin-top: 20px;font-size: 14px;">签到统计</div>
    <el-row>
      <el-col :span="24" style="margin-top: 30px;">
        <el-col :span="15">
          <el-col :span="23">
            <el-table :data="tableData" stripe border size="mini" style="width: 100%">
              <el-table-column prop="date" label="时间" width="180">
              </el-table-column>
              <el-table-column prop="name" label="地点" width="180">
              </el-table-column>
              <el-table-column prop="address" label="客户">
              </el-table-column>
              <el-table-column prop="address" label="备注">
              </el-table-column>
            </el-table>
          </el-col>

        </el-col>
        <el-col :span="9">
          <img style="width: 480px;" src="/static/img/sky.871d198.jpg" alt="">
        </el-col>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>

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
