'use strict';

const Controller = require('egg').Controller;
const FileType  = require('../const/FileType')
class HomePcController extends Controller {

    /**
     * 初始化查询
     */
    async query(){

        const {ctx,service} = this

        // 获取用户登录信息
        const userInfo  = ctx.session.user
        const openId = userInfo.openid
        const companyId = userInfo.company_id

        const rule = {
            //开始时间 - 结束时间
            beginDate:{type:'string',require:true},
            endDate:{type:'string',require:true},

            teamLevel:{type:'string',require:true},
            teamId:{type:'string',require:true},

            openId:{type:'string',require:true}
        }
        const req = ctx.request.body

    }
}

module.exports = HomePcController