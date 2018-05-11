
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
}

module.exports = PlansPc

