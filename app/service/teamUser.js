const Service = require('egg').Service;

const Sequelize = require('sequelize')

const FileType = require('../const/FileType')


class TeamUserService extends Service {

  async index(req){

    const teamId = req.teamId


    const cfg = this.config.sequelize;
    cfg.logging = false;
    const sequelize = new Sequelize(cfg);

    const result = await sequelize.query(
      "select tu.*, u.id as user_id, u.name, u.avatarUrl " +
      "from x_team_user tu , x_users u  " +
      "where tu.open_id = u.openid " +
      "and tu.team_id = :teamId " ,
      { replacements: { teamId: teamId}, type: Sequelize.QueryTypes.SELECT })

    return result

  }

  async findTeamUsers(req){

    const users = []
    const Op =  Sequelize.Op
    console.log(req)
    if(req.id){
      // 查询公司所有团队
      const companyTeams = await this.ctx.model.XTeam.findAll({where:{company_id:req.company_id}})

      // 遍历下级直系团队
      let teams = []
      teams.push(req.id)
      console.log(teams)

      await this.service.team.linealTeam(companyTeams,req,teams,'child')

      console.log(teams)
      // 查找当前团队以及直系下级所有用户
      const teamUsers = await this.ctx.model.XTeamUser.findAll({where:{team_id:{[Op.in]:teams},team_company_id:req.company_id}})
      for(let u of teamUsers){
         if(users.indexOf(u.open_id) === -1 ){
           users.push(u.open_id)
         }
      }
    }else{
      // 查找总公司所有业务员
      const teamUsers = await  this.ctx.model.XTeamUser.findAll({where:{team_id:req.company_id}})
      for(let u of teamUsers){
        if(users.indexOf(u.open_id) === -1 )  users.push(u.open_id)
      }
    }

    console.log(users)
    return users

  }

  async updateRule(req){

    const ctx = this.ctx

    const users = req.users

    const team = await ctx.model.XTeam.findOne({where:{id:req.team_id}})

    if(!team){
      throw new Error("团队不存在")
    }

    // 判断权限
    if(!await this.validatePower(team,req.operator)){
      throw  new Error("权限不足")
    }

    for(let user of users){
      await ctx.model.XTeamUser.update({user_rank:user.user_rank},{where :{ open_id:user.open_id}})
    }

  }

  async create(req){
    const ctx = this.ctx

    const team = await ctx.model.XTeam.findOne({where:{id:req.team_id}})
    if(!team){
      throw new Error("团队不存在")
    }
    // 判断权限
    if(!await this.validatePower(team,req.operator)){
      throw  new Error("权限不足")
    }

    req.team_parent_id = team.parent_id
    req.team_company_id = team.company_id
    req.team_level = team.level

    return ctx.model.XTeamUser.create(req)
  }

  async destroy(req){

    const ctx = this.ctx

    const team = await ctx.model.XTeam.findOne({where:{id:req.team_id}})

    if(!team){
      throw new Error("团队不存在")
    }

    // 判断权限
    if(!await this.validatePower(team,req.operator)){
      throw  new Error("权限不足")
    }

    return await ctx.model.XTeamUser.destroy({where:{team_id:req.team_id,open_id:req.open_id}})
  }

  // 从公司删除
  async deleteFromCompany(openid) {
    await ctx.model.XTeamUser.destroy({where: {open_id: openid}})
    const user = await ctx.model.XUser.findOne({where:{openid: openid}})
    user.dataValue.company_id = null
    user.dataValue.company_id = null
    user.dataValue.company_id = null
    return await ctx.model.XUser.update({
      company_id:null,
      company_name: null,
      company_logo: null
    }, {
      where: {
        openid: openid
      }
    })
  }

  async validatePower(team,open_id){

    let teamLevel = team.level
      const teamUser = await  this.ctx.model.XTeamUser.findOne({where:{open_id:open_id,user_rank:FileType.UserRank.admin},
        order:[['team_level',"ASC"]]})
      if(!teamUser || teamUser.team_level > teamLevel){
        return false;
      }

    return true

  }

  // 获取用户想详情
  async teamInfo(open_id,company_id){

    const cfg = this.config.sequelize;
    cfg.logging = false;
    const sequelize = new Sequelize(cfg);

    const result = await sequelize.query(
     "select xt.* , xtu.user_rank  from x_team_user xtu, x_team xt " +
      "where xtu.team_id = xt.id " +
      "and xtu.open_id =:open_id " +
      "and xt.company_id =:company_id " ,
      { replacements: { open_id: open_id ,company_id:company_id}, type: Sequelize.QueryTypes.SELECT })

    return result

  }

  async delUser(open_id){

    return await this.ctx.modle.XTeamUser.destroy({where:{open_id:open_id}})

  }

  /**
   * 获取用户的最高团队等级
   */
  async findMaxLevel(open_id,company_id){
    return await this.ctx.model.XTeamUser.findOne({
        where:{open_id:open_id,team_company_id:company_id},
        limit:1,
        order:[['team_level' ,'asc']]
      })

  }

  /**
   * 根据用户获取 用户团队信息team_
   */
  async teamManagerInit(req){


    const ctx = this.ctx

    const result = {}

    const teamParent = []
    const teamChild= []


    const teamUser  = await ctx.model.XTeamUser.findOne({where:{team_company_id:req.company_id , team_id:req.team_id ,open_id:req.open_id}})


    if(req.max_level >  req.team_level){  // 如果进入的是上级团队 ，权限统一为业务员
      result.user_rank =  FileType.UserRank.admin
    }else{
      // 如果进入的是下级团队 ，先判断在上级是否为管理员
      if(req.max_level_rank === FileType.UserRank.admin.toString()){
        result.user_rank  = req.max_level_rank
      }else{
         // 上级最高不是业务员
        if(teamUser){
          result.user_rank = teamUser.user_rank
        }else {
          result.user_rank =  FileType.UserRank.agent
        }

      }
    }

    const parentId = teamUser ? teamUser.team_parent_id : null
    // 获取当前团队下 所有团队列表
    const teams = await  ctx.model.XTeam.findAll({where:{company_id:req.company_id}})

    for(let team of teams){
      if(team.level <= req.team_level){
        if(!parentId||team.id === parentId){
          teamParent.push(team)
        }
      }else{
        if(team.parent_id.toString() === req.team_id){
          teamChild.push(team)
        }
      }
    }


    // 获取当前团队所有的用户
    const cfg = this.config.sequelize;
    cfg.logging = false;
    const sequelize = new Sequelize(cfg);

    // 获取公司
    const teamUsers = await sequelize.query(
      "select u.name ,u.avatarUrl , u.openid , tu.user_rank  from x_team_user tu,  x_users u " +
      "where tu.open_id =  u.openid " +
      "and tu.team_id = :team_id " +
      "and tu.team_company_id = :company_id " ,
      { replacements: { team_id:req.team_id , company_id:req.company_id}, type: Sequelize.QueryTypes.SELECT })


    result.agents = teamUsers
    result.teamParent = teamParent
    result.teamchild = teamChild

    return result

  }


  async getAdminTeams(company_id,open_id){

    const ctx = this.ctx

    let result ={}
    let teams = []

    const teamUser = await ctx.model.XTeamUser.findOne({
      where:{team_company_id:company_id,open_id:open_id,user_rank:FileType.UserRank.admin},
      order:[['team_level','asc']]
    })

    // console.log(teamUser)
    if(teamUser) {
      // 获取团队下所有用户
      const Op = Sequelize.Op;
      teams = await ctx.model.XTeam.findAll({
        where: {
          company_id: company_id,
          level: {[Op.gte]: teamUser.team_level}
        },
        order: [['level', 'asc']]
      })
      result.maxLevel = teamUser.team_level
      result.teams = teams
    }

    return result
  }


  // 获取公司所有用户
  async companyUsers(company_id){

    return await  this.ctx.model.XUsers.findAll({where:{company_id:company_id}})
  }
  // 通讯录
  async getFriendList(company_id){


    let result = {}

    const cfg = this.config.sequelize;
    cfg.logging = false;
    const sequelize = new Sequelize(cfg);


    if(!company_id) return result

    // 获取公司所有用户团队信息
    const teamUsers = await sequelize.query(
      "select u.name, u.avatarUrl ,u.openid as open_id , tu.team_id , t.name as team_name ,t.level " +
      "from x_users u " +
      "left join x_team_user tu on tu.open_id = u.openid  " +
      "left join  x_team t on  t.id = tu.team_id " +
      "where u.company_id = :company_id ",
      { replacements: {company_id:company_id}, type: Sequelize.QueryTypes.SELECT })


    // const teamUsers = await sequelize.query(
    //   "select u.name, u.avatarUrl ,u.openid as open_id , tu.user_rank ,tu.team_id , t.name as team_name ,t.level  " +
    //   "from x_team_user tu, x_team  t, x_users u " +
    //   "where tu.open_id =  u.openid " +
    //   "and tu.team_id =  t.id " +
    //   "and tu.team_company_id = :company_id " +
    //   "order by tu.team_level asc" ,
    //   { replacements: {company_id:company_id}, type: Sequelize.QueryTypes.SELECT })

    // 封装团队信息
    let agents = []

    let teams = []

    for(let teamUser of teamUsers){
       let team ={}
        team.level = teamUser.level
        team.team_id = teamUser.team_id
        team.teamName = teamUser.team_name
        team.userRank = teamUser.user_rank
       let agent
       for(let tempAgent of agents ){
         if(tempAgent.open_id === teamUser.open_id){
           agent = tempAgent
         }
       }

       let flag =true
      for(let t of teams ){
        if(t.team_id === team.team_id){
          flag =false
        }
      }

      if(flag&&team.team_id)teams.push(team)

       if(!agent){
         teamUser.teams = []
         if(team.team_id){
           teamUser.teams.push(team)
         }
         agents.push(teamUser)
       }else {
         if(team.team_id) agent.teams.push(team)
       }
    }
    result.agents = agents
    result.teams =teams

    return result


  }

  // 通过团队 id 和普通用户 id 获取该 用户所在团队的职位,管理员或者普通员工,及其公司子团队父团队等等
  async findOneByOpenIdteamId(team_id, open_id) {
    console.log('开始获取成员团队职务' + open_id + ',' + team_id);
    const team = await this.ctx.model.XTeamUser.findOne({ where: {open_id:open_id,team_id:team_id}});
    if( team && team.dataValues ){
      return team.dataValues;
    }else{
      return ''
    }

  }

  // 通过转发邀请用户
  async join(params) {
    // 添加用户团队
    const addTeam = {
      team_id: params.team_id,
      operator: params.operator,
      open_id: params.open_id,
      user_rank: params.user_rank
    }
    await this.create(addTeam)
    const updateParams = {
      phone: params.phone,
      name: params.name
    }

    // 修改用户信息
    return await this.ctx.model.XUser.updateParams(updateParams, params.open_id)
  }


}
module.exports = TeamUserService
