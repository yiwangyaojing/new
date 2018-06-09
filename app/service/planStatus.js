'use strict';

const Service = require('egg').Service;
// const FileType = require('../const/FileType')
// const moment = require('moment')

class planStatusService extends Service {

    async create(){
        const {ctx} = this;
        let data = {
            open_id:'213',
            plan_id:'213',
            scd_status:'1',
            scd_name:'是',
            scd_time:new Date()
        }
        ctx.model.XPlanStatus.create(data).then((suc) => {
            console.log('成功',suc)
        }).catch((err) => {
            console.log('失败',err)
        })
    }

}

module.exports = planStatusService