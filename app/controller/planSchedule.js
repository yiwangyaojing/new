'use strict';

const Controller = require('egg').Controller;

class planScheduleController extends Controller {

  /**
   * 获取方案状态信息
   */
  async index(){
    const {ctx,service} = this
    const rule = {
      open_id: { type: 'string', required: true },
      plan_id: { type: 'string', required: true },
    };
    const req = ctx.params
    ctx.validate(rule, req);

    ctx.body = await service.planSchedule.index(req)
  }

  async create(){

    const {ctx,service} = this
    const rule = {
      open_id: { type: 'string', required: true },
      plan_id: { type: 'string', required: true },
      scd_status: { type: 'int', required: true },
      scd_time:{type: 'string',required:true},
      company_id:{type: 'int',required:true},
    };
    const req = ctx.request.body
    ctx.validate(rule, req);

    ctx.body = await service.planSchedule.create(req)
  }

}

module.exports = planScheduleController