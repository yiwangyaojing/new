'use strict';

const Controller = require('egg').Controller;

class Sign extends Controller {
    async signs(){
        console.log('开始签到')
        const {ctx,service} = this;
        let data = ctx.request.body;
        const result = await service.sign.create(data);
        console.log(data);
        ctx.body = '成功';
    }
}

module.exports = Sign;
