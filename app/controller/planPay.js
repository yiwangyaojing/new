'use strict';

const Controller = require('egg').Controller;

class planPayController extends Controller {

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

    ctx.body = await service.planPay.index(req)
  }

  async create(){

    const {ctx,service} = this
    const rule = {
      open_id: { type: 'string', required: true },
      plan_id: { type: 'string', required: true },
      zj_price: { type: 'number', required: true },
      pay_money:{type: 'number', required: true},
      pay_time:{type: 'string',required:true},
      pay_id:{type: 'string',required:false}
    };
    let req = ctx.request.body
    ctx.validate(rule, req);

    ctx.body = await service.planPay.create(req)
  }
}

module.exports= planPayController