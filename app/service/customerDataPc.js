'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const FileType = require('../const/FileType');
const md5 = require('md5');

// 时间工具插件;
var moment = require('moment');

class CustomerDataPcService extends Service {
    /**
     * PC端进度详情
     */
    async findParamsByPage(params) {
        const Op = Sequelize.Op;
        const page = {};
        // 设置默认值
        page.pageNumber = params.pageNumber || 1;
        page.pageSize = 10;

        let query_p = {
            created_at: '',
            tdfwvalue: '',
            fuzerenvalue: '',
            contractvalue: '',
            overduevalue: '',
            searchvalue: '',
            open_id: '',
            company_id: ''
        }

        let req_p = {
            datevalue: params.datevalue,//时间范围
            tdfwvalue: params.tdfwvalue,//团队范围
            fuzerenvalue: params.fuzerenvalue, //负责人
            contractvalue: params.contractvalue, //合同状态
            overduevalue: params.overduevalue,//逾期状态
            searchvalue: params.searchvalue,//搜索条件
            open_id: params.openId,
            company_id: params.companyId //公司id
        }

        for(let key in query_p) {
            if (req_p[key]) {
                if (req_p[key] instanceof Array && req_p[key].length > 1) {
                    query_p[key] = {
                        [Op.gte]: req_p[key][0]+' '+'00:00:00',
                        [Op.lte]: req_p[key][1]+' '+'23:59:59'
                    }
                    continue
                }
                query_p[key] = req_p[key]
            } else {
                delete query_p[key]
            }
        }

        // if (!searchvalue) {
        //     searchvalue = '';
        // }
        // searchvalue = '%' + searchvalue + '%';


        // 计算当前条数
        const start = (page.pageNumber - 1) * page.pageSize;


        // 开始分页查询
        const pageList = await this.ctx.model.XPlans.findAll({
            offset: start,
            limit: page.pageSize,
            where: query_p,
            order: [['updated_at', 'desc']],
        });
        return pageList;
    }

    /**
     * PC端 客户详情 概况 拍房子 收资料  排版子
     * @param rowId
     * @returns {Promise.<*>}
     */
    async details(rowId) {
        const houseImgs = [];
        const dataImgs = [];

        const XPlans = await this.ctx.model.XPlans.findOne({
            attributes: {
                include: [
                    [Sequelize.fn('date_format',Sequelize.fn('DATE_ADD',Sequelize.col('updated_at'),Sequelize.literal('INTERVAL 8 hour')),'%Y-%m-%d %H:%m:%s'),'updateTime' ],
                    [Sequelize.fn('date_format',Sequelize.fn('DATE_ADD',Sequelize.col('created_at'),Sequelize.literal('INTERVAL 8 hour')),'%Y-%m-%d %H:%m:%s'),'createTime' ],
                ] },
            where: { id: rowId }
        });
        if (XPlans === null) {
            throw new Error('该方案数据不存在！');
        }
        const result = XPlans.dataValues;

        if (result.h_is_finish === 1) {
            // 获取拍房子图片
            const fileHouse = await this.ctx.model.XFiles.findAll({
                where: { plan_id: rowId, source_type: FileType.HouseImg},
            });
            if (fileHouse) {
                for (const file of fileHouse) {
                    const imgs = {};
                    imgs.url = file.url;
                    imgs.mini_url = file.mini_url;
                    imgs.data_type =file.data_type
                    houseImgs.push(imgs);
                }
                result.houseImgs = houseImgs;
            }

        }
        if (result.d_is_finish === 1) {
            // 获取收资料图片
            const fileData = await this.ctx.model.XFiles.findAll({
                where: { plan_id: rowId, source_type: FileType.DataImg},
            });
            if (fileData) {
                for (const file of fileData) {
                    const imgs = {};
                    imgs.url = file.url;
                    imgs.mini_url = file.mini_url;
                    imgs.data_type =file.data_type
                    dataImgs.push(imgs);
                }
                result.dataImgs = dataImgs;
            }
        }

        return result;
    }

    /**
     * PC端客户详情 合同状态
     * @param rowId
     * @returns {Promise.<*>}
     */
    async findContractStatusById(rowId){
        const result = await this.ctx.model.XPlanSchedule.findAll(
            {
                attributes: {
                    include: [
                        [Sequelize.fn('date_format',Sequelize.fn('DATE_ADD',Sequelize.col('updated_at'),Sequelize.literal('INTERVAL 8 hour')),'%Y-%m-%d %H:%m:%s'),'updateTime' ],
                        [Sequelize.fn('date_format',Sequelize.fn('DATE_ADD',Sequelize.col('created_at'),Sequelize.literal('INTERVAL 8 hour')),'%Y-%m-%d %H:%m:%s'),'createTime' ],
                    ] },
                where: {plan_id: rowId},
                order: [['updated_at', 'desc']]
            },
        );
        return result;
    }
    /**
     * PC端客户详情 回款
     */
    async findPayStatusById(params){
        // 获取回款列表及用户
        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取公司
        const payUser = await sequelize.query(
            "select p.* , xu.name from x_plan_pay p , x_users xu " +
            "where p.plan_id = :plan_id " +
            "and  p.open_id = :open_id " +
            "and  xu.openid = p.open_id " +
            "order by p.updated_at desc",
            {replacements: {open_id: params.openId,plan_id: params.id}, type: Sequelize.QueryTypes.SELECT})
        return payUser
    }

    /**
     * 客户信息导入导出功能相关
     */
    async findByOpenId(open_id){
        const result = await this.ctx.model.XUsers.findOne({where:{openid:open_id}})
        let team
        if(result){
           team = await this.service.teamUser.findMaxLevel(result.openid,result.company_id)
          if(team){
            result.dataValues.maxTeamLevel = team.team_level
            result.dataValues.maxTeamId = team.team_id
            result.dataValues.maxTeamRank =team.user_rank
          }
    
          // 获取所有可管理的团队Id
          let managerTeams = []
          const teamUser  = await this.ctx.model.XTeamUser.findOne({where:{open_id:open_id,team_company_id:result.company_id,user_rank:FileType.UserRank.admin},order:[['team_level','asc']]})
          if(teamUser){
            // 获取所有团队
            const Op = Sequelize.Op;
            managerTeams.push(teamUser.team_id)
            result.dataValues.managerTeam = teamUser.team_id
            result.dataValues.managerTeamLevel = teamUser.team_level
            const teams = await  this.ctx.model.XTeam.findAll(
              {
                where:
                  {
                    company_id:result.company_id,
                    level:{
                      [Op.gt]:teamUser.team_level
                    }
                  }
              })
            for(let team of teams){
              if(managerTeams.indexOf(team.id) === -1 ){
                managerTeams.push(team.id)
              }
            }
          }
          result.dataValues.managerTeams = managerTeams
        }
    
    
        return result
      }

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
}

module.exports = CustomerDataPcService;