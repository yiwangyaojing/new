'use strict';

const Controller = require('egg').Controller;

class DetailSettingPC extends Controller {
    /**
     *PC端进度详情页面查询
     */
    async findParamsByPage(){
        const {ctx, service} = this;
        const rule = {
            openId: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.request.body);
        console.log(ctx.request.body)
        ctx.body = await service.detailSettingPCService.findParamsByPage(ctx.request.body);

    }

    /**
     * PC端进度详情概况
     */
    async findPlanById(){
        const {ctx, service} = this;
        const rule = {
            id: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params.id);
        console.log(ctx.params.id)
        ctx.body = await service.detailSettingPCService.findPlanById(ctx.params.id);
    }

    /**
     * PC端进度详情合同状态
     */
    async findContractStatusById(){
        const {ctx, service} = this;
        const rule = {
            id: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params.id);
        console.log(ctx.params.id)
        ctx.body = await service.detailSettingPCService.findContractStatusById(ctx.params.id);
    }

    /**
     * PC端进度详情回款
     */
    async findPayStatusById(){
        const {ctx, service} = this;
        const rule = {
            id: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params.id);
        console.log(ctx.params.id)
        ctx.body = await service.detailSettingPCService.findPayStatusById(ctx.params.id);
    }


}


module.exports = DetailSettingPC;