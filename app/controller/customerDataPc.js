'use strict';

const Controller = require('egg').Controller;

class CustomerDataPc extends Controller {
    /**
     * PC端根据 参数条件 查询客户列表
     * @returns {Promise.<void>}
     */
    async findParamsByPage(){
        const {ctx, service} = this;
        const openId = ctx.session.user.openid;
        const companyId = ctx.session.user.company_id;
        const req = Object.assign(ctx.request.body, { companyId, openId});
        const rule = {
            openId: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.request.body);
        console.log(ctx.request.body);
        console.log("这里是service"+service);
        console.log("这里是service方法"+service.customerDataPc);
        ctx.body = await service.customerDataPc.findParamsByPage(ctx.request.body);
    }

    /**
     * PC端 客户详情 概况 拍房子 收资料  排版子
     * @returns {Promise.<void>}
     */
    async details() {
        const {ctx, service} = this;
        const rule = {
            id: { type: 'string', required: true },
        };
        ctx.validate(rule, { id: ctx.params.id });
        console.log(ctx.params.id)
        ctx.body = await service.customerDataPc.details(ctx.params.id);
    }


    /**
     * PC端客户详情合同状态
     */
    async findContractStatusById(){
        const {ctx, service} = this;
        const rule = {
            id: {type: 'string', required: true},
        };
        console.log('plan_id 是：',ctx.params)
        ctx.validate(rule, ctx.params);
        ctx.body = await service.customerDataPc.findContractStatusById(ctx.params.id);
    }

    /**
     * PC端客户详情回款
     */
    async findPayStatusById(){
        const {ctx, service} = this;
        const rule = {
            id: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params);
        console.log(ctx.params.id)
        ctx.body = await service.customerDataPc.findPayStatusById(ctx.params.id);
    }


}


module.exports = CustomerDataPc;