'use strict';

const Controller = require('egg').Controller;

// 时间工具插件;
class SignPc extends Controller {

    // 签到统计
    async index(){

        const {ctx,service} = this

        let req = ctx.request.body
        // 获取用户登录信息
        const userInfo  = ctx.session.user
        req.open_id = userInfo.openid
        req.company_id = userInfo.company_id

        const rule = {
            //开始时间 - 结束时间
            beginDate:{type:'string',require:true},
            endDate:{type:'string',require:true},
            teamLevel:{type:'string',require:true},
            teamId:{type:'string',require:true},
            owner:{type:'string',require:true},

            pageNumber:{type:'int',require:true}, // 分页条件
            pageSize:{type:'int',require:true}
        }

        ctx.validate(rule,req)
        req.pageIndex = (req.pageNumber -1) * req.pageSize

        const result = await service.signPc.index(req);

        ctx.body = result
    }

    // 签到详情
    async detail(){

        const {ctx,service} = this

        let req = ctx.request.body

        const rule = {
            //开始时间 - 结束时间
            beginDate:{type:'string',require:true},
            endDate:{type:'string',require:true},
            owner:{type:'string',require:true},
            pageNumber:{type:'int',require:true}, // 分页条件
            pageSize:{type:'int',require:true}
        }

        ctx.validate(rule,req)
        req.pageIndex = (req.pageNumber -1) * req.pageSize

        const result = await service.signPc.detail(req);

        ctx.body = result
    }

}

module.exports = SignPc;
