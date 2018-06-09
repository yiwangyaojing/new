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
            team_id: {type: 'array', required: false},
            user_openid: {type: 'string', required: false}
        };
        this.ctx.validate(rule, params);
        this.ctx.validate(ruleReq, req);

        params.company_id = req.company_id
        params.team_id = req.team_id
        params.user_openid = req.user_openid || null

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
            team_id: {type: 'array', required: false},
            user_openid: {type: 'string', required: false}
        };

        this.ctx.validate(rule, params);
        this.ctx.validate(ruleReq, req);
        params.company_id = req.company_id
        params.team_id = req.team_id
        params.user_openid = req.user_openid || null

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

        console.log('开始创建项目方案')
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

//    获取团队的项目历史 信息
    async getTeamProject(){
        const {ctx, service} = this;
        const rule = {
            openId: {type: 'string', required: true},
        };
        const rule_body = {
            companyId: {type: 'int', required: true},
            arr: {type: 'array', required: false}
        };
        ctx.validate(rule, ctx.params);
        ctx.validate(rule_body, ctx.request.body);
        let data = await service.plans.getTeamProject(ctx.request.body,ctx.params.openId);
        ctx.body = data
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

//    获取个人的项目历史信息
    async getSalesmanProject(){
        const {ctx, service} = this;
        const rule_body = {
            openId: {type: 'string', required: true},
        };

        ctx.validate(rule_body, ctx.request.body);
        let data = await service.plans.getSalesmanProject(ctx.request.body);
        ctx.body = data
    }

//    获取逾期
    async getoverdue(){
        const {ctx, service} = this;
        const rule = {
            open_id: {type: 'string', required: false},
            arr: {type: 'array', required: false}
        };
        ctx.validate(rule, ctx.request.body);
        let data = await service.plans.getoverdue(ctx.request.body);

        ctx.body = data
    }

    // 获取团队下所有的历史项目数据,不分时间
    async getAllPlans(){
        const {ctx, service} = this;
        let body = ctx.request.body;
        if (!body || !body.teamId || body.teamId.length == 0) {
            ctx.body = []
            return
        }
        let data = await service.plans.getAllPlans(body.teamId);
        ctx.body = data
    }

    // 获取团队下的逾期数据--pc
    async pcOverdue() {
        const {ctx, service} = this;
        const rule = {
            open_id: {type: 'string', required: false},
            arr: {type: 'array', required: false}
        };
        ctx.validate(rule, ctx.request.body);
        let data = await service.plans.getoverduePc(ctx.request.body);
        ctx.body = data
    }

    // 获取单个业务员的项目历史信息-- pc
    async getUserPlans() {
        const {ctx, service} = this;
        let body = ctx.request.body;
        let data = await service.plans.getUserPlans(body.open_id);
        ctx.body = data
    }
}

module.exports = Plans;
