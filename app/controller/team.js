'use strict';

const Controller = require('egg').Controller;

class TeamController extends Controller {

    /**
     * 发送手机验证码
     */
    async sms() {

        const {ctx, service} = this
        const rule = {
            register_phone: {type: 'string', required: true},
            open_id: {type: 'string', required: true},
            template_code: {type: 'string', required: true},
        };

        const req = ctx.request.body
        ctx.validate(rule, req);
        ctx.body = await service.sms.sendValidateCode(req.open_id, req.register_phone, req.template_code);
    }

    /**
     * 创建公司团队
     */
    async companyCreate() {

        const {ctx, service} = this;

        const req = ctx.request.body;

        const rule = {
            open_id: {type: 'string', required: true},
            register_phone: {type: 'string', required: true}, // 注册手机号
            name: {type: 'string', required: true},
            // oss_name: {type: 'string', required: false, // oss文件名称
            // logo: {type: 'string', required: false},
            validateCode: {type: 'string', required: true}, // 验证码
        };

        ctx.validate(rule, req)

        try{
            //验证码校验
            if (!await service.sms.doValidate(req.phone, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }
        const result = await service.team.companyCreate(req);

        ctx.body = result;

    }

    /**
     * 获取公司详情
     */
    async index() {

        const {ctx, service} = this
        const req = ctx.params;

        console.log(req)
        const rule = {
            open_id: {type: 'string', required: true}, // 操作人Id
            id: {type: 'string', required: true}, // 公司Id
        }
        ctx.validate(rule, req)

        ctx.body = await service.team.index(req)
    }

    /**
     * 修改公司团队
     */

    async companyUpdate() {
        const {ctx, service} = this

        const req = ctx.request.body;
        req.level = 0

        const rule = {
            id: {type: 'int', required: true}, // 团队id
            name: {type: 'string', required: true}, // 团队名称
            open_id: {type: 'string', required: true}, // 操作人Id
            validateCode: {type: 'string', required: true}, // 验证码
            oss_name: {type: 'string', required: true}, // oss 文件名称
            logo: {type: 'string', required: true}, // logo地址
        };
        ctx.validate(rule, req)
        try{
            //验证码校验
            if (!await service.sms.doValidate(req.phone, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }
        // 修改公司团队信息
        const result = await  service.team.update(req)

        ctx.body = result

    }

    /**
     * 团队创建
     */
    async create() {

        const {ctx, service} = this

        const req = ctx.request.body;

        const rule = {
            name: {type: 'string', required: true}, // 团队名称
            open_id: {type: 'string', required: true}, // 操作人Id
            level: {type: 'int', required: true}, // 团队等级
            parent_id: {type: 'int', required: true}, // 父级团队ID
            company_id: {type: 'int', required: true}, // 公司团队ID
            company_name: {type: 'string', required: true}, // 公司团队ID
        };

        ctx.validate(rule, req)

        // const agents = {
        //   open_id:{type:'string' ,required:true}, // 成员openId
        //   user_rank:{type:'string' ,required:true}, // 成员角色 1，管理员 2，业务员
        // }


        const result = await service.team.create(req)

        ctx.body = result
    }

    async update() {

        const {ctx, service} = this

        const req = ctx.request.body;
        const rule = {
            id: {type: 'int', required: true}, // 团队id
            name: {type: 'string', required: true}, // 团队名称
            open_id: {type: 'string', required: true}, // 操作人Id
        }

        ctx.validate(rule, req)

        const result = await service.team.update(req)

        ctx.body = result
    }

    /**
     * 解散团队
     */
    async destroy() {

        const {ctx, service} = this
        const req = ctx.params
        const rule = {
            id: {type: 'string', required: true}, // 团队id
            open_id: {type: 'string', required: true}, // 操作人id
        }
        ctx.validate(rule, req)


        const result = await  service.team.destroy(req)

        console.log(result)

        ctx.body = result

    }

    /**
     * 获取用户的所在的所有团队
     */

    async getUserTeam() {
        const {ctx, service} = this
        const req = ctx.params
        const rule = {
            open_id: {type: 'string', required: true}, // 操作人id
        }
        ctx.validate(rule, req)

        ctx.body = await service.team.getUserTeam(req)
    }

}

module.exports = TeamController;
