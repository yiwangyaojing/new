<template>
  <el-card class="box-card">
      <el-row style="margin-top: 20px;">
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
      <el-button @click="sunmitClick" size="medium" class="x-Center" style="margin-top: 30px;background: #01cd33;color: #fff;">保存修改</el-button>
  </el-card>
</template>
