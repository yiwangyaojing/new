'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize')
const FileType = require('../const/FileType')
class planPayService extends Service {

  async index(req){

    return await this.ctx.model.XPlanPay.findAll({where:{plan_id:req.plan_id} , order:[['created_at','desc']]})
  }


  async create(req){

    const ctx = this.ctx
    let payId = req.pay_id
    let pay = {}
    let resp = {}

    if(payId && payId!=='0'){
      // 获取上次最新状态
      pay  = await ctx.model.XPlanPay.findOne(
        {
          where:{
            plan_id:req.plan_id,
            id:payId
          },
          order:[["created_at" ,"desc"]],
        })
      req.pay_period = pay.pay_period + 1
      req.pay_gap  = req.zj_price - req.pay_money - pay.pay_sum
      req.pay_sum  = req.pay_money + pay.pay_sum
    }else{
      req.pay_period = 1
      req.pay_gap  = req.zj_price - req.pay_money
      req.pay_sum = req.pay_money
    }


    const cfg = this.config.sequelize;
    cfg.logging = false;
    const sequelize = new Sequelize(cfg);

    await sequelize.transaction(function(t) {
      return ctx.model.XPlanPay.create(req, { transaction: t }).then(function(result) { // 保存回款记录
        resp = result
        let params = {
          pay_id : result.id,
          pay_sum: result.pay_sum,
          pay_gap: result.pay_gap,
          pay_time:result.pay_time
        }
        if(result.pay_gap === 0){
          params.overdue_date = '',
          params.scd_status = FileType.schedule.hkwc
        }
        return ctx.model.XPlans.update(params,{where: {open_id:req.open_id,id:req.plan_id}}, {transaction: t})
      });
    }).catch(function(err) {
      console.log(err);
    });

    return resp;

  }

}
module.exports= planPayService