'use strict';

const Service = require('egg').Service;

const Sequelize = require('sequelize');


class SignService extends Service {

    async create(data){
        let ctx = this.ctx;
        ctx.model.XSign.create(data).then((success) => {
            console.log('创建签到成功')
            console.log(success);
        }).catch((err) => {
            console.log('创建签到失败')
            console.log(err)
        })
    }

}

module.exports = SignService;
