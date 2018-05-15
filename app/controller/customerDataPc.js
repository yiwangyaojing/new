'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class CustomerDataPc extends Controller {
    /**
     * PC端根据 参数条件 查询客户列表
     * @returns {Promise.<void>}
     */
    async findParamsByPage(){
        const {ctx, service} = this;
        const openId = ctx.session.user.openid;
        const companyId = ctx.session.user.company_id;
        Object.assign(ctx.request.body, { companyId, openId});
        const rule = {
            openId: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.request.body);
        console.log(ctx.request.body);
        console.log("这里是service"+service);
        console.log("这里是service方法"+service.customerDataPc);
        ctx.body = await service.customerDataPc.findParamsByPage(ctx.request.body);
    }

    /**
     * PC端 客户详情 概况 拍房子 收资料  排版子
     * @returns {Promise.<void>}
     */
    async details() {
        const {ctx, service} = this;
        const rule = {
            id: { type: 'string', required: true },
        };
        ctx.validate(rule, { id: ctx.params.id });
        console.log(ctx.params.id)
        ctx.body = await service.customerDataPc.details(ctx.params.id);
    }


    /**
     * PC端客户详情合同状态
     */
    async findContractStatusById(){
        const {ctx, service} = this;
        const rule = {
            id: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params);
        ctx.body = await service.customerDataPc.findContractStatusById(ctx.params.id);
    }

    /**
     * PC端客户详情回款
     */
    async findPayStatusById(){
        const {ctx, service} = this
        const openId = ctx.session.user.openid;
        const id = ctx.params.id
        Object.assign(ctx.request.body, {openId, id});
        const rule = {
            openId: {type: 'string', required: true}, // 操作人id
        }
        ctx.validate(rule, ctx.request.body);
        console.log(ctx.request.body);
        ctx.body = await service.customerDataPc.findPayStatusById(ctx.request.body)
    }

  /**
   * 客户信息导入导出功能相关
    */
  async teamAndUser() {
    const { ctx, service } = this;

    // 取出个人信息和管理的团队信息
    const userInfo = await this.ctx.service.customerDataPc.findByOpenId(this.ctx.params.id);

    // 取出公司所有用户团队信息
    // teamInfo.agents 公司所有用户信息
    // teamInfo.teams 公司所有团队信息
    ctx.body = await this.ctx.service.customerDataPc.getFriendList(userInfo.company_id);
  }

  async importExcelData() {
    const { ctx, service } = this;
    // 页面上传的excel数据
    const excelData = this.ctx.request.body;
    // 取出个人信息和管理的团队信息
    const userInfo = await this.ctx.service.user.findByOpenId(this.ctx.params.id);
    // 取出公司所有用户团队信息
    // teamInfo.agents 公司所有用户信息
    // teamInfo.teams 公司所有团队信息
    const teamUser = await this.ctx.service.teamUser.getFriendList(userInfo.company_id);

    const currentDate = moment().format('YYYY-MM-DD');
    if (excelData) {
      for (let i = 0; i < excelData.length; i++) {
        for (let j = 0; j < teamUser.agents.length; j++) {
          // 用户匹配
          if (teamUser.agents[j].name === excelData[i][1]) {
            for (let k = 0; k < teamUser.agents[j].teams.length; k++) {
              // 团队匹配
              if (teamUser.agents[j].teams[k].teamName === excelData[i][0]) {
                let planObj = {};
                let planPayObj = {};
                planObj.open_id = teamUser.agents[j].open_id;
                planObj.user_name = excelData[i][1];
                planObj.cst_name = excelData[i][2];
                planObj.cst_phone = excelData[i][3];
                planObj.cst_address = excelData[i][4];
                planObj.zj_input_format = excelData[i][5];
                planObj.zj_input_num = excelData[i][6];
                planObj.cst_remark = excelData[i][7];
                planObj.zj_price = excelData[i][8];
                // 如果没有回款金额，未回款为合同金额
                if (excelData[i][9] === "") {
                  planObj.pay_gap = excelData[i][8];
                } else {
                  planObj.pay_sum = excelData[i][9];
                  planObj.pay_gap = excelData[i][8] - excelData[i][9];
                  // 有回款时间用回款时间，否则用当前导入时间
                  if (excelData[i][14] === "") {
                    planObj.pay_time = currentDate;
                  } else {
                    planObj.pay_time = excelData[i][14];
                  }
                  // x_plan_pay 表相关
                  planPayObj.open_id = teamUser.agents[j].open_id;
                  planPayObj.zj_price = planObj.zj_price;
                  planPayObj.pay_period = 1;// 汇款批次默认为1
                  planPayObj.pay_time = planObj.pay_time;
                  planPayObj.pay_money = planObj.pay_sum;
                  planPayObj.pay_gap = planObj.pay_gap;
                  planPayObj.pay_sum = planObj.pay_sum;
                  planPayObj.pay_method = "现金";// 默认现金
                  planPayObj.pay_remark = "";
                }

                planObj.team_id = teamUser.agents[j].team_id;
                planObj.company_id = userInfo.company_id;
                // 往x_plan表插数据
                const planResult = await this.ctx.model.XPlans.create(planObj);

                // 往x_plan_pay表插数据
                // 把成功插入plan表的id作为x_plan_pay的plan_id
                if (Object.keys(planPayObj).length !== 0) {
                  planPayObj.plan_id = planResult.id;
                  const planPayResult = await this.ctx.model.XPlanPay.create(planPayObj);
                  await this.ctx.model.XPlans.update({ pay_id: planPayResult.id }, { where: { id: planResult.id } });
                }

                // 增加项目进度
                let planScheduleObj = {};
                let planScheduleResult = "";
                planScheduleObj.open_id = planObj.open_id;
                planScheduleObj.plan_id = planResult.id;
                planScheduleObj.scd_remark = excelData[i][1];

                // 有新建项目时间
                planScheduleObj.scd_status = 0;
                planScheduleObj.scd_name = "新增项目";
                planScheduleObj.scd_time = (excelData[i][10]==="")?currentDate:excelData[i][10];
                planScheduleResult = await this.ctx.model.XPlanSchedule.create(planScheduleObj);

                if (excelData[i][11] !== ""){
                  // 有签订合同时间
                  planScheduleObj.scd_status = 2;
                  planScheduleObj.scd_name = "合同签订";
                  planScheduleObj.scd_time = excelData[i][11];
                  if(excelData[i][10] !== ""){
                    planScheduleObj.from_status = 0;
                    planScheduleObj.from_name = "新增项目";
                  }
                  planScheduleResult = await this.ctx.model.XPlanSchedule.create(planScheduleObj);
                }
                if(excelData[i][12] !== ""){
                  // 有施工完成时间
                  planScheduleObj.scd_status = 3;
                  planScheduleObj.scd_name = "施工完成";
                  planScheduleObj.scd_time = excelData[i][12];
                  if(excelData[i][11] !== ""){
                    planScheduleObj.from_status = 2;
                    planScheduleObj.from_name = "合同签订";
                  }else if(excelData[i][10] !== ""){
                    planScheduleObj.from_status = 0;
                    planScheduleObj.from_name = "新增项目";
                  }
                  planScheduleResult = await this.ctx.model.XPlanSchedule.create(planScheduleObj);
                }
                if(excelData[i][13] !== ""){
                  // 有施工完成时间
                  planScheduleObj.scd_status = 4;
                  planScheduleObj.scd_name = "并网完成";
                  planScheduleObj.scd_time = excelData[i][13];
                  if(excelData[i][12] !== ""){
                    planScheduleObj.from_status = 3;
                    planScheduleObj.from_name = "施工完成";
                  }else if(excelData[i][11] !== ""){
                    planScheduleObj.from_status = 2;
                    planScheduleObj.from_name = "合同签订";
                  }else if(excelData[i][10] !== ""){
                    planScheduleObj.from_status = 0;
                    planScheduleObj.from_name = "新增项目";
                  }
                  planScheduleResult = await this.ctx.model.XPlanSchedule.create(planScheduleObj);
                }

                // 修改原客户信息里的项目进度
                await this.ctx.model.XPlans.update(
                  {scd_id:planScheduleResult.id,scd_status:planScheduleResult.scd_status,
                  scd_time:planScheduleResult.scd_time,scd_name:planScheduleResult.scd_name
                  },{where:{id:planResult.id}}
                )

                break;
              }
            }
            break;
          }
        }
      }
    }

    ctx.body = 'import success';
  }

}


module.exports = CustomerDataPc;