<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24">
        <el-col :span="5">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="19">
          <el-col :span="24">
            <div style="font-size: 14px;">
              <div class="fl">创建者: &nbsp;&nbsp;张三</div>
              <div class="fl"style="margin-left: 20px;">解散团队</div>
            </div>
          </el-col>
          <el-col :span="24" style="margin-top: 20px;">
            <el-col :span="19">
              <div class="y-Center">
                <div class="fl" style="font-size: 14px;">管理员: &nbsp;&nbsp;</div>
                <el-select style="width: 500px;" size="small" class="fl" v-model="value8" filterable multiple placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="xy-Center" style="border-radius: 5px; font-size: 14px;border: 1px solid #dcdfe6;width: 60px;height: 30px;">保存</div>
            </el-col>
          </el-col>
          <el-col :span="24" style="margin-top: 20px;">
            <el-table size="mini" border stripe :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="address" label="地址">
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  export default {
    data() {
      return {
        value8: '',
        data: [{
          label: '董志永团队',
          children: [{
            label: '一级 1',
            children: [{
              label: '二级 1'
            }]
          },{
            label: '一级 2',
            children: [{
              label: '二级 1',
              children: [{
                label: '三级 1'
              }]
            }]
          }],
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        options: [
          {
            value: '吕',
            label: '吕'
          },
          {
            value: '1',
            label: '董'
          },
          {
            value: '2',
            label: '地点'
          },
          {
            value: '3',
            label: '发个'
          },
          {
            value: '4',
            label: '嘎嘎嘎'
          },
          {
            value: '5',
            label: '逛淘宝'
          }
        ]
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);

      }
    }
  };
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