'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize')

class TeamPcService extends Service {

  async findAll(company_id){
    return  await this.ctx.model.XTeam.findAll({where:{id:company_id},order:[['level','asc']]})
  }


  async findByIds(teamIds){
    return await this.ctx.model.XTeam.findAll({where:{id:teamIds},order:[['level','asc']]})
  }

  async index(openid, companyId) {
    const { ctx } = this
    const logger = ctx.logger
    // 查询团队机构树
    let teams = await ctx.model.XTeam.findAll({
      where: {
        company_id: companyId
      }
    })
    logger.info('TeamPcService-index：这里是查询出团队信息===>>', teams)
    let teamTree = await this.getTeamTree(teams, null)
    logger.info('TeamPcService-index：构建机构树===>>', teams, teamTree, teamTree[0].children)
    logger.info('这里是子团队信息===>>', teamTree)
    let topTeamId
    if (teamTree.length > 0) {
      topTeamId = teamTree[0].id
    }
    if (!topTeamId) {
      return {
        teams: teamTree,
        data: []
      }
    }
    let topTeam = teamTree[0]
    // 查询顶层第一个team业务员信息
    // 创建人
    const teamCreateUser = await ctx.model.XUsers.findOne({
      where: {
        openid: topTeam.open_id
      }
    })
    logger.info('这里是查询出的创建人===>>', teamCreateUser)
    // 人员
    const teamUsers = await this.findTeamUsersByPage(topTeamId, openid, 0, 10)
    logger.info('这里是查询出人员信息===>>', teamUsers)
    return {
      teams: teamTree,
      data: teamUsers
    }
  }

  // 查找团队，根据团队id
  async findTeamByTeamId(teamId) {
    const { ctx } = this
    return await ctx.model.XTeam.findOne({
      where: {
        id: teamId
      }
    })
  }

  // 解散团队，根据团队id 和 openid
  async dissolveTeam(teamId, openid) {
    const { ctx } = this
    const team = await this.findTeamByTeamId(teamId)
    if (!team) {
      throw new Error('团队不存在')
    }
    const cfg = this.config.sequelize
    cfg.logging = false
    const logger = ctx.logger
    const sequelize = new Sequelize(cfg)
    return await sequelize.transaction(function(t) {
      if (team.id === team.company_id && team.level === 0) {
        // 解散公司
        // 判断是否为公司创始人，否则无权限解散
        if (team.open_id !== openid) {
          throw new Error('只有公司创始人才可以解散公司')
        }
        // 清空人员信息
        return ctx.model.XUsers.destroy({ where: {
            company_id: teamId
          }
        }, { transaction: t }).then(() => {
          // 清空x_team_user数据
          return ctx.model.XTeamUser.destroy({ where: {
              team_id: teamId
            }
          }, { transaction: t })
        }).then(() => {
          // 清空x_team
          return ctx.model.XTeam.destroy({ where: {
              id: teamId
            }
          }, { transaction: t })
        }).then(() => {
          // 清空x_plans 数据
          return ctx.model.XPlans.destroy({ where: {
              team_id: teamId
            }
          }, { transaction: t })
        })
      } else {
        // 清空人员信息
        return ctx.model.XTeamUser.destroy({ where: {
            team_id: teamId
          }
        }, { transaction: t }).then(() => {
          // 清空x_team
          return ctx.model.XTeam.destroy({ where: {
              id: teamId
            }
          }, { transaction: t })
        }).then(() => {
          // 清空x_plans 数据
          return ctx.model.XPlans.destroy({ where: {
              team_id: teamId
            }
          }, { transaction: t })
        })
      }
    }).then(function(result) {
      logger.info('这里是事务结果===>>', result)
      return result
    }).catch(function(err) {
      logger.error('解散团队失败===>>', err);
    })
  }

  // 团队管理员变更
  async changeTeamUsersRole(teamId, openid, users) {
    const { ctx } = this
    const Op = Sequelize.Op;
    let usersOpenId = []
    let user_rank1_openId = []
    let user_rank2_openId = []
    users.forEach(item => {
      usersOpenId.push(item.open_id)
      if (item.user_rank === 1) {
        user_rank1_openId.push(item.open_id)
      } else {
        user_rank2_openId.push(item.open_id)
      }
    })
    const cfg = this.config.sequelize
    cfg.logging = false
    const logger = ctx.logger
    const sequelize = new Sequelize(cfg)
    return await sequelize.transaction(function(t) {
      // 修改成管理员
      return ctx.model.XTeamUser.update({
        user_rank: 1
      }, {
        where: {
          open_id: {
            [Op.in]: user_rank1_openId
          },
          team_id: teamId
        }
      }, {transaction: t}).then(() => {
        // 修改成业务员
        return ctx.model.XTeamUser.update({
          user_rank: 2
        }, {
          where: {
            open_id: {
              [Op.in]: user_rank2_openId
            },
            team_id: teamId
          }
        }, {transaction: t})
      })
    }).then(function(result) {
      logger.info('这里是修改角色事物结果===>>', result)
      return result
    }).catch(function(err) {
      logger.error('这里是团队管理员修改失败===>>', err);
    })
  }

  // 分页查询team users
  async findTeamUsersByPage(teamId, openid, pageIndex, limit) {
    teamId = String(teamId)
    const { ctx } = this
    const logger = ctx.logger
    const cfg = this.config.sequelize;
    cfg.logging = false
    const sequelize = new Sequelize(cfg);
    // 查询团队
    const team = await ctx.model.XTeam.findOne({
      where: {
        id: teamId
      }
    })
    console.log('这里是查询出团队信息===>>', team)
    if (!team) {
      throw new Error('该团队不存在!')
    }
    // 查询团队创建者
    const user = await ctx.model.XUsers.findOne({ where: {
        openid: team.open_id
      }
    })
    let teamUsers
    let total
    if (team.level === 0) {
      total = await sequelize.query('select count(1) as total from (select a.name, a.company_id, a.openid, a.company_founder from x_users a where a.company_id = :teamId) as tab1 ' +
        ' left join ( select b.team_id, b.open_id, b.user_rank from  x_team_user b where b.team_id = :teamId) as tab2 on tab1.openid = tab2.open_id ' +
        ' left join (select c.open_id, c.team_id, count(1) as num from x_plans c where c.team_id = :teamId group by c.open_id) as tab3 on tab3.open_id = tab1.openid'
        , {replacements: {teamId: teamId}, type: Sequelize.QueryTypes.SELECT})
      teamUsers = await sequelize.query('select * from (select a.name, a.company_id, a.openid, a.company_founder from x_users a where a.company_id = :teamId) as tab1 ' +
        ' left join ( select b.team_id, b.open_id, b.user_rank from  x_team_user b where b.team_id = :teamId) as tab2 on tab1.openid = tab2.open_id ' +
        ' left join (select c.open_id, count(1) as num from x_plans c where c.team_id = :teamId group by c.open_id) as tab3 on tab3.open_id = tab1.openid' +
        ' limit :pageIndex, :pageSize', {replacements: {pageIndex: pageIndex, pageSize: limit, teamId: teamId}, type: Sequelize.QueryTypes.SELECT})
    } else {
      let target = []
      const teamAll = await ctx.model.XTeam.findAll({
        where: {
          company_id: team.dataValues.company_id
        }
      })
      await this.getUsers(team, teamAll, target)

      let teamIdList = []
      target.forEach(item => {
        teamIdList.push(item.id)
      })
      total = await sequelize.query('select count(1) as total from (select a.id, a.user_rank, a.team_id, a.team_company_id, a.created_at, a.open_id ' +
        ' from x_team_user a where a.team_id in (:teamIdList) GROUP BY a.open_id) as tab1' +
        ' left join (select b.open_id, b.team_id, count(1) as num from x_plans b where b.team_id = :teamId group by b.open_id ) as tab2' +
        ' on tab1.open_id = tab2.open_id', {replacements: {teamIdList: teamIdList, teamId: teamId}, type: Sequelize.QueryTypes.SELECT})
      // 查询team下所有的users
      teamUsers = await sequelize.query('select * from (select a.id, a.user_rank, a.team_id, a.team_company_id, a.created_at, a.open_id ' +
        ' from x_team_user a where a.team_id in (:teamIdList) GROUP BY a.open_id) as tab1' +
        ' left join (select b.open_id, b.team_id as b_team_id, count(1) as num from x_plans b where b.team_id = :teamId group by b.open_id ) as tab2' +
        ' on tab1.open_id = tab2.open_id left join (select c.openid, c.name from x_users c where c.company_id = :companyId) as tab3 on tab3.openid = tab1.open_id limit :pageIndex, :pageSize', {replacements: {teamIdList: teamIdList, teamId: teamId, pageIndex: pageIndex, companyId: team.company_id, pageSize: limit}, type: Sequelize.QueryTypes.SELECT})
    }
    teamUsers.forEach(item => {
      if (String(item.team_id) !== teamId) {
        item.user_rank = null
      }
    })

    let teamUsersList = await ctx.model.XTeamUser.findAll({
      where: {
        open_id: openid,
        user_rank: 1
      }
    })
    let teamsAll = await ctx.model.XTeam.findAll({
      where: {
        company_id: team.company_id
      }
    })
    let teamIds = []
    let parentIds = []
    teamUsersList.forEach(item => {
      parentIds.push(item.team_id)
    })
    teamsAll.forEach(item => {
      if ((parentIds.indexOf(item.parent_id) > -1) && teamIds.indexOf(item.id) === -1) {
        teamIds.push(item.id)
      }
    })
    teamsAll.forEach(item => {
      if ((teamIds.indexOf(item.parent_id) > -1) && teamIds.indexOf(item.id) === -1) {
        teamIds.push(item.id)
      }
    })
    teamsAll.forEach(item => {
      if ((teamIds.indexOf(item.parent_id) > -1) && teamIds.indexOf(item.id) === -1) {
        teamIds.push(item.id)
      }
    })
    console.log('这里是创建者===>>', user)
    // const teamUsers = await sequelize.query('select tab1.*, tab2.*, c.* from (' +
    //   'SELECT ' +
    //   'a.* ' +
    //   'FROM ' +
    //   'x_team_user a ' +
    //   'WHERE ' +
    //   'team_id = :teamId ' +
    //   ') as tab1 ' +
    //   'LEFT JOIN (' +
    //   'SELECT ' +
    //   'b.open_id,' +
    //   'count( 1 ) AS num ' +
    //   'FROM ' +
    //   'x_plans b ' +
    //   'WHERE team_id = :teamId ' +
    //   'GROUP BY ' +
    //   'b.open_id ' +
    //   ') AS tab2 ON tab2.open_id = tab1.open_id ' +
    //   'LEFT JOIN x_users c ON c.openid = tab1.open_id limit :pageIndex, :pageSize', {
    //   replacements: {teamId: teamId, open_id: openid, pageIndex: pageIndex, pageSize: limit}, type: Sequelize.QueryTypes.SELECT
    // })
    // const total = await  sequelize.query('select count(1) as total from (' +
    //   'SELECT ' +
    //   'a.* ' +
    //   'FROM ' +
    //   'x_team_user a ' +
    //   'WHERE ' +
    //   'team_id = :teamId ' +
    //   ') as tab1 ' +
    //   'LEFT JOIN (' +
    //   'SELECT ' +
    //   'b.open_id,' +
    //   'count( 1 ) AS num ' +
    //   'FROM ' +
    //   'x_plans b ' +
    //   'WHERE team_id = :teamId ' +
    //   'GROUP BY ' +
    //   'b.open_id ' +
    //   ') AS tab2 ON tab2.open_id = tab1.open_id ' +
    //   'LEFT JOIN x_users c ON c.openid = tab1.open_id limit :pageIndex, :pageSize', {
    //   replacements: {teamId: teamId, open_id: openid, pageIndex: pageIndex, pageSize: limit}, type: Sequelize.QueryTypes.SELECT
    // })
    logger.info('这里是人员信息查询结果===>>', teamUsers, total)
    if (teamIds.indexOf(Number(teamId)) > -1) {
      user.dataValues.isSaveShow = true
    } else {
      user.dataValues.isSaveShow = false
    }
    // 判断是否是公司管理员
    let companyManage = await ctx.model.XTeamUser.findAll({
      where: {
        open_id: openid,
        team_level: 0
      }
    })
    if (companyManage && companyManage.user_rank === 1) {
      user.dataValues.isCompanyManage = true
    } else {
      user.dataValues.isCompanyManage = false
    }
    // 查询公司信息
    const company = await ctx.model.XTeam.findOne({
      where: {
        id: team.company_id
      }
    })
    if (company.open_id === openid) {
      user.dataValues.isSaveShow = true
      user.dataValues.isCompanyManage = true
    }
    return {
      users: {
        data: teamUsers,
        total: total[0].total
      },
      founder: user,
      company: company
    }
  }

  async getUsers (team, teamAll, targetList) {
    targetList.push(team.dataValues)
    if (team.level === 3) {
      return
    }
    for (let i = 0; i < teamAll.length; i++) {
      if (team.id === teamAll[i].parent_id) {
        this.getUsers(teamAll[i], teamAll, targetList)
      }
    }
  }

  // 获取机构树
  async getTeamTree (teams, target) {
    if (!teams || teams.length === 0) {
      return []
    }
    if (!target || target.length === 0) {
      target = []
      await this.iteratorArr(teams, (item) => {
        if (!item.parent_id) {
          target.push(item)
          return true
        }
      })
      await this.getTeamTree(teams, target)
    } else {
      for (let i = 0, length = target.length; i < length; i++) {
        let parentItem = target[i]
        parentItem.dataValues.children = []
        await this.iteratorArr(teams, (childrenItem) => {
          if (childrenItem.parent_id === parentItem.id) {
            parentItem.dataValues.children.push(childrenItem)
            return true
          }
        })
        if (parentItem.dataValues.children.length === 0) {
          delete parentItem.dataValues.children
        } else {
          await this.getTeamTree(teams, parentItem.dataValues.children)
        }
      }
    }
    return target
  }

  // 数组遍历删除
  async iteratorArr(arr, fn) {
    for (let i = 0, skip = false; i < arr.length; skip ? i : i++) {
      skip = fn(arr[i], i)
      if (skip) {
        arr.splice(i, 1)
      }
    }
  }
}

module.exports = TeamPcService
