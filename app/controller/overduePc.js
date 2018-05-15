'use strict';

const Controller = require('egg').Controller;

class OverDuePcController extends Controller {

  async index(){

    const {ctx,service} =this
    let req = ctx.request.body
    // 获取用户登录信息
    const userInfo  = ctx.session.user
    req.open_id = userInfo.openid
    req.company_id = userInfo.company_id

    ctx.body = await service.overdue.index(req);

  }

  async update(){
    const {ctx,service} =this

    const rule = {
      id:{type:"int",required:true},
      htqd:{type:'int',required:true},
      sgwc:{type:'int',required:true},
      bwwc:{type:'int',required:true},
      company_id:{type:"int",required:true},
    }
    const req = ctx.request.body

    ctx.validate(rule,req)

    ctx.body = await service.overdue.update(req);

  }

}
module.exports = OverDuePcController