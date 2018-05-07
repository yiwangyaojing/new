'use strict';

const Controller = require('egg').Controller;

class TeamUserController extends Controller {

    // 查询当前团队所有用户
    async index() {

        const {ctx, service} = this

        const rule = {
            teamId: {type: "string", required: true}
        }
        const req = ctx.params

        ctx.validate(rule, req)

        const teamUsers = await service.teamUser.index(req)

        // const childTeams  = await  service.team.findChild(req.teamId)

        // result.childs = childTeams

        ctx.body = teamUsers

    }

    // 查询团队用户
    async findTeamUsers() {
        const {ctx, service} = this
        const rule = {
            id: {type: "int", required: false},
            level: {type: "int", required: false},
            company_id: {type: "int", required: true}
        }
        const req = ctx.request.body
        ctx.validate(rule, req)

        // 当前团队所有的业务员
       // const result = await service.teamUser.findTeamUsers(req)

        // 对每个业务员进行便利查找他们的业务信息;
        // const data = await service.user.allUserGetProjectInfo(result)

        // 获取概要信息
        const data = await service.teamUser.findTeamChildPlan(req)

        console.log(data)
        ctx.body = data
    }

    /**
     * 根据用户openID 团队level,获取所有成员，以及子团队信息
     */
    async teamManagerInit() {
        const {ctx, service} = this

        const rule = {
            open_id: {type: "string", required: true},
            company_id: {type: "string", required: true},
            max_level: {type: "string", required: true}, // 最高团队等级
            max_level_rank: {type: "string", required: true},  // 最高团队中的职级
            team_id: {type: "string", required: true},
            team_level: {type: "string", required: true}
        }
        const req = ctx.request.body

        ctx.validate(rule, req)


        ctx.body = await service.teamUser.teamManagerInit(req)

    }


    /**
     * 修改用户权限
     */
    async updateRule() {

        const {ctx, service} = this

        const req = ctx.request.body

        const rule = {
            team_id: {type: 'int', required: true},
            operator: {type: 'string', required: true},
            users: {type: 'array', required: true},
        }

        ctx.validate(rule, req)

        await service.teamUser.updateRule(req)

        ctx.body = {message: "权限修改成功！"}

    }


    async create() {
        const {ctx, service} = this

        const req = ctx.request.body

        const rule = {
            team_id: {type: 'int', required: true},
            operator: {type: 'string', required: true},
            users: {type: 'array', required: true},
            user_rank: {type: 'int', required: true},
        }

        ctx.validate(rule, req)

        ctx.body = await  service.teamUser.create(req)

    }

    async destroy() {

        const {ctx, service} = this

        const req = ctx.request.body

        const rule = {
            team_id: {type: 'int', required: true},
            operator: {type: 'string', required: true},
            open_id: {type: "string", required: true},
        }

        ctx.validate(rule, req)


        ctx.body = await service.teamUser.destroy(req)
    }

    async deleteFromCompany() {
        const {ctx, service} = this
        const req = ctx.request.body
        const rule = {
            open_id: {type: 'string', required: true}
        }
        ctx.validate(rule, req)

        ctx.body = await service.teamUser.deleteFromCompany(req.open_id)
    }

    /**
     * 个人设置 - 查询
     */
    async userInfo() {
        const {ctx, service} = this

        const req = ctx.params

        const resp = {}

        const rule = {
            open_id: {type: "string", required: true},
        }
        ctx.validate(rule, req)

        const user = await service.user.findByOpenId(req.open_id)
        if (!user.name) user.name = user.nickName

        let teams = []

        if (user.company_id) {
            teams = await service.teamUser.teamInfo(req.open_id, user.company_id)
        }
        resp.user = user
        resp.teams = teams

        ctx.body = resp

    }

    /**
     * 个人设置 -- 注册绑定
     */
    async bundling() {
        const {ctx, service} = this

        const rule = {
            open_id: {type: 'string', required: true},
            name: {type: 'string', required: true},
            phone: {type: 'string', required: false},
            validateCode: {type: 'string', required: true}, // 验证码
        }
        const req = ctx.request.body

        ctx.validate(rule, req)
        try{
            //验证码校验
            if (!await service.sms.doValidate(req.phone, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }

        let param = {
            name: req.name,
            phone: req.phone
        }

        const result = await  service.user.updateParams(param, req.open_id)

        ctx.body = result;
    }

    /**
     * 个人设置
     */
    async updateUser() {
        const {ctx, service} = this

        const rule = {
            open_id: {type: 'string', required: true},
            name: {type: 'string', required: true},
            phone: {type: 'string', required: false},
        }
        const req = ctx.request.body

        ctx.validate(rule, req)

        let param = {
            name: req.name,
            phone: req.phone
        }

        const result = await  service.user.updateParams(param, req.open_id)

        ctx.body = result;
    }

    /**
     * 个人设置，退出团队
     */
    async delUser() {

        const {ctx, service} = this

        const rule = {
            open_id: {type: 'string', required: true},
            validateCode: {type: 'string', required: true}, // 验证码
        }
        const req = ctx.request.body
        ctx.validate(rule, req)

        try{
            //验证码校验
            if (!await service.sms.doValidate(req.phone, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }

        const result = await service.teamUser.delUser(req.open_id);

        ctx.body = result
    }

    // 获取管理员用户，以及管理团队及子团队

    async getAdminTeams() {

        const {ctx, service} = this

        const rule = {
            open_id: {type: 'string', required: true},
            company_id: {type: 'string', required: true},
        }
        const req = ctx.params
        ctx.validate(rule, req)
        const result = await service.teamUser.getAdminTeams(req.company_id, req.open_id)

        ctx.body = result
    }

    // 通讯录
    async friendList() {
        const {ctx, service} = this

        const rule = {
            company_id: {type: 'string', required: true},
        }
        const req = ctx.params
        ctx.validate(rule, req)

        ctx.body = await service.teamUser.getFriendList(req.company_id)
    }

    async companyUsers() {
        const {ctx, service} = this

        const rule = {
            company_id: {type: 'string', required: true},
        }
        const req = ctx.params
        ctx.validate(rule, req)

        ctx.body = await service.teamUser.companyUsers(req.company_id)
    }

    // 用户通过邀请加入团队
    async join() {
        const {ctx, service} = this
        const rule = {
            validateCode: {type: 'string', required: true},
            register_phone: {type: 'string', required: true},
            team_id: {type: 'int', required: true},
            company_id: {type: 'int', required: true},
            operator: {type: 'string', required: true},
            open_id: {type: 'string', required: true},
            user_rank: {type: 'int', required: true},
        }
        const req = ctx.request.body
        ctx.validate(rule, req)

        try{
            //验证码校验
            if (!await service.sms.doValidate(req.phone, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }
        ctx.body = await service.teamUser.join(req)
    }

    // 获取团队内成员的签到信息
    async teamGetSign() {
        const {ctx, service} = this
        const body = ctx.request.body
        let data = await service.teamUser.teamGetSign(body)
        console.log(body)
        ctx.body = data
    }
}

module.exports = TeamUserController