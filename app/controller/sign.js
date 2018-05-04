'use strict';

const Controller = require('egg').Controller;

// 时间工具插件;
const moment = require('moment');
class Sign extends Controller {
    async signs(){
        moment().format();
        console.log('开始签到')
        const {ctx,service} = this;
        let data = ctx.request.body;
        data['min_date'] = moment(data.create_time).format('YYYY-MM-DD')
        const result = await service.sign.create(data);
        console.log(data);
        ctx.body = '成功';
    }
}

module.exports = Sign;
