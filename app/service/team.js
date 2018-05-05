'use strict';

const Service = require('egg').Service;

const Sequelize = require('sequelize');

const FileType = require('../const/FileType');


class TeamService extends Service {

    async companyCreate(req) {

        const ctx = this.ctx;

        // 保存的team信息
        const team = {
            id: null,
            open_id: req.open_id,
            name: req.name,
            oss_name: req.oss_name,
            logo: req.logo,
            level: 0,
            register_phone: req.register_phone,
            parent_id: req.parent_id,
            company_id: req.company_id,
            company_name: req.name,
        };

        // 保存teamUser信息
        const teamUser = {
            open_id: req.open_id,
            user_rank: 1,
            team_level: team.level,
            team_parent_id: req.parent_id,
            team_company_id: req.company_id,
        };

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        let result = {};

        await sequelize.transaction(function (t) {
            return ctx.model.XTeam.create(team, {transaction: t}).then(function (result0) { // 保存team
                result = result0.dataValues;
                teamUser.team_id = result.id;
                teamUser.team_company_id = result.id;
                return ctx.model.XTeamUser.create(teamUser, {transaction: t}).then(function () {
                    // 保存用户公司信息
                    const param = {
                        company_id: result.id,
                        company_name: result.name,
                        company_logo: result.logo,
                        company_founder: result.open_id,
                        phone: result.register_phone,
                    };
                    return ctx.model.XUsers.update(param, {where: {openid: req.open_id}}).then(function () {
                        let overdue = {} // 保存逾期规则
                        overdue.company_id = result.id
                        return ctx.model.XOverdue.create(overdue)
                    });
                });
            });
        }).catch(function (err) {
            console.log(err);
        });

        if (result) {
            const num = await ctx.model.XTeam.update({company_id: result.id}, {where: {id: result.id}});
            if (num[0] > 0) {
                result.company_id = result.id;
            }
        }

        return result;

    }

    /**
     * 非公司团队创建
     */
    async create(req) {

        const ctx = this.ctx;

        // 保存的team信息
        const team = {
            open_id: req.open_id,
            name: req.name,
            level: req.level,
            parent_id: req.parent_id,
            company_id: req.company_id,
            company_name: req.company_name,
        };

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        let result = {};

        await sequelize.transaction(function (t) {
            return ctx.model.XTeam.create(team, {transaction: t}).then(function (result0) { // 保存team
                result = result0.dataValues;
                const agents = req.agents;
                console.log('this is agents ===>>', String(agents));
                if (!(String(agents) == 'null' || String(agents) == 'undefined')) {
                    for (let agent of agents) {
                        agent.team_id = result.id;
                        agent.team_level = result.level;
                        agent.team_parent_id = result.parent_id;
                        agent.team_company_id = result.company_id;
                        ctx.model.XUsers.update({
                            company_id: req.company_id,
                            company_name: req.company_name
                        }, {where: {openid: agent.open_id}});
                    }
                    return ctx.model.XTeamUser.bulkCreate(agents, {transaction: t});
                }
            });
        }).catch(function (err) {
            console.log(err);
        });


        return result;

    }

    async update(req) {

        const ctx = this.ctx;

        const team = await ctx.model.XTeam.findOne({where: {id: req.id}});

        if (!team) {
            throw new Error('团队不存在');
        }

        // 判断权限
        if (!await this.validatePower(team, req.open_id)) {
            throw new Error('权限不足');
        }
        // 清空oss文件
        if (team.level === FileType.TeamLevel.company && req.logo !== team.logo && team.oss_name) {
            await ctx.oss.delete(team.oss_name);
        }
        req.company_name = req.name
        req.company_logo = req.logo
        const result = await ctx.model.XTeam.update(req, {where: {id: req.id}});
        if (result > 0 && req.level === 0) {
            // 保存用户公司信息
            const param = {
                company_name: req.name,
                company_logo: req.logo,
            };
            await ctx.model.XUsers.update(param, {where: {company_id: req.id}});
        }

        return result;

    }

    async destroy(req) {

        const ctx = this.ctx;

        const team = await ctx.model.XTeam.findOne({where: {id: req.id}});

        if (!team) {
            throw new Error('团队不存在');
        }
        // 判断权限
        if (!await this.validatePower(team, req.open_id)) {
            throw new Error('权限不足');
        }

        // 解散团队
        const result = await this.disband(team);

        return result;
    }

    /**
     * 权限判断
     */
    async validatePower(team, open_id) {

        const teamLevel = team.level;

        // 判断权限
        if (teamLevel === FileType.TeamLevel.company) { // 公司级别团队
            if (team.open_id !== open_id) {
                return false;
            }
        } else { // 其他级别
            // const parentId = team.parent_id

            // 查询操作人所在的最高团队等级
            const teamUser = await this.ctx.model.XTeamUser.findOne({
                where: {open_id, user_rank: FileType.UserRank.admin},
                order: [['team_level', 'ASC']]
            });
            if (!teamUser || teamUser.team_level > teamLevel) {
                return false;
            }
            // 根据团队id 和 openId  和用户等级 查询上级团队用户
            // const teamUser = await  ctx.model.XTeamUser.findOne({where:{team_id:parentId,open_id:open_id,user_rank:FileType.UserRank.admin}});
            // if(!teamUser.dataValues){
            //   return false;
            // }
        }

        return true;

    }

    async index(req) {
        return await this.ctx.model.XTeam.findOne({where: {id: req.id, open_id: req.open_id}})
    }

    // 获取直系团队列表
    async linealTeam(company, team, linIds, type) {

        if (type === 'child') {
            if (team.level === 3) return;
            for (let c of company) {
                if (c.level > team.level) {
                    if (c.parent_id == team.id) {
                        linIds.push(c.id)
                        await this.linealTeam(company, c, linIds, 'child')
                    }
                }
            }
        } else if (type === 'parents') {
            if (team.level === 0) return;
            for (let c of company) {
                if (c.level < team.level) {
                    if (c.id == team.parent_id) {
                        linIds.push(c.id)
                        await this.linealTeam(company, c, linIds, 'parents')
                    }
                }
            }
        }

    }

    async disband(team) {

        const ctx = this.ctx;

        // 整合需要解散的团队Id
        const teamIds = [];
        teamIds.push(team.id)
        // 查询所有公司数据
        const companyTeams = await ctx.model.XTeam.findAll({where: {company_id: team.company_id}});

        if (!companyTeams) {
            throw new Error('团队数据不存在');
        }

        await  this.linealTeam(companyTeams, team, teamIds, 'child')
        /*    for (const t of companyTeams) {
              if (t.level >  team.level) {
                teamIds.push(t.id);
              }
            }*/

        let resp = -1;
        // 清除团队及团队成员
        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        const Op = Sequelize.Op;

        await sequelize.transaction(function (t) {
            return ctx.model.XTeamUser.destroy({where: {team_id: {[Op.or]: teamIds}}}, {transaction: t}).then(function () { // 删除用户团队
                return ctx.model.XTeam.destroy({where: {id: {[Op.or]: teamIds}}}, {transaction: t})
                //   .then(function() { // 删除团队
                //   if (team.level === FileType.TeamLevel.company) {
                //     ctx.model.XUsers.update({ company_id: null, company_name: null, company_logo: null }, { where: { company_id: team.id } }); // 解散公司，所有用户为游客
                //   }
                // });
            });
        }).then(function (result) {
            resp = result;
        }).catch(function (err) {
            console.log(err);
        });
        return resp;

    }

    async findChild(teamId) {

        return await this.ctx.model.XTeam.findAll({where: {parent_id: teamId}});
    }

    async getUserTeam(req) {


        // 获取当前团队所有的用户
        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取公司
        const userTeams = await sequelize.query(
            "select t.* , tu.user_rank from x_team t , x_team_user tu " +
            "where t.id = tu.team_id " +
            "and  tu.open_id = :open_id " +
            "order by t.level asc",
            {replacements: {open_id: req.open_id}, type: Sequelize.QueryTypes.SELECT})


        return userTeams

    }


}

module.exports = TeamService;
