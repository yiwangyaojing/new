'use strict';

const Service = require('egg').Service;
class OverDueService extends Service {

  async index(req){
    return await this.ctx.model.XOverdue.findOne({where:{company_id:req.company_id}})
  }

  async update(req){
    return await this.ctx.model.XOverdue.update(req,{where:{id:req.id,company_id:req.company_id}})
  }
}

module.exports = OverDueService