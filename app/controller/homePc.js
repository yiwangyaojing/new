'use strict';

const Controller = require('egg').Controller;
const FileType  = require('../const/FileType')
class HomePcController extends Controller {

    /**
     * 初始化查询
     */
    async query(){

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
            planOwner:{type:'string',require:true}
        }
        ctx.validate(rule,req)

        const result = await service.homePc.homeCount(req)

        ctx.body = result
    }
}

module.exports = HomePcController