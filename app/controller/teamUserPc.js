
'use strict';

const Controller = require('egg').Controller;

class TeamUsersPc extends Controller {

    async findManagerTeams(){
        // 获取登录用户的open_id

    }

    async findTeamUsers(){

        const {ctx,service} = this

        const params = ctx.params
        const rule ={
            team_id:{type:'string',require:true}
        }

        ctx.validate(rule,params)

        ctx.body = await service.teamUserPc.findUsersByTeamId(params.team_id)

    }

    async findTeamUserDetail(){
      const { ctx, service } = this
      const params = ctx.params
      const rule = {
        teamid: {type: 'string', require:true},
        openid: {type: 'string', require: true}
      }
      ctx.validate(rule, params)
      ctx.body = await service.teamUserPc.findTeamUserDetail(params.teamid, params.openid)
    }
}

module.exports = TeamUsersPc