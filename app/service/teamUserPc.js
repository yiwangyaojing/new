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
    async getTeams(open_id,company_id,team_id) {

        let result = {}

        let userRank = FileType.UserRank.other // 用户角色
        let managerTeams = []         // 团队查询参数
        let agentTeams = [] // 业务员团队

        //管理员获取所有管理的团队
        if (company_id) {
            let result = await  this.findManagerTeams(company_id, open_id,team_id)
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

        return result
    }

    // 获取业务员信息
    async getAgents(teamIds,company_id){

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        console.log(teamIds)
        const agents = await sequelize.query(
            "select u.name,u.openid,tu.team_id from x_team_user tu , x_users u " +
            "where tu.open_id = u.openid " +
            "and tu.team_id in (:teamIds) " +
            "and u.company_id =:company_id",
            {replacements: {teamIds: teamIds,company_id:company_id}, type: Sequelize.QueryTypes.SELECT})

        return agents
    }


    // 根据用户id获取所有管理的团队信息,以及team_id下级所有管理
    async findManagerTeams(company_id,open_id,team_id){

        const ctx = this.ctx

        let result = {}
        let managerAllIds = []
        let managerTeamIds = []

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        let teamUsers = await sequelize.query(
            "select tu.*  from  x_team_user tu where tu.open_id =:open_id " +
            "and user_rank =:user_rank " +
            "and tu.team_company_id =:company_id " +
            "order by tu.team_level asc ",
            {replacements: {open_id: open_id ,user_rank:FileType.UserRank.admin,company_id:company_id}, type: Sequelize.QueryTypes.SELECT})

        // 获取公司所有团队
        const company = await  ctx.model.XTeam.findAll({where:{company_id:company_id}})

        for(let index in teamUsers){
            if(index === 0 || index === '0' ){
                result.maxLevel = teamUsers[index].team_level
            }
            let team ={
                id:teamUsers[index].team_id,
                level:teamUsers[index].team_level,
            }
            //递归过去所有的团队
            if(team.id.toString() === team_id){
                managerTeamIds.push(teamUsers[index].team_id)
                await  this.service.team.linealTeam(company,team,managerTeamIds,'child');
            }

            //递归所有团队，去重
            managerAllIds.push(teamUsers[index].team_id)
            await  this.service.team.linealTeamArray(company,team,managerAllIds,'child',teamUsers,index);

        }

        result.managerAllIds  =managerTeamIds
        result.managerTeamIds = managerTeamIds

        console.log('-----------------------------》managerTeamIds',result)


        return result

    }

}
module.exports = TeamUserPcService