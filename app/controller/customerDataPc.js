'use strict';

const Controller = require('egg').Controller;

class CustomerDataPc extends Controller {
    /**
     * PC端根据 参数条件 查询客户列表
     * @returns {Promise.<void>}
     */
    async findParamsByPage(){
        const {ctx, service} = this;
        /*console.log(ctx.session.user);*/
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
    // 获取详情
    async detail() {
        const rule = {
            id: { type: 'string', required: true },
        };
        this.ctx.validate(rule, { id: this.ctx.params.id });
        this.ctx.body = await this.ctx.customerDataPc.detail(this.ctx.params.id);
    }


}


module.exports = CustomerDataPc;