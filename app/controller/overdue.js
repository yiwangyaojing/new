'use strict';

const Controller = require('egg').Controller;

class OverDueController extends Controller {

  async index(){

    const {ctx,service} =this

    const rule = {
      company_id:{type:"string",required:true}
    }
    const req = ctx.params

    ctx.validate(rule,req)

    ctx.body = await service.overdue.index(req);

  }

  async update(){
    const {ctx,service} =this

    const rule = {
      id:{type:"string",required:true},
      htqd:{type:"string",required:true},
      sgwc:{type:"string",required:true},
      bwwc:{type:"string",required:true},
      company_id:{type:"string",required:true},
    }
    const req = ctx.request.body

    ctx.validate(rule,req)

    ctx.body = await service.overdue.update(req);

  }

}
module.exports = OverDueController