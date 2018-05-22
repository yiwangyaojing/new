'use strict';

const Controller = require('egg').Controller;

class Plans extends Controller {

    // 分页查询
    async findByPage() {
        console.log('分页查询')
        const {ctx, service} = this
        let params = ctx.params
        let req = ctx.request.body
        const rule = {
            openId: {type: 'string', required: true},
            pageNumber: {type: 'string', required: true},
        };
        const ruleReq = {
            company_id: { type: 'int', required: false },
            team_id: {type: 'array', required: false}
        };
        this.ctx.validate(rule, params);
        this.ctx.validate(ruleReq, req);

        params.company_id = req.company_id
        params.team_id = req.team_id

        this.ctx.body = await service.plans.findByPage(params);
    }

    // 分页带条件查询
    async findByPageAndSearch() {
        const {ctx, service} = this
        let params = ctx.params
        let req = ctx.request.body
        const rule = {
            openId: {type: 'string', required: true},
            pageNumber: {type: 'string', required: true},
            search: {type: 'string', required: true},
        };

        const ruleReq = {
            company_id: { type: 'int', required: false },
            team_id: {type: 'array', required: false}
        };

        this.ctx.validate(rule, params);
        this.ctx.validate(ruleReq, req);
        params.company_id = req.company_id
        params.team_id = req.team_id

        this.ctx.body = await service.plans.findByPage(params);
    }

    // 创建方案基本信息
    async basicCreate() {
        const rule = {
            open_id: {type: 'string', required: true},
            cst_name: {type: 'string', required: true},
            // team_id: {type: 'int', required: false},
            // cst_phone: { type: 'string', required: true },
            // cst_remark: { type: 'string', required: false },
        };
        this.ctx.validate(rule, this.ctx.request.body);// 参数校验
        this.ctx.body = await this.ctx.service.plans.basicCreate(this.ctx.request.body);
    }

    // 更新方案信息
    async update() {
        const rule = {
            id: {type: 'int', required: true},
            // zj_format: { type: 'string', required: true },
            // zj_capacity: { type: 'string', required: true },
            // zj_num: { type: 'string', required: true },
            // zj_price: { type: 'string', required: true },
        };
        console.log(this.ctx.request.body)
        // 校验
        this.ctx.validate(rule, this.ctx.request.body);// 参数校验
        // 开始创建
        this.ctx.body = await this.ctx.service.plans.create(this.ctx.request.body);
    }

    // 用户删除示例客户 start
    async updateSampleClient() {
        const rule = {
            id: { type: 'string', required: true },
        };
        this.ctx.validate(rule, { id: this.ctx.params.id });
        this.ctx.body = await this.ctx.service.plans.updateSampleClient(this.ctx.params.id);
    }
    // 用户删除示例客户 end

    // 删除客户信息
    async destroy() {
        const rule = {
            id: {type: 'string', required: true},
        };
        this.ctx.validate(rule, {id: this.ctx.params.id});
        this.ctx.body = await this.ctx.service.plans.destroy(this.ctx.params.id);
    }

    // 获取详情
    async detail() {
        const rule = {
            id: {type: 'string', required: true},
        };
        this.ctx.validate(rule, {id: this.ctx.params.id});
        this.ctx.body = await this.ctx.service.plans.detail(this.ctx.params.id);
    }

    // 获取用户的所有客户信息
    async findAllByUser() {
        const {ctx, service} = this;
        const rule = {
            openId: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params);

        ctx.body = await service.plans.findAllByUser(ctx.params.openId);

    }

    // 客户在用户间转移
    async changePlanOwner() {
        const { ctx } = this;
        const rule = {
            customerId: { type: 'int', required: true },
            openId: { type: 'string', required: true },
            userName: { type: 'string', required: true },
            teamId: { type: 'int', required: true },
            operatorName: { type: 'string', required: true },
        };
        ctx.validate(rule, ctx.request.body);

        ctx.body = await this.service.plans.changePlanOwner(ctx.request.body);
    }

}

module.exports = Plans;
