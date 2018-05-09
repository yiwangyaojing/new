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
      htqd:{type:'int',required:true},
      sgwc:{type:'int',required:true},
      bwwc:{type:'int',required:true},
      company_id:{type:"string",required:true},
    }
    const req = ctx.request.body

    ctx.validate(rule,req)

    ctx.body = await service.overdue.update(req);

  }

  async query(){
    const {ctx,service} = this
    const rule = {
      id:{type:"int",required:false},
      level:{type:"int",required:false},
      open_id:{type:"string",required:false},
      company_id:{type:"int",required:false},
    }
    const req = ctx.request.body
    ctx.validate(rule,req)

    ctx.body =await service.overdue.query(req)
  }


}
module.exports = OverDueController