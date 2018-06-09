'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

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
      // company_id:{type: 'int',required:true},
    };
    const req = ctx.request.body
    ctx.validate(rule, req);

    ctx.body = await service.planSchedule.create(req)
  }

  async writeNote() {
    const { ctx, service } = this;
    const rule = {
      content: { type: 'string', required: true },
      plan_id: { type: 'int', required: true },
      open_id: { type: 'string', required: true },
      scd_remark: { type: 'string', required: true },
    };
    const req = ctx.request.body;
    ctx.validate(rule, req);
    ctx.body = await service.planSchedule.writeNote(req);
  }

  async updateSchedule() {
    const { ctx, service } = this;
    const rule = {
      createArray: { type: 'array', required: false },
      updateArray: { type: 'array', required: false },
      plan_id: { type: 'int', required: true },
      open_id: { type: 'string', required: true },
      scd_remark: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.request.body);
    ctx.body = await service.planSchedule.updateSchedule(ctx.request.body);
  }

  async stop() {
    const { ctx, service } = this;
    const rule = {
      plan_id: { type: 'int', required: true },
      open_id: { type: 'string', required: true },
      scd_remark: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.request.body);
    ctx.body = await service.planSchedule.stop(ctx.request.body);
  }

  async resume() {
    const { ctx, service } = this;
    const rule = {
      plan_id: { type: 'int', required: true },
    };
    ctx.validate(rule, ctx.request.body);
    ctx.body = await service.planSchedule.resume(ctx.request.body);
  }
}

module.exports = planScheduleController