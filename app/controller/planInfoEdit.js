'use strict';

const Controller = require('egg').Controller;

class Plans extends Controller {

    async index () {

        console.log('编辑项目资料')
        const {ctx, service} = this
        let req = ctx.request.body
        console.log('编辑项目资料',req)
        let data = await service.planInfoEdit.index(req);
        ctx.body = data;
    }

    async getPlanText () {
        console.log('查看项目资料的文字')
        const {ctx, service} = this
        let req = ctx.request.body
        console.log('查看项目资料的文字',req)
        let data = await service.planInfoEdit.getPlanText(req);
        ctx.body = data;
    }
}

module.exports = Plans;
