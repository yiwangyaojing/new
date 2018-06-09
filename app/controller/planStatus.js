'use strict';

const Controller = require('egg').Controller;

class planStatus extends Controller {
    async index (){
        const {ctx,service} = this;
        console.log(service.planStatus)
        let data = await service.planStatus.create();
        console.log('获取项目历史成功');
        ctx.body = data;
    }
}

module.exports = planStatus