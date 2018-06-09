'use strict';

const Service = require('egg').Service;
const moment = require('moment')
const Sequelize = require('sequelize')
const FileType = require('../const/FileType')

class OverDueService extends Service {

    async index(req) {
        return await this.ctx.model.XOverdue.findOne({where: {company_id: req.company_id}})
    }

    async update(req) {
        return await this.ctx.model.XOverdue.update(req, {where: {id: req.id, company_id: req.company_id}})
    }

    async query(req) {

        const ctx = this.ctx
        const Op = Sequelize.Op

        const dateNow = moment().format("YYYY-MM-DD")

        const scdList = [FileType.schedule.htqd, FileType.schedule.sgwc, FileType.schedule.bwwc]

        let result = {}
        // 查询单个业务员
        if (req.open_id) {
            console.log("查询单个业务员",req.open_id)
            const user = await ctx.model.XUsers.findOne({
              where: {
                  openid: req.open_id
              }
            })
            let teamIds = []

            // 获取个人所在团队
            if(user.company_id){
                const teams = await  this.ctx.model.XTeamUser.findAll({where:{open_id:req.open_id}})
                for(let team of teams){
                    if(teamIds.indexOf(team.team_id) ===-1){
                        teamIds.push(team.team_id)
                    }
                }
            }
            result = await ctx.model.XPlans.findAll(
                {
                    attributes: ['id', 'open_id', 'cst_name', 'user_name', 'scd_status', 'zj_capacity', 'zj_price', 'zj_input_capacity','pay_gap','pay_sum'],
                    where: {
                        [Op.or]:[
                            {open_id: req.open_id, team_id:teamIds},
                            {open_id: req.open_id, company_id: null},
                        ],
                        overdue_date: {[Op.lte]: dateNow},
                        scd_status: {[Op.in]: scdList},

                    }
                }
            )
        } else {
            if (req.id) {   // 查询团队
                console.log("查询团队")
                // 查询公司所有团队
                const companyTeams = await this.ctx.model.XTeam.findAll({where: {company_id: req.company_id}})
                // 遍历下级直系团队
                let teams = []
                teams.push(req.id)
                await this.service.team.linealTeam(companyTeams, req, teams, 'child')

                result = await ctx.model.XPlans.findAll(
                    {
                        attributes: ['id', 'open_id', 'cst_name', 'user_name', 'scd_status', 'zj_capacity', 'zj_price' ,'zj_input_capacity','pay_gap','pay_sum'],
                        where: {
                            team_id: {[Op.in]: teams},
                            company_id: req.company_id,
                            overdue_date: {[Op.lte]: dateNow},
                            scd_status: {[Op.in]: scdList}
                        }
                    }
                )
            } else {  // 查找总公司本级
                console.log("查找总公司本级")
                result = await ctx.model.XPlans.findAll(
                    {
                        attributes: ['id', 'open_id', 'cst_name', 'user_name', 'scd_status', 'zj_capacity', 'zj_price' ,'zj_input_capacity','pay_gap','pay_sum'],
                        where: {
                            team_id: req.company_id,
                            // company_id: req.company_id,
                            overdue_date: {[Op.lte]: dateNow},
                            scd_status: {[Op.in]: scdList}
                        }
                    }
                )
            }

        }
        console.log("-----------------------------------------------", result)
        return result

    }
}

module.exports = OverDueService