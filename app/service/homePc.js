'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize')
const moment = require('moment')

class HomePcService extends Service {


    /**
     * 团队查询参数
     */
    async getTeamQueryParams(req){

        const service  = this.service

        const Op = Sequelize.Op

        let result = {}

        const  openId  = req.open_id // 登录用户
        const  companyId = req.company_id //登录用户所属公司
        const  teamLevel = req.teamLevel // 团队等级
        const  teamId = req.teamId // 团队Id
        const  planOwner = req.planOwner // 客户所有者-查询单独个人

        const  teamInfo = await service.teamUserPc.getTeams(openId,companyId,teamId,teamLevel)
        const  userRank = teamInfo.userRank // 用户权限
        let   managerTeams = teamInfo.managerTeams // 根据团队id筛选包含当前team的所有子团队
        let   agentTeams = teamInfo.agentTeams // 业务员角色所在的团队

        let  managerTeamsSql = managerTeams;
        let  agentTeamsSql = agentTeams;


        if(!managerTeams||managerTeams.length === 0) managerTeamsSql = null
        if(!agentTeams || agentTeams.length ===0) agentTeamsSql = null

        let params = []

        let sql = ""
        let sqlParams = {}

        if(teamLevel === 'all'){
            sql = "and (  p.team_id in (:managerTeams) or (p.open_id=:open_id and p.team_id in (:agentTeams)) or (p.open_id=:open_id and p.company_id is null) )  "
            sqlParams.managerTeams = managerTeamsSql
            sqlParams.agentTeams = agentTeamsSql
            sqlParams.open_id = openId

            params.push(
                { team_id: managerTeams},
                { open_id: openId,team_id:agentTeams},
                { open_id: openId,company_id:null},
            )
        }else if(teamLevel === 'one'){
            //  查询个人的时候
            sql = "and (  (p.open_id=:open_id and p.team_id in (:agentTeams) ) or (p.open_id=:open_id and p.company_id is null) )  "
            sqlParams.agentTeams = agentTeamsSql
            sqlParams.open_id = openId
            params.push(
                { open_id: openId,team_id:agentTeams},
                { open_id: openId,company_id:null},
            )

        }else {
             if(teamId === 'all' ){
                 sql = "and p.team_id in (:managerTeams) and company_id = :company_id "
                 sqlParams.managerTeams = managerTeamsSql
                 sqlParams.company_id = companyId
                 params.push(
                     {[Op.and]:[
                             { team_id:managerTeams},
                             { company_id:companyId},
                     ]}
                 )
             }else{
                 if(planOwner  ==='all' ){
                     sql = "and p.team_id in (:managerTeams)  and company_id =:company_id "
                     sqlParams.company_id = companyId
                     sqlParams.managerTeams = managerTeamsSql
                     params.push(
                         {[Op.and]:[
                                 { team_id:managerTeams},
                                 { company_id:companyId},
                             ]}
                     )
                 }else{
                     sql = "and p.team_id =:teamId and open_id = :open_id "
                     sqlParams.teamId = teamId
                     sqlParams.open_id = planOwner
                     params.push(
                         // { team_id:teamId ,open_id:planOwner},
                         { team_id:managerTeams ,open_id:planOwner},// 改为查询当前团队下所有的团队内  业务员的客户数量
                     )
                 }
             }

        }


        // // 判断查询条件
        // if(userRank === FileType.UserRank.admin){
        //    if(teamLevel === 'all'){
        //        params.push(
        //            { team_id:managerTeams},
        //            { open_id: openId,team_id:agentTeams},
        //            { open_id: openId,company_id:null},
        //        )
        //    }else {
        //        params.push(
        //            { team_id:managerTeams},
        //        )
        //    }
        //
        // }else{
        //     params.push(
        //         { open_id: openId,team_id:agentTeams},
        //         { open_id: openId,company_id:null},
        //     )
        // }
        result.userRank = userRank
        result.params = params
        result.sql = sql
        result.sqlParams =sqlParams

        // console.log('mysql 查询')
        // for( let i in sqlParams){
        //     console.log(i,sqlParams[i])
        // }
        return result

    }

    // 首页统计
    async homeCount(req){


        let result = {}

        const query = await this.getTeamQueryParams(req)

        const dateNow = moment().format("YYYY-MM-DD")

        // 统计方案进度
        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);


        const sql = query.sql
        let  sqlParams =Object.assign({},query.sqlParams)
        console.log('权限查询 sql =======>',sql)
        sqlParams.beginDate = req.beginDate
        sqlParams.endDate = req.endDate

        console.log(sql)
        let schedule = await sequelize.query(
            "SELECT " +
            "  p.scd_status, " +
            "  p.scd_name, " +
            "  count(p.scd_status) as total, " +
            "  sum( p.zj_price ) as price, " +
            "  sum( p.zj_capacity ) as capacity, " +
            "  sum( p.zj_input_capacity ) as input_capacity  " +
            "FROM " +
            "  x_plans p  " +
            "where  " +
            "p.scd_status in (0,1,2,3,4)  " +
            "and  date_format(p.scd_time, '%Y-%m-%d') >=:beginDate " +
            "and  date_format(p.scd_time, '%Y-%m-%d') <=:endDate " +
            " "+sql+" " +
            "GROUP BY " +
            " p.scd_status",
            {replacements: sqlParams, type: Sequelize.QueryTypes.SELECT})

        // 统计回款完成
        let payFinish= await sequelize.query(
            "SELECT " +
            "  6 as scd_status, " +
            "  '回款完成' as scd_name, " +
            "  count(*) as total, " +
            "  sum( p.zj_price ) as price, " +
            "  sum( p.zj_capacity ) as capacity, " +
            "  sum( p.zj_input_capacity ) as input_capacity  " +
            "FROM " +
            "  x_plans p  " +
            "where  " +
            "p.pay_sum >= p.zj_price " +
            "and  date_format(p.scd_time, '%Y-%m-%d') >=:beginDate " +
            "and  date_format(p.scd_time, '%Y-%m-%d') <=:endDate " +
            " "+sql+" " ,
            {replacements: sqlParams, type: Sequelize.QueryTypes.SELECT})

        if(payFinish.length > 0){
            schedule.push(payFinish[0])
        }
        console.log(schedule)

        // 统计逾期
        let overDueParams = Object.assign({},sqlParams)
        overDueParams.date = dateNow

        let overDue= await sequelize.query(
            "SELECT  " +
            " p.scd_status,  " +
            " p.scd_name,  " +
            " p.overdue_date,  " +
            " TIMESTAMPDIFF( DAY, p.overdue_date, :date ) as differ  " +
            "FROM  " +
            " x_plans p   " +
            "WHERE  " +
            " p.overdue_date IS NOT NULL   " +
            " AND p.overdue_date != ''   " +
            " AND p.overdue_date < :date   " +
            " "+sql+" " +
            "ORDER BY  " +
            " p.overdue_date ASC",
            {replacements: overDueParams, type: Sequelize.QueryTypes.SELECT})

        result.schedule = schedule
        result.overDue = overDue

        return result

    }
}




module.exports = HomePcService