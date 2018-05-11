'use strict';

const Service = require('egg').Service;

const Sequelize = require('sequelize');

const FileType = require('../const/FileType');


class TeamUserPcService extends Service {

    async findUsersByTeamId(params){

        const {ctx,service} = this

        let users

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取所有团队用户
        if(params.team_id === 'all'){
            const teams = await service.teamUser.findManagerTeams(0,params.open_id)
            console.log(teams)
            let ids = []
            for(let team of teams){
                if(ids.indexOf(team.id)){

                }
            }

        }else {
            users =  await ctx.model.XTeamUser.findAll({
                where:{
                    team_id:team_id
                }
            })
        }

        return users
    }

    // 获取用户权限以及管理的团队和在职的团队
    async getTeams(open_id,company_id) {

        let result = {}

        let userRank = FileType.UserRank.other // 用户角色
        let managerTeams = []         // 团队查询参数
        let agentTeams = [] // 业务员团队

        //管理员获取所有管理的团队
        if (company_id) {
            let result = await  this.service.teamUser.findManagerTeams(company_id, open_id)
            managerTeams = result.managerTeamIds

            if (managerTeams && managerTeams.length > 0) {
                userRank = FileType.UserRank.admin
                console.log('管理员：', userRank)
            }

            agentTeams = await  this.service.teamUser.findAgentTeams(company_id, open_id)

            if (managerTeams.length === 0 && agentTeams.length !== 0) {
                userRank = FileType.UserRank.agent
                console.log('业务员：', userRank)
            }


            if (userRank === FileType.UserRank.admin) {
                for (let index in agentTeams) {
                    if (managerTeams.indexOf(agentTeams[index]) !== -1) {
                        delete agentTeams[index]
                    }
                }
            }

            result.userRank = userRank
            result.managerTeams = managerTeams
            result.agentTeams = agentTeams
        }

    }

    // 获取业务员信息
    async getAgents(teamIds){
        return await this.model.XUsers.findAll({where:{team_id:teamIds}})
    }


}
module.exports = TeamUserPcService