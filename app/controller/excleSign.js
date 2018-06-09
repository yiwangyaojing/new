'use strict';

const Controller = require('egg').Controller;

// 时间工具插件;
class excleSign extends Controller {

    // 签到统计导出
    async excleExport(){

        const {ctx,service} = this

        let req = ctx.request.body
        // 获取用户登录信息
        const userInfo  = ctx.session.user
        req.open_id = userInfo.openid
        req.company_id = userInfo.company_id

        const rule = {
            //开始时间 - 结束时间
            beginDate:{type:'string',require:true},
            endDate:{type:'string',require:true},
            teamLevel:{type:'string',require:true},
            teamId:{type:'string',require:true},
            owner:{type:'string',require:true},

            pageNumber:{type:'int',require:true}, // 分页条件
            pageSize:{type:'int',require:true}
        }

        ctx.validate(rule,req)
        req.pageIndex = (req.pageNumber -1) * req.pageSize

        const result = await service.excleSign.excleExport(req);

        ctx.body = result
    }

    /**
     * 客户资料导出
     */
    async query(){

        const {ctx,service} = this

        let req = ctx.request.body
        // 获取用户登录信息
        const userInfo  = ctx.session.user
        req.open_id = userInfo.openid
        req.company_id = userInfo.company_id

        const rule = {
            //开始时间 - 结束时间
            beginDate:{type:'string',require:true},
            endDate:{type:'string',require:true},
            teamLevel:{type:'string',require:true},
            teamId:{type:'string',require:true},
            planOwner:{type:'string',require:true},

            scdStatus:{type:'string',require:true}, // 进度状态 all,2,3,4,6
            overDueStatus:{type:'string',require:true}, //逾期状态 all,0,1
        }
        ctx.validate(rule,req)
        let result = await service.excleSign.query(req)
        let list = result.content
        for (let i = 0; i < list.length; i++) {
            let value = list[i].dataValues;
            const  ContractStatus = await service.customerDataPc.findContractStatusById(value.id);
            for (let j = 0; j < ContractStatus.length; j++ ) {
                if (ContractStatus[j].scd_status === 0) {
                    value.xjxmsj = ContractStatus[j].scd_time // 新建项目 0
                } else if (ContractStatus[j].scd_status === 2) {
                    value.qdhtsj = ContractStatus[j].scd_time // 合同签订 2
                } else if (ContractStatus[j].scd_status === 3) {
                    value.sgwcsj = ContractStatus[j].scd_time // 施工完成 3
                } else if (ContractStatus[j].scd_status === 4) {
                    value.bwwcsj = ContractStatus[j].scd_time // 并网完成 4
                }
            }
            }
        // console.log('结果========================》', list)
        ctx.body = list

    }
}

module.exports = excleSign;
