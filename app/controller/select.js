'use strict';

const Controller = require('egg').Controller;

let moment = require('moment');

class SelectController extends Controller {

    /**
     * 下拉框日期转换
     */
    async dateSelectConvert() {

        const ctx = this.ctx

        let beginDate = moment().startOf("days").format('YYYY-MM-DD')

        let endDate = moment().startOf("days").format('YYYY-MM-DD')

        const rule = {
            type: {type: 'string', required: true},
        };
        ctx.validate(rule, ctx.params);
        const type = ctx.params.type


        if (type === 'yesterday') {
            beginDate = moment().subtract(1, 'days').startOf("days").format('YYYY-MM-DD');  //昨日开始的时间
            endDate = moment().subtract(1, 'days').endOf("days").format('YYYY-MM-DD');  //
        } else if (type === 'thisWeek') {
            beginDate = moment().startOf("isoWeek").format("YYYY-MM-DD");  //从周一开始的第一天
        } else if (type === 'lastWeek') {
            beginDate = moment().subtract(1, 'Weeks').startOf("isoWeek").format("YYYY-MM-DD")
            endDate = moment().subtract(1, 'Weeks').endOf("isoWeek").format("YYYY-MM-DD")
        } else if (type === 'thisMonth') {
            beginDate = moment().startOf("month").format("YYYY-MM-DD");
        } else if (type === 'lastMonth') {
            beginDate = moment().subtract(1, 'months').startOf("month").format("YYYY-MM-DD");
            endDate = moment().subtract(1, 'months').endOf("month").format("YYYY-MM-DD");
        } else if (type === 'thisYear') {
            beginDate = moment().startOf("year").format("YYYY-MM-DD");
        } else if (type === 'total') {
            beginDate = '2018-01-01'
        }

        ctx.body = {beginDate: beginDate, endDate: endDate}
    }


    /**
     * 团队范围下来列表查询
     */

    async teamSelect(){

        const {ctx,service} = this

        let resp = {}

        let teamLevels =[]
        let teams = []
        let agents = []


        // 获取用户登录信息
        const userInfo  = ctx.session.user


        // 获取登录用户信息
        const openId = userInfo.openid
        const companyId = userInfo.company_id


        // 获取可管理的所有团队ID
        let managerTeamIds = await  service.teamUser.findManagerTeams(companyId, openId)

        if(managerTeamIds.size > 0){
            // 获取团队详细信息
            teams = await  service.teamPc.findByIds(managerTeamIds)

            teamLevels.push('all')
            // 遍历团队等级
            for(let team of teams){
                if(teamLevels.indexOf(team.level) ===-1 ){
                    teamLevels.push(team.level.toString())
                }
            }
            teamLevels.push('one')
            // 获取团队业务员
            agents = await  service.teamUserPc.getAgents(managerTeamIds)

        }else {

            teamLevels.push('one')
            //业务员和游客
            resp.agents.push(userInfo)
        }

        resp.teamLevels = teamLevels
        resp.teams = teams
        resp.agents = agents


        ctx.body = resp

    }
}

module.exports = SelectController