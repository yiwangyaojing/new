'use strict';

const Controller = require('egg').Controller;

class planSchedulePcController extends Controller {

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
            planOwner:{type:'string',require:true},

            scdStatus:{type:'string',require:true}, // 进度状态 all,2,3,4,6
            overDueStatus:{type:'string',require:true}, //逾期状态 all,0,1
            // search:{type:'string',require:true}, //模糊搜索条件

            pageNumber:{type:'int',require:true}, // 分页条件
            pageSize:{type:'int',require:true}
        }

        ctx.validate(rule,req)

        req.pageIndex = (req.pageNumber -1) * req.pageSize

        const result = await service.planSchedulePc.query(req)

        ctx.body = result
    }

}

module.exports = planSchedulePcController