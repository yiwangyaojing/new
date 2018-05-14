'use strict';

const Controller = require('egg').Controller;

class TeamPcController extends Controller {
    // 初始化查询 团队树列表，公司层级团队信息
    async index() {
      const { ctx, service } = this
      const req = ctx.params
      const user = await service.user.findByOpenId(req.openid)
      if (!user) {
        throw new Error('用户不存在！')
      }
      const companyId = user.company_id
      if (!companyId) {
        ctx.body = {
          teams: [],
          pages: []
        }
        return
      }
      console.log('TeamPcController-index：查询客户信息是否存在===>>', user)
      ctx.body = await service.teamPc.index(req.openid, companyId)
    }

    // 根据teamid 查询统计团队信息
    async findTeamUsersByPage() {
      const { ctx, service } = this
      const req = ctx.params
      const user = await service.user.findByOpenId(req.openid)
      if (!user) {
        throw new Error('用户不存在！')
      }
      if (!req.id) {
        throw new Error('团队id不能为空!')
      }
      ctx.body = await service.teamPc.findTeamUsersByPage(req.id)
    }

    // 解散团队
    async dissolveTeam() {
      const { ctx, service } = this
      const rule = {
        teamid: {type: 'string', required: true},
        openid: {type: 'string', required: true}
      };

      const req = ctx.params
      ctx.validate(rule, req);
      ctx.body = await service.teamPc.dissolveTeam(req.teamid, req.openid)
    }

    // 管理员修改
    async changeTeamUsersRole() {
      const { ctx, service } = this
      const rule = {
        team_id: {type: 'int', required: true},
        open_id: {type: 'string', required: true},
        users: {type: 'array', required: true}
      };
      const req = ctx.request.body
      ctx.validate(rule, req)
      ctx.body = await service.teamPc.changeTeamUsersRole(req.team_id, req.open_id, req.users)
    }
}

module.exports = TeamPcController;
