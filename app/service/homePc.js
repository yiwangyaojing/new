'use strict';

const Service = require('egg').Service;
const FileType  = require('../const/FileType')
class HomePcService extends Service {

    /**
     * 团队查询参数
     */
    async getTeamQueryParams(req){

        const service  = this

        let result = {
            userRank:FileType.UserRank.other,
            params:[]
        }

        const  openId  = req.open_id // 登录用户
        const  companyId = req.company_id //登录用户所属公司
        const  teamLevel = req.teamLevel // 团队等级
        const  teamId = req.teamLevel // 团队Id

        const  teamInfo = await service.teamUserPc.getTeams(openId,companyId,teamId)


        result.userRank = teamInfo.userRank // 用户权限
        const  managerTeams = teamInfo.managerTeams // 根据团队id筛选包含当前team的所有子团队
        const  managerAllIds = teamInfo.managerAllIds // 可管理的所有团队
        const  agentTeams = teamInfo.agentTeams // 业务员角色所在的团队

        // 判断查询条件
        if(teamLevel === 'all'){
            result.params.push(
                { team_id:managerAllIds},
                { open_id: openId,team_id:agentTeams},
                { open_id: openId,company_id:null},
            )
        }else if(teamLevel === 'one'){
            result.push(
                { open_id: openId,team_id:agentTeams},
                { open_id: openId,company_id:null},
            )
        }else{
            result.params.push(
                { team_id:managerTeams},
                { open_id: openId,team_id:agentTeams},
                { open_id: openId,company_id:null},
            )
        }
    }
}

module.exports = HomePcService