'use strict';

const Service = require('egg').Service;

const Sequelize = require('sequelize');
let moment = require('moment');

class SignPcService extends Service {

    async index(req) {

        const teamInfo  = await this.service.teamUserPc.getTeams(req.open_id,req.company_id,req.teamId,req.teamLevel)

        const managerTeams =  teamInfo.managerTeams

        let sql = ""
        let sqlParams = {}

        if(req.teamLevel === 'all' || req.teamId ==='all'){
            sql = "and tu.team_id in (:agentTeams) "
            sqlParams.agentTeams = managerTeams
        }else if(req.owner ==='all'){
            sql = "and tu.team_id =:teamId "
            sqlParams.teamId = req.teamId
        }else {
            sql = "and tu.open_id =:owner "
            sqlParams.owner = req.owner
        }


        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取总数
        let totalCount = await sequelize.query(
            "select count(distinct tu.open_id) as total  from x_team_user tu  where 1=1  " +
            ""+sql+"",
            {replacements: sqlParams, type: Sequelize.QueryTypes.SELECT})

        console.log(totalCount)
        // 统计签到
        sqlParams.beginDate = req.beginDate
        sqlParams.endDate = req.endDate
        let sign = await sequelize.query(
            "select  " +
            "distinct u.openid, u.name, " +
            "group_concat(distinct t.name order by tu.team_level asc separator ',') as team,  " +
            "(select count(1) from x_sign s where s.open_id = u.openid  and date_format(s.create_time, '%Y-%m-%d') >=:endDate and  date_format(s.create_time, '%Y-%m-%d') >=:beginDate ) as sign " +
            "from x_team_user tu,x_team t ,x_users u  " +
            "where tu.open_id = u.openid  " +
            "and tu.team_id = t.id " +
            " "+sql+" " +
            "group by u.openid ",
            {replacements: sqlParams, type: Sequelize.QueryTypes.SELECT})

        // 手动分页
        let page = {
            pageIndex: req.pageIndex,
            pageNumber:req.pageNumber,
            pageSize: req.pageSize,
            content: sign,
            totalCount: totalCount[0].total
        }

        return page


        // 获取团队用户
        //const teamUser = await ctx.model.XTeamUser.findAll()
    }

    async detail(req){

        const ctx = this.ctx


        const Op = Sequelize.Op;

        // 手动分页
        let page = {
            pageIndex: req.pageIndex,
            pageNumber:req.pageNumber,
            pageSize: req.pageSize,
            content: [],
            totalCount: ''
        }
        await ctx.model.XSign.findAndCountAll({
            // attributes: { include: [[Sequelize.fn('date_format',Sequelize.col('created_at'),'%Y-%m-%d %H:%i:%S'),'date_format' ]] },
            attributes: { include: [[Sequelize.fn('DATE_ADD',Sequelize.col('create_time'),Sequelize.literal('INTERVAL 8 hour')),'createTimeFormat' ]] },
            where:{
                [Op.and]:[
                    {open_id:req.owner},
                    Sequelize.where(Sequelize.fn('date_format', Sequelize.col('create_time'), '%Y-%m-%d'),'>=' ,req.beginDate),
                    Sequelize.where(Sequelize.fn('date_format', Sequelize.col('create_time'), '%Y-%m-%d'),'<=' ,req.endDate)
                ]}
        }).then(result => {
            page.totalCount = result.count
            page.content = result.rows
        })

        for(let sign of page.content){
            sign.date_format = moment(sign.date_format).subtract(8, "hours").format("YYYY-MM-DD HH:mm:ss")
            console.log(sign.date_format)
        }

        return page
    }

}

module.exports = SignPcService;
