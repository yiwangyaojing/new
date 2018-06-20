<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-show="!from" :to="{ path: '/CustomerData'}">客户资料</el-breadcrumb-item>
      <el-breadcrumb-item v-show="from" :to="{ path: '/SettingDetails' }">进度详情</el-breadcrumb-item>
      <el-breadcrumb-item><a>客户详情</a></el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <br>
    <el-row>
      <div class="clearfix" style="font-size: 16px;font-weight: 700;">
        <div class="fl">{{this.details.cst_name}}</div>
        <el-button class="fr" @click="download()" size="mini" :disabled="disabledshow" type="primary">打包下载</el-button>
      </div>
      <el-col :span="24" style="margin: 10px 0 20px;">
        <el-col :span="3">
          <el-button size="small" @click="changefuzerenClick">变更负责人</el-button>
          <el-dialog title="变更负责人" :visible.sync="changefuzeren" width="30%">
            <el-form>
              <el-form-item label="选择团队" :label-width="updatestateWidth">
                <el-col :span="20">
                  <el-select v-model="teamval" @change="teamselectChange" size="small" placeholder="请选择" style="margin-left: 20px;width: 100%">
                    <el-option
                      v-for="item in teamlistarr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="选择负责人" :label-width="updatestateWidth">
                <el-col :span="20">
                  <el-select v-model="fuzerenval" @change="selectfuzerenChange" size="small" placeholder="请选择" style="margin-left: 20px;width: 100%">
                    <el-option
                      v-for="item in fuzerenarr"
                      :key="item.value"
                      :label="item.label"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
              <el-button type="primary" @click="fuzerensubmit" size="small">保 存</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="2">
          <el-button size="small" @click="editcustomer = true">编辑</el-button>
          <el-dialog title="编辑客户资料" :visible.sync="editcustomer" width="30%">
            <el-form :model="editform">
              <el-form-item label="客户名称" :label-width="updatestateWidth" style="margin-bottom: 10px;">
                <el-col :span="20">
                  <el-input v-model="editform.cst_name" size="small" auto-complete="off"></el-input>
                </el-col>
                <el-col :span="1" style="color: red;text-align: right;font-size: 20px;">*</el-col>
              </el-form-item>
              <el-form-item label="联系方式" :label-width="updatestateWidth" style="margin-bottom: 10px;">
                <el-col :span="20">
                  <el-input v-model="editform.cst_phone" size="small" maxlength="11" auto-complete="off"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="详细地址" :label-width="updatestateWidth" style="margin-bottom: 10px;">
                <el-col :span="20">
                  <el-input v-model="editform.cst_address" type="textarea" autosize size="small" auto-complete="off"></el-input>
                </el-col>
              </el-form-item>
              <!--<el-form-item label="组件规格" :label-width="updatestateWidth" style="margin-bottom: 10px;">-->
                <!--<el-col :span="17">-->
                  <!--<el-input v-model="editform.zj_input_format" @blur="countCapacity" size="small" auto-complete="off"></el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="3" style="text-align: right;">瓦</el-col>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="组件数量" :label-width="updatestateWidth" style="margin-bottom: 10px;">-->
                <!--<el-col :span="17">-->
                  <!--<el-input v-model="editform.zj_input_num" @blur="countCapacity" size="small" auto-complete="off"></el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="3" style="text-align: right;">块</el-col>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="装机容量" :label-width="updatestateWidth" style="margin-bottom: 10px;">-->
                <!--<el-col :span="17">-->
                  <!--<el-input v-model="editform.zj_input_capacity" size="small" auto-complete="off"></el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="3" style="text-align: right;">千瓦</el-col>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="系统单价" :label-width="updatestateWidth" style="margin-bottom: 10px;">-->
                <!--<el-col :span="17">-->
                  <!--<el-input v-model="editform.zj_unit_price" size="small" auto-complete="off"></el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="3" style="text-align: right;">元</el-col>-->
              <!--</el-form-item>-->
              <el-form-item label="总价" :label-width="updatestateWidth" style="margin-bottom: 10px;">
                <el-col :span="17">
                  <el-input v-model="editform.zj_price" size="small" auto-complete="off"></el-input>
                </el-col>
                <el-col :span="3" style="text-align: right;">元</el-col>
              </el-form-item>
              <el-form-item label="备注" :label-width="updatestateWidth" style="margin-bottom: 10px;">
                <el-col :span="20">
                  <el-input v-model="editform.cst_remark" size="small" type="textarea" autosize auto-complete="off"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
              <el-button type="primary" @click="editcustomerClick" size="small">保 存</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="2" v-if="details.canDelete === true">
          <el-button size="small" @click="deleteClick">删除</el-button>
        </el-col>
      </el-col>
      <el-col v-loading="loading">
        <div class="clearfix">
          <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
            <div class="fl" style="width: 80px;">电话</div>
            <div class="fl" style="padding:0 10px;width: 200px;border-radius: 5px;height: 30px;line-height: 30px;">{{this.details.cst_phone}}</div>
          </div>
          <div :span="10" class="clearfix fl y-Center">
            <div class="fl" style="width: 80px;">地址</div>
            <div class="fl one-txt-cut" style="padding:0 10px;min-width: 200px;border-radius: 5px;height: 30px;line-height: 30px;" >{{this.details.cst_address}}</div>
          </div>
        </div>
        <div class="clearfix" style="margin-top: 5px;">
          <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
            <div class="fl" style="width: 80px;">总价</div>
            <div class="fl clearfix" style="width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
              <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.zj_price}}</div>
              <div class="fr" style="width: 25%;text-align: center;">元</div>
            </div>
          </div>
          <div :span="10" class="clearfix fl y-Center">
            <div class="fl" style="width: 80px;">已回款</div>
            <div class="fl clearfix" style="width: 220px;border-radius: 5px;height: 30px;line-height: 30px;" >
              <div class="fl" style="width: 70%;padding-left: 10px">{{this.details.pay_sum}}</div>
              <div class="fr" style="width: 25%;text-align: center;">元</div>
            </div>
          </div>
        </div>
        <div class="clearfix" style="margin-top: 5px;">
          <div class="fl" style="width: 80px;">备注</div>
          <div class="fl">
            <div>{{this.details.cst_remark}}</div>
          </div>
        </div>
        <div class="clearfix" style="margin-top: 10px;">
          <div :span="4" class="clearfix fl" style="width: 600px;">
            <div class="fl" style="width: 80px;">合同状态:</div>
            <!--<div class="fl" style="color: #01cb32;">{{this.details.scd_name}}</div>-->
            <div class="fl" style="text-align: center">
              <div>
                <div>新增项目</div>
                <div class="iconfont icon-duihao" style="color: #00cc33;font-weight: bold"></div>
              </div>
            </div>
            <div class="fl" style="margin-left: 50px;text-align: center;">
              <div>意向沟通</div>
              <div class="iconfont icon-duihao" style="color: #00cc33;font-weight: bold" v-if="details.scd_status_all.indexOf(1)!== -1"></div>
              <div v-if="details.scd_status_all.indexOf(1) === -1">--</div>
            </div>
            <div class="fl" style="margin-left: 50px;text-align: center;">
              <div>合同签订</div>
              <div class="iconfont icon-duihao" style="color: #00cc33;font-weight: bold" v-if="details.scd_status_all.indexOf(2)!== -1"></div>
              <div v-if="details.scd_status_all.indexOf(2) === -1">--</div>
            </div>
            <div class="fl" style="margin-left: 50px;text-align: center;">
              <div>施工完成</div>
              <div class="iconfont icon-duihao" style="color: #00cc33;font-weight: bold" v-if="details.scd_status_all.indexOf(3)!== -1"></div>
              <div v-if="details.scd_status_all.indexOf(3) === -1">--</div>
            </div>
            <div class="fl" style="margin-left: 50px;text-align: center;">
              <div>验收完成</div>
              <div class="iconfont icon-duihao" style="color: #00cc33;font-weight: bold" v-if="details.scd_status_all.indexOf(4)!== -1"></div>
              <div v-if="details.scd_status_all.indexOf(4) === -1">--</div>
            </div>
          </div>
          <div :span="4" class="clearfix fl" style="">
            <div class="fl" style="width: 80px;">更新时间:</div>
            <div class="fl" style="color: #01cb32;">{{this.updated_at1}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="24" style="margin-top: 10px;font-size: 14px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="合同状态" name="1">
            <el-col>
              <el-button type="primary" @click="updatestate = true" size="small">更新状态</el-button>
            </el-col>
            <el-dialog title="更新状态" :visible.sync="updatestate" width="30%" style="padding-bottom: 10px;">
              <el-form :model="form">
                <el-form-item :label-width="formLabelWidth">
                  <el-checkbox @change="stateChange1" true-label="1" :checked="yxgtshow" :disabled="yxgtshow">意向沟通</el-checkbox>
                  <el-date-picker
                    @change="yxgttime"
                    v-model="yxgtdate"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    style="margin-left: 20px;">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <el-checkbox @change="stateChange2" true-label="2" :checked="htqdshow" :disabled="htqdshow">合同签订</el-checkbox>
                  <el-date-picker
                    @change="htqdtime"
                    v-model="htqddate"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    style="margin-left: 20px;">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <el-checkbox @change="stateChange3" true-label="3" :checked="bwwcshow" :disabled="bwwcshow">施工完成</el-checkbox>
                  <el-date-picker
                    @change="bwwctime"
                    v-model="bwwcdate"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    style="margin-left: 20px;">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <el-checkbox @change="stateChange4" true-label="4" :checked="hkwcshow" :disabled="hkwcshow">验收完成</el-checkbox>
                  <el-date-picker
                    @change="hkwctime"
                    v-model="hkwcdate"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    style="margin-left: 20px;">
                  </el-date-picker>
                </el-form-item>
              </el-form>
              <div v-if="details.scd_status_all.indexOf(9) === -1" style="text-align: center;color: red;cursor: pointer;" @click="terminationClick">项目终止</div>
              <div v-if="details.scd_status_all.indexOf(9) !== -1" style="text-align: center;color: #00cc33;cursor: pointer;" @click="recoveryClick">项目恢复</div>
              <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="updatestateClick" size="small">保 存</el-button>
              </div>
            </el-dialog>
            <el-col  v-for="(items, index) in contractProgressList" :key="index" :span="24" style="margin-bottom: 20px;">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div> {{items.scdTime}}</div>
                  <div> <div v-if="items.scd_remark !== null && items.from_name !== null"><span style="color: #01cb32">{{items.scd_remark}}</span> 将合同状态由 <span style="color: #01cb32">{{items.from_name}}</span> 改为 <span style="color: #01cb32">{{items.scd_name}}</span></div></div>
                  <div> <div v-if="items.scd_remark === null || items.from_name === null ">合同状态 :<span style="color: #01cb32">{{items.scd_name}}</span></div></div>
                  <!--<div style="color: #999;">备注：{{items.scd_r_remark}}</div>-->
                </el-card>
              </el-col>
            </el-col>
            <el-col :span="10" :offset="7">
            <el-alert
              v-if="!hetongzhuangtaishow"
              width="300px"
              title="暂无合同状态记录"
              type="warning"
              :closable= false
              center
              show-icon>
            </el-alert>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="回款" name="2">
            <el-col>
              <el-button type="primary" @click="returnmoney = true" size="small">更新回款</el-button>
            </el-col>
            <el-dialog title="更新回款" :visible.sync="returnmoney" width="30%">
              <el-form :model="moneyupdate">
                <el-form-item label="回款日期" :label-width="updatestateWidth">
                  <el-col :span="20">
                    <el-date-picker @change="hukuantiemChange"
                      v-model="moneyupdate.pay_time"
                      type="date"
                      placeholder="选择日期"
                      size="small"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      style="margin-left: 20px;width: 100%">
                    </el-date-picker>
                  </el-col>
                </el-form-item >
                <el-form-item label="回款金额" :label-width="updatestateWidth">
                  <el-col :span="20">
                    <el-input v-model="moneyupdate.pay_money" placeholder="请输入内容" style="margin-left: 20px;" size="small"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="回款方式" :label-width="updatestateWidth">
                  <el-col :span="20">
                    <el-select v-model="moneyupdate.pay_method" @change="moneyupdateChange" size="small" placeholder="请选择" style="margin-left: 20px;width: 100%">
                      <el-option
                        v-for="item in huikuangfangshi"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="备注" :label-width="updatestateWidth">
                  <el-col :span="20">
                    <el-input v-model="moneyupdate.pay_remark" type="textarea" autosize placeholder="请输入内容" style="margin-left: 20px;" size="small"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="moneyupdateClick" size="small">保 存</el-button>
              </div>
            </el-dialog>
            <el-col :span="24" style="margin-bottom: 20px;" v-for="(items, index) in payList" :key="index">
              <el-col :span="10" style="margin-top: 20px;padding: 0 10px;line-height: 30px;border-radius: 5px;">
                <el-card class="box-card">
                  <div>{{items.pay_time}}</div>
                  <div>{{items.name}} 回款 <span style="color: #01cb32">{{items.pay_money}}</span> 元</div>
                  <div style="color: #999;">备注：{{items.pay_remark}}</div>
                </el-card>
              </el-col>
            </el-col>
            <el-col :span="10" :offset="7">
            <el-alert
              v-if="!huikuanshow"
              title="暂无回款记录"
              type="warning"
              :closable= false
              center
              show-icon>
            </el-alert>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="项目勘测" name="3">
            <div v-if="paifangzishow">
              <div class="clearfix">
                <div :span="10" class="clearfix fl y-Center" style="width: 400px;">
                  <!--<div class="fl" style="width: 80px;">房屋朝向</div>-->
                  <div class="fl" style="padding:0 10px;width: 220px;border-radius: 5px;height: 30px;line-height: 30px;counter-reset: #c0c4cc;">{{this.details.h_face}}</div>
                </div>
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">{{planTextEdit[0]}}</div>
                <div v-if=" item.data_type === 0" class="fl imgs" v-for="(item,index) in details.houseImgs" :key="index"  style="width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)" alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄房屋正面及侧面照片</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">{{planTextEdit[1]}}</div>
                <div v-if=" item.data_type === 1" class="fl imgs" v-for="(item,index) in details.houseImgs" :key="index" style="width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)" alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄用户的电表</div>
                </div>-->
              </div>
              <div  class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">{{planTextEdit[2]}}</div>
                <div class="fl imgs" v-if=" item.data_type === 2" v-for="(item,index) in details.houseImgs" :key="index" style="margin-right: 5px;width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;" v-if="item.data_type === 2" :src="item.mini_url" @click="showMax(item.url)"  alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">可以拍摄用户房屋周边环境</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">备注</div>
                <div class="fl" style="width: 400px;height:60px;border-radius: 5px; ">{{this.details.h_remark}}</div>
              </div>
            </div>
            <el-col :span="10" :offset="7">
            <el-alert
              v-if="!paifangzishow"
              title="项目未勘测"
              type="warning"
              :closable= false
              center
              show-icon>
            </el-alert>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="资料收集" name="4">
            <div v-if="shouziliaoshow">
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl imgs" style="width: 80px;">{{planInfoEdit[0]}}</div>
                <div class="fl imgs"  v-if="item.data_type === 0" v-for="(item,index) in details.dataImgs" :key="index" style="width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;" :src="item.mini_url" @click="showMax(item.url)" alt="">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl imgs" style="width: 80px;">{{planInfoEdit[1]}}</div>
                <div class="fl imgs" v-if="item.data_type === 1" v-for="(item,index) in details.dataImgs" :key="index" style="margin-right: 5px;width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)"  alt="暂无图片">
                </div>
                <!--<div class="fl imgs">-->
                <!--<div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>-->
                <!--<div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>-->
                <!--</div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl imgs" style="width: 80px;">{{planInfoEdit[2]}}</div>
                <div class="fl imgs" v-if="item.data_type === 2" v-for="(item,index) in details.dataImgs" :key="index" style="margin-right: 5px;width: 70px; height: 70px;">
                  <img style="width: 70px; height: 70px;"  :src="item.mini_url" @click="showMax(item.url)"  alt="暂无图片">
                </div>
                <!--<div class="fl imgs">
                  <div style="width: 70px; height: 70px;border: 1px dashed #e4e7ed;text-align: center;line-height: 70px;font-size: 30px;color: #c0c4cc">+</div>
                  <div style="color: #c0c4cc;font-size: 10px;margin-top: 5px;">重点拍摄证件正面照片</div>
                </div>-->
              </div>
              <div class="clearfix" style="margin-top: 20px;">
                <div class="fl" style="width: 80px;">备注</div>
                <div class="fl" style="width: 400px;height:60px;border-radius: 5px; ">{{this.details.d_remark}}</div>
              </div>
            </div>
            <el-col :span="10" :offset="7">
            <el-alert
              v-if="!shouziliaoshow"
              title="资料未收集"
              type="warning"
              center
              :closable= false
              show-icon>
            </el-alert>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      title="查看大图"
      :visible.sync="centerDialogVisible"
      width="50%"
      height="40%"
      center>
      <!--放大后的图片start-->
      <el-button type="text" @click="showMax1()" style="margin-top: -40px;">
        <div class="fl imgs">
          <img style="width: 100%; height: 100%" :src="maxImgUrl"  alt="暂无图片">
        </div>
      </el-button>
      <!--放大后的图片end-->
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="downloadDialog"
      width="30%">
      <span>{{dialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
         <el-button @click="downloadDialog = false">取 消</el-button>
        <el-button type="primary" @click="downLoadData">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{dialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>
<script>
import axios from 'axios'
import values from '../../utils/values'
export default {
  data () {
    return {
      loading: false,
      loading1: false,
      loading2: false,
      from: true,
      planTextEdit: ['类别1', '类别2', '类别3'],
      planInfoEdit: ['类别1', '类别2', '类别3'],
      open_id: '',
      company_id: '',
      teamid: '',
      modevalue: '',
      paifangzishow: true,
      hetongzhuangtaishow: true,
      huikuanshow: true,
      shouziliaoshow: true,
      paibanzishow: true,
      disabledshow: false,
      maxImgUrl: '', // 图片放大url地址
      centerDialogVisible: false, // 图片放大Dialog框 默认值
      collapsed: false,
      dialogVisible: false, // 提示信息
      downloadDialog: false, // 下载模态框默认值
      dialogMessage: '', // 提示信息
      imgVisible: false,
      activeName: '1',
      contractProgressList: [], // 合同状态列表
      payList: [], // 回款状态列表
      updated_at1: '', // 格式化后的更新时间
      details: { // 客户详细信息
        user_name: '', // 负责人
        cst_name: '', //  客户名称
        cst_phone: '', //  客户电话
        cst_address: '', //  客户地址
        cst_remark: '', //  客户备注
        zj_input_format: '', //  组件规格
        zj_input_capacity: '', // 装机容量
        zj_input_num: '', //  组件数量
        zj_unit_price: '', //  系统单价
        zj_price: '', //  总价
        pay_sum: '', //  回款金额
        updated_at: '', //  更新时间
        scd_name: '', //  进度名称
        rf_remark: '', // 排版子备注
        h_remark: '', // 拍房子备注
        d_remark: '', // 收资料备注
        cst_latitude: '', // 纬度
        cst_longitude: '', // 经度
        h_face: '', // 房屋朝向,
        scd_status_all: ''
      },
      returnmoney: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '40px',
      updatestateWidth: '120px',
      updatestate: false,
      updatestateform: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      value1: '',
      moneynum: '',
      options: [],
      editcustomer: false,
      editform: {
        cst_name: '',
        cst_phone: '',
        zj_input_format: '',
        zj_input_num: '',
        zj_input_capacity: '',
        zj_unit_price: '',
        zj_price: '',
        cst_remark: '',
        id: '',
        cst_address: ''
      },
      huikuangfangshi: [
        {
          value: '现金',
          label: '现金'
        },
        {
          value: 'POS机',
          label: 'POS机'
        },
        {
          value: '银行转账',
          label: '银行转账'
        },
        {
          value: '银行贷款',
          label: '银行贷款'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      changefuzeren: false,
      teamselectvalue: '',
      moneyupdate: {
        plan_id: '',
        zj_price: '',
        pay_money: '',
        pay_time: new Date(),
        pay_method: '现金',
        pay_remark: '',
        pay_id: '',
        pay_gap: ''
      },
      stateform: {
        plan_id: '',
        createArray: [

        ],
        updateArray: [],
        open_id: ''
      },
      yxgtdate: new Date(),
      htqddate: new Date(),
      bwwcdate: new Date(),
      hkwcdate: new Date(),
      yxgtshow: false,
      htqdshow: false,
      bwwcshow: false,
      hkwcshow: false,
      fuzerenval: '',
      teamval: '',
      teamlistarr: [],
      fuzerenarr: [],
      biangengopen_id: ''
    }
  },
  methods: {
    // 获取文字编辑

    get_info_text () {
      let companyId = this.company_id
      if (!companyId) {
        return
      }
      axios.post('api/planInfoEdit/get', {companyId: companyId}).then((data) => {
        console.log('获取成功', data)
        if (data && data.length > 1) {
          this.planInfoEdit = [data[0], data[1], data[2]]
        }
      }).catch((err) => {
        console.log('获取失败', err)
      })
    },
    // 获取公司项目勘测数据 修改的文字
    get_plan_text () {
      let companyId = this.company_id
      if (!companyId) {
        return
      }
      axios.post('api/planTextEdit/get', {companyId: companyId}).then((data) => {
        console.log('获取成功', data)
        if (data && data.length > 1) {
          this.planTextEdit = [data[0], data[1], data[2]]
        }
      }).catch((err) => {
        console.log('获取失败', err)
      })
    },
    // 切换 tab 显示不同内容
    handleClick (tab, event) {
      console.log('tab切换', tab.name)
      if (tab.name === '0') {
        this.initData()
      } else if (tab.name === '3') {
        this.initData()
        if (this.details.h_is_finish === 0) {
          // this.dialogVisible = true
          // this.dialogMessage = '房屋信息未采集'
          this.showWarningTips('项目未勘测')
          this.paifangzishow = false
        }
      } else if (tab.name === '4') {
        this.initData()
        if (this.details.d_is_finish === 0) {
          // this.dialogVisible = true
          // this.dialogMessage = '客户资料未采集'
          this.showWarningTips('资料未采集')
          this.shouziliaoshow = false
        }
      } else if (tab.name === '5') {
        this.initData()
        if (this.details.rf_is_finish === 0) {
          // this.dialogVisible = true
          // this.dialogMessage = '排版子未采集'
          this.showWarningTips('暂无设计方案')
          this.paibanzishow = false
        }
      } else if (tab.name === '1') {
        let planId = this.$route.query.planId
        console.log('id', planId)
        if (planId) {
          // 返回客户合同状态列表
          axios.get('/api/pc/customerDataPc/contractStatus/' + planId).then(resp => {
            if (resp.length === 0) {
              this.hetongzhuangtaishow = false
              this.showWarningTips('暂无合同状态记录')
            }
            this.contractProgressList = []
            for (let i = 0; i < resp.length; i++) {
              if (resp[i].scd_name === '并网完成') {
                resp[i].scd_name = '验收完成'
              }
              let contractProgress = {
                scd_name: resp[i].scd_name, // 进度名称
                from_name: resp[i].from_name, // 来源名称
                scd_remark: resp[i].scd_remark, // 负责人
                scd_r_remark: resp[i].scd_r_remark, // 进度备注
                scdTime: resp[i].scdTime
                // scd_time: resp[i].scdTime === null ? resp[i].scdTime : resp[i].scdTime.substring(0, 10) // 更新时间
              }
              this.contractProgressList.push(contractProgress)
            }
          })
        }
      } else {
        let planId = this.$route.query.planId
        console.log('id', planId)
        if (planId) {
          // 返回客户回款列表
          axios.get('/api/pc/customerDataPc/payStatus/' + planId).then(resp => {
            if (resp.length === 0) {
              // this.dialogVisible = true
              // this.dialogMessage = '暂无回款记录'
              this.huikuanshow = false
              this.showWarningTips('暂无回款记录')
            }
            this.payList = []
            for (let i = 0; i < resp.length; i++) {
              let payProgress = {
                name: resp[i].name, // 负责人
                pay_money: resp[i].pay_money, // 回款金额
                pay_remark: resp[i].pay_remark, // 进度备注
                pay_time: resp[i].pay_time.slice(0, 10)// 回款时间
              }
              this.payList.push(payProgress)
            }
          })
        }
      }
    },
    // 初始化数据 默认进入客户详情的概览页
    initData () {
      this.loading = true
      this.loading1 = true
      let planId = this.$route.query.planId
      if (planId) {
        axios.get('/api/pc/customerDataPc/planDetail/' + planId).then(resp => {
          this.updated_at1 = resp.updateTime
          console.log('7777777777', this.updated_at1)
          this.details = resp
          console.log('99999', this.details)
          this.editform.cst_name = resp.cst_name
          this.editform.cst_phone = resp.cst_phone
          this.editform.zj_input_format = resp.zj_input_format
          this.editform.zj_input_num = resp.zj_input_num
          this.editform.zj_input_capacity = resp.zj_input_capacity
          this.editform.zj_unit_price = resp.zj_unit_price
          this.editform.zj_price = resp.zj_price
          this.editform.cst_remark = resp.cst_remark
          this.editform.id = resp.id
          this.editform.cst_address = resp.cst_address
          this.moneyupdate.plan_id = resp.id
          this.moneyupdate.zj_price = resp.zj_price
          this.moneyupdate.pay_gap = resp.pay_gap
          this.moneyupdate.pay_id = resp.pay_id ? String(resp.pay_id) : '0'
          this.stateform.plan_id = resp.id
          if (resp.scd_status_all.indexOf('1') !== -1) {
            this.yxgtshow = true
          }
          if (resp.scd_status_all.indexOf('2') !== -1) {
            this.htqdshow = true
          }
          if (resp.scd_status_all.indexOf('3') !== -1) {
            this.bwwcshow = true
          }
          if (resp.scd_status_all.indexOf('4') !== -1) {
            this.hkwcshow = true
          }
          if (resp.scd_status_all.indexOf('9') !== -1) {
            this.yxgtshow = true
            this.htqdshow = true
            this.bwwcshow = true
            this.hkwcshow = true
          }
          this.loading = false
          this.loading1 = false
        })
        axios.get('/api/pc/customerDataPc/contractStatus/' + planId).then(resp => {
          if (resp.length === 0) {
            this.hetongzhuangtaishow = false
            this.showWarningTips('暂无合同状态记录')
          }
          console.log(resp)
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].scdTime) {
              // resp[i].scdTime = resp[i].scdTime.substring(0, 10) // 更新时间
              if (resp[i].scd_status === 1) {
                this.yxgtdate = resp[i].scdTime
              } else if (resp[i].scd_status === 2) {
                this.htqddate = resp[i].scdTime
              } else if (resp[i].scd_status === 3) {
                this.bwwcdate = resp[i].scdTime
              } else if (resp[i].scd_status === 4) {
                this.hkwcdate = resp[i].scdTime
              }
            }
            console.log('合同状态', this.contractProgressList)
          }
          this.contractProgressList = resp
        })
      }
    },
    // 图片放大方法
    showMax (url) {
      console.log('url===>>', url)
      this.centerDialogVisible = true
      this.maxImgUrl = url
    },
    showMax1 () {
      this.centerDialogVisible = false
    },
    download () {
      if (this.details.d_is_finish === 0 && this.details.h_is_finish === 0) {
        this.dialogVisible = true
        this.dialogMessage = '无可下载的资源'
        this.disabledshow = true
      } else {
        this.downloadDialog = true
        this.dialogMessage = '是否下载该用户所有资料'
        this.disabledshow = false
      }
    },
    downLoadData () {
      this.downloadDialog = false
      let shortUrl = this.details.short_url
      console.log('666666', shortUrl)
      let uat = '/test'
      let context = 'https://mp.xiaosolar.com/backend-api'
      // 判断环境
      let href = window.location.href

      if (href.indexOf(uat) !== -1) {
        context = 'https://mpa.xiaosolar.com/backend-api' // 测试环境
      }

      let url = context + '/backend/file/download/' + shortUrl
      window.location.href = url
    },
    showWarningTips (text) {
      this.$message({
        message: text,
        type: 'warning'
      })
    },
    editcustomerClick () {
      if (this.editform.cst_name === '') {
        this.$message.error('客户名称不能为空')
        return
      }
      this.editcustomer = false
      axios.put('/api/pc/planPc', this.editform).then(res => {
        console.log('编辑接口打印', res)
        this.initData()
      })
    },
    hukuantiemChange (e) {
      console.log('回款日期', e)
      this.moneyupdate.pay_time = e
    },
    moneyupdateChange (e) {
      this.moneyupdate.pay_method = e
    },
    moneyupdateClick () {
      if (!this.moneyupdate.pay_money) {
        this.$message.error('请输入回款金额')
        return
      }
      this.loading2 = true
      this.moneyupdate.pay_money = Number(this.moneyupdate.pay_money)
      if (this.moneyupdate.pay_money > this.moneyupdate.zj_price) {
        this.$message.error('回款金额不能大于总金额')
        return
      }
      this.returnmoney = false
      axios.post('/api/pc/planPayPc', this.moneyupdate).then(res => {
        console.log('更新回款', res)
        axios.get('/api/pc/customerDataPc/payStatus/' + this.moneyupdate.plan_id).then(resp => {
          this.payList = []
          for (let i = 0; i < resp.length; i++) {
            let payProgress = {
              name: resp[i].name, // 负责人
              pay_money: resp[i].pay_money, // 回款金额
              pay_remark: resp[i].pay_remark, // 进度备注
              pay_time: resp[i].pay_time.slice(0, 10)// 回款时间
            }
            this.payList.push(payProgress)
            this.loading2 = false
          }
        })
      })
    },
    alldata () {
      setTimeout(() => {
        axios.get('/api/planSchedule/' + this.open_id + '/' + this.moneyupdate.plan_id).then(res => {
          console.log('全部数据', res)
        })
      }, 500)
    },
    stateChange1 (e) {
      if (e === '1') {
        this.stateform.createArray.push({status: 1, time: this.yxgtdate})
      } else {
        for (let i = 0; i < this.stateform.createArray.length; i++) {
          if (this.stateform.createArray[i].status === 1) {
            this.stateform.createArray.splice(i, 1)
            console.log(this.stateform.createArray)
          }
        }
      }
    },
    stateChange2 (e) {
      if (e === '2') {
        this.stateform.createArray.push({status: 2, time: this.htqddate})
      } else {
        for (let i = 0; i < this.stateform.createArray.length; i++) {
          if (this.stateform.createArray[i].status === 2) {
            this.stateform.createArray.splice(i, 1)
            console.log(this.stateform.createArray)
          }
        }
      }
    },
    stateChange3 (e) {
      if (e === '3') {
        this.stateform.createArray.push({status: 3, time: this.bwwcdate})
      } else {
        for (let i = 0; i < this.stateform.createArray.length; i++) {
          if (this.stateform.createArray[i].status === 3) {
            //            this.stateform.createArray = this.stateform.createArray.splice(i,1)
            this.stateform.createArray.splice(i, 1)
            console.log(this.stateform.createArray)
          }
        }
      }
    },
    stateChange4 (e) {
      if (e === '4') {
        this.stateform.createArray.push({status: 4, time: this.hkwcdate})
      } else {
        for (let i = 0; i < this.stateform.createArray.length; i++) {
          if (this.stateform.createArray[i].status === 4) {
            //            this.stateform.createArray = this.stateform.createArray.splice(i,1)
            this.stateform.createArray.splice(i, 1)
            console.log(this.stateform.createArray)
          }
        }
      }
    },
    yxgttime (e) {
      this.yxgtdate = e
      this.addUpdateArray(1, this.yxgtdate)
      // if (this.details.scd_status_all.indexOf('1') !== -1) {
      //
      //   // this.stateform.updateArray.push({status: 1, time: this.yxgtdate})
      // }
    },
    htqdtime (e) {
      this.htqddate = e
      this.addUpdateArray(2, this.htqddate)
      // if (this.details.scd_status_all.indexOf('2') !== -1) {
      //   // this.stateform.updateArray.push({status: 2, time: this.htqddate})
      // }
    },
    bwwctime (e) {
      this.bwwcdate = e
      this.addUpdateArray(3, this.bwwcdate)
      // if (this.details.scd_status_all.indexOf('3') !== -1) {
      //   this.addUpdateArray(3, this.bwwcdate)
      //   // this.stateform.updateArray.push({status: 3, time: this.bwwcdate})
      // }
    },
    hkwctime (e) {
      this.hkwcdate = e
      this.addUpdateArray(4, this.hkwcdate)
      // if (this.details.scd_status_all.indexOf('4') !== -1) {
      //   //   this.stateform.updateArray.push({status: 4, time: this.hkwcdate})
      // }
    },
    updatestateClick () {
      this.updatestate = false
      this.stateform.open_id = this.open_id
      axios.put('/api/pc/planSchedulePc', this.stateform).then(res => {
        this.initData()
        this.stateform.updateArray = []
        this.stateform.createArray = []
      })
    },
    addUpdateArray (status, time) {
      // 遍历create
      let tempCreate
      for (let create of this.stateform.createArray) {
        if (create.status === status) {
          tempCreate = create
          break
        }
      }
      if (tempCreate) {
        tempCreate.time = time
        console.log('create:', this.stateform)
        return
      }

      if (this.details.scd_status_all.indexOf(status) !== -1) {
        // 遍历update 去重
        let tempUpdate
        for (let update of this.stateform.updateArray) {
          if (update.status === status) {
            tempUpdate = update
            break
          }
        }
        if (tempUpdate) {
          tempUpdate.time = time
        } else {
          this.stateform.updateArray.push({status: status, time: time})
        }
      }
      console.log('update:', this.stateform)
    },
    terminationClick () {
      this.$confirm('此操作将终止项目状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/pc/planSchedulePc/stop', {plan_id: this.stateform.plan_id}).then(res => {
          console.log('项目终止接口', res)
          this.updatestate = false
          this.initData()
          this.$message({
            type: 'success',
            message: '终止成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    recoveryClick () {
      this.$confirm('此操作将恢复项目状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/pc/planSchedulePc/resume', {plan_id: this.stateform.plan_id}).then(res => {
          console.log('项目启用接口', res)
          if (this.details.scd_status_all.indexOf('1') !== -1) {
            this.yxgtshow = true
          } else {
            this.yxgtshow = false
          }
          if (this.details.scd_status_all.indexOf('2') !== -1) {
            this.htqdshow = true
          } else {
            this.htqdshow = false
          }
          if (this.details.scd_status_all.indexOf('3') !== -1) {
            this.bwwcshow = true
          } else {
            this.bwwcshow = false
          }
          if (this.details.scd_status_all.indexOf('4') !== -1) {
            this.hkwcshow = true
          } else {
            this.hkwcshow = false
          }
          this.updatestate = false
          this.initData()
          this.$message({
            type: 'success',
            message: '启用成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    changefuzerenClick () {
      this.changefuzeren = true
      this.teamlistarr = []
      this.fuzerenarr = []
      axios.post('/api/teamUser/manageTeam', {openId: this.open_id, companyId: this.company_id}).then(res => {
        console.log('变更负责人团队列表', res)
        let ids = res[0]
        if (ids && ids.length > 0) {
          for (let i = 0; i < res[1].length; i++) {
            let objdata = {
              value: res[1][i].id,
              label: res[1][i].name
            }
            this.teamlistarr.push(objdata)
          }
          this.teamval = res[1][0].name
          this.teamid = res[1][0].id
        }

        axios.get('/api/teamUser/user/' + this.open_id).then(resp => {
          console.log('dddjdjdjdjfjfjfjfj', resp)
          if (resp.teams && resp.teams.length > 0) {
            for (let i = 0; i < resp.teams.length; i++) {
              let objdata1 = {
                value: resp.teams[i].id,
                label: resp.teams[i].name
              }
              if (!ids || ids.length < 1) {
                this.teamval = resp.teams[0].name
                this.teamid = resp.teams[0].id
                this.teamlistarr.push(objdata1)
              } else {
                if (ids.indexOf(resp.teams[i].id) === -1) {
                  console.log('what fuck')
                  this.teamlistarr.push(objdata1)
                }
              }
            }
          }
        })
        this.fuzerendata()
      })
    },
    teamselectChange (e) {
      console.log(e)
      this.teamid = e
      this.fuzerenarr = []
      this.fuzerendata()
    },
    fuzerendata () {
      axios.get('/api/teamUser/' + this.teamid).then(res => {
        console.log('负责人列表', res)
        for (let i = 0; i < res.length; i++) {
          let obj = {
            value: res[i].open_id,
            label: res[i].name
          }
          this.fuzerenarr.push(obj)
        }
        if (res.length > 0) {
          this.fuzerenval = res[0].name
          this.biangengopen_id = res[0].open_id
        } else {
          this.fuzerenval = ''
        }
      })
    },
    fuzerensubmit () {
      this.changefuzeren = false
      let formdata = {
        customerId: this.details.id,
        openId: this.biangengopen_id,
        userName: this.fuzerenval,
        teamId: this.teamid,
        operatorName: this.fuzerenval
      }
      if (this.details.open_id !== this.biangengopen_id) {
        if (this.fuzerenval === '') {
          this.$alert('负责人不能为空', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
        axios.post('/api/pc/planPc/changePlanOwner', formdata).then(res => {
          console.log('变更保存', res)
          this.initData()
          this.alldata()
        })
      } else {
        this.$alert('不能转给项目目前的负责人', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      }
    },
    selectfuzerenChange (e) {
      this.biangengopen_id = e.value
      this.fuzerenval = e.label
      console.log('斯蒂芬斯蒂芬胜多负少', this.fuzerenval, e)
    },
    deleteClick () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/plans/' + this.details.id).then(res => {
          console.log('删除成功', res)
          this.$router.push({path: '/CustomerData'})
          //          window.close()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    countCapacity () {
      let zjFormat = this.editform.zj_input_format
      let zjNum = this.editform.zj_input_num
      if (zjFormat && zjNum) {
        this.editform.zj_input_capacity = (zjFormat * zjNum / 1000).toFixed(2).toString()
      }
    }
  },
  mounted () {
    // let myDate = new Date()
    // this.hkwcdate = myDate.toLocaleDateString()
    // this.bwwcdate = myDate.toLocaleDateString()
    // this.htqddate = myDate.toLocaleDateString()
    // this.yxgtdate = myDate.toLocaleDateString()
    let sessionUser = JSON.parse(sessionStorage.getItem(values.storage.user)) || {}
    console.log('user表', sessionUser)
    this.open_id = sessionUser.openid
    this.company_id = sessionUser.company_id
    if (this.$route.query.from === 1) {
      this.from = true
    } else {
      this.from = false
    }
    this.initData()
    this.alldata()
    this.get_plan_text()
    this.get_info_text()
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
