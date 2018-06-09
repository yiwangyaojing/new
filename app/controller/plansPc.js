
'use strict';

const Controller = require('egg').Controller;

class PlansPc extends Controller {

    // pc 客户资料分页
    async page () {

        const {ctx, service} = this

        const page = {
            params: ctx.request.body.params,
            pageIndex: ctx.request.body.pageIndex,
            pageSize: ctx.request.body.pageSize,
            content: [],
            totalCount: '',
        }
        await service.plan.findPage(page)

        ctx.body = page
    }


    // pc 新建客户
    async create(){

        const {ctx, service} = this

        let req = ctx.request.body
        // 获取用户登录信息
        const userInfo  = ctx.session.user
        req.open_id = userInfo.openid
        req.company_id = userInfo.company_id
        req.user_name =userInfo.name

        const rule = {
            cst_name: {type: 'string', required: true},
            team_id: {type: 'int', required: false},
            // cst_phone: { type: 'string', required: true },
            // cst_remark: { type: 'string', required: false },
        };

        console.log('开始创建项目方案')
        this.ctx.validate(rule, req);// 参数校验
        this.ctx.body = await service.plans.basicCreate(req);
    }

    // pc 更新方案信息
    async update() {

        const {ctx, service} = this
        let req = ctx.request.body
        const rule = {
            id: {type: 'int', required: true},
        };
        console.log(req)
        // 校验
         ctx.validate(rule, req);// 参数校验
        // 开始创建
         ctx.body = await service.plans.create(req);
    }

}

module.exports = PlansPc

