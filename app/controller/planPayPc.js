'use strict';

const Controller = require('egg').Controller;

class planPayController extends Controller {

    /**
     * pc 保存回款信息
     */
    async create() {

        const {ctx, service} = this

        let req = ctx.request.body
        // 获取用户登录信息
        const userInfo = ctx.session.user
        req.open_id = userInfo.openid

        const rule = {
            plan_id: {type: 'number', required: true},
            zj_price: {type: 'number', required: true},
            pay_money: {type: 'number', required: true},
            pay_time: {type: 'string', required: true},
            pay_id: {type: 'string', required: false}
        };
        ctx.validate(rule, req);

        ctx.body = await service.planPay.create(req)
    }
    // 客户在用户间转移
    async changePlanOwner() {
        const { ctx } = this;
        const rule = {
            customerId: { type: 'int', required: true },
            openId: { type: 'string', required: true },
            userName: { type: 'string', required: true },
            teamId: { type: 'int', required: true },
            operatorName: { type: 'string', required: true },
        };
        ctx.validate(rule, ctx.request.body);

        ctx.body = await this.service.plans.changePlanOwner(ctx.request.body);
    }

}

module.exports = planPayController