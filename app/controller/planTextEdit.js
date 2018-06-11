'use strict';

const Controller = require('egg').Controller;

class Plans extends Controller {

    async index () {

        console.log('修改项目勘测')
        const {ctx, service} = this
        let req = ctx.request.body
        console.log('修改项目勘测',req)
        let data = await service.planTextEdit.index(req);
        ctx.body = data;
    }

    async getPlanText () {
        console.log('查看项目勘测的文字')
        const {ctx, service} = this
        let req = ctx.request.body
        console.log('查看项目勘测的文字',req)
        let data = await service.planTextEdit.getPlanText(req);
        ctx.body = data;
    }
}

module.exports = Plans;
