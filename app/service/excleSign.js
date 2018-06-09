'use strict';

const Service = require('egg').Service;

const Sequelize = require('sequelize');
let moment = require('moment');

class ExcleSignService extends Service {

    async excleExport(req) {
        const logger = this.ctx.logger

        const teamInfo  = await this.service.teamUserPc.getTeams(req.open_id,req.company_id,req.teamId,req.teamLevel)

        const managerTeams =  teamInfo.managerTeams
        let  userRank  = teamInfo.userRank


        let sql = ""
        let sqlParams = {}

        if(userRank === 2){
            sql = "and tu.open_id =:owner "
            sqlParams.owner = req.open_id
        }else{
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
        }
        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取总数
        // let totalCount = await sequelize.query(
        //     "select count(distinct tu.open_id) as total  from x_team_user tu  where 1=1  " +
        //     ""+sql+"",
        //     {replacements: sqlParams, type: Sequelize.QueryTypes.SELECT})
        //
        // console.log(totalCount)
        // 统计签到数据导出
        sqlParams.beginDate = req.beginDate
        sqlParams.endDate = req.endDate
        let signList = await sequelize.query(
            "select * " +
            "from (select sign1.create_time,sign1.yongHu,sign1.cst_name,sign1.openid,sign1.site,xt.name as tmName " +
            "from (SELECT xs.team_id as teamID, xu.openid,xu.name as yongHu, xs.cst_name , xs.site , xs.create_time " +
            "FROM x_sign xs LEFT JOIN x_users xu ON xu.openid = xs.open_id) as sign1 " +
            "LEFT JOIN x_team  xt ON  xt.id = sign1.teamID order by sign1.create_time ASC) as tus , x_team_user tu " +
            "where 1=1 " +
            "and tu.open_id = openid "+
            ""+sql+"" +
            "AND DATE_FORMAT(tus.create_time, '%Y-%m-%d') >=:beginDate " +
            "and DATE_FORMAT(tus.create_time, '%Y-%m-%d') <=:endDate " ,
            {replacements: sqlParams, type: Sequelize.QueryTypes.SELECT})
        // console.log("统计签到数据导出=======>", sign)
        let exprotSignList= []
        let tmp = {}
        let c = 0
        signList.forEach((item, index) => {
            let time =moment(item.create_time).format("YYYY-MM-DD")
            let time1=moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")
            if (!tmp.hasOwnProperty(item.openid + time)) {
                tmp[item.openid + time] = c
                c++
                exprotSignList.push({
                    create_time: time,
                    yongHu: item.yongHu,
                    openid: item.openid,
                    sign: [
                        {
                            site: item.site,
                            create_time: time1,
                            cst_name: item.cst_name,
                            tmName: item.tmName
                        }
                    ],
                })
            } else {
                exprotSignList[tmp[item.openid + time]].sign.push({
                    site: item.site,
                    create_time: time1,
                    cst_name: item.cst_name,
                    tmName: item.tmName
                })
            }
        })

        return exprotSignList


        // 获取团队用户
        //const teamUser = await ctx.model.XTeamUser.findAll()
    }

    /**
     * 获取方案状态信息
     */
    async query(req) {

        const Op = Sequelize.Op;

        let page = {
            content: [],
            totalCount: 0,
        }

        const dateNow = moment().format("YYYY-MM-DD")

        // 获取权限查询条件
        const query = await this.service.homePc.getTeamQueryParams(req)
        const params = query.params
        let status  = [0,2,3,4]
        let search = req.search
        if(!search){
            search= ''
        }
        search = '%'+search+'%'

        // 判断时间的查询类型，默认是按照方案录入时间。
        let queryTime = 'scd_time'
        if(req.type === 'customer'){
            queryTime = 'created_at'
            status = [0,1,2,3,4,5,6]
        }

        let  andParams = {}
        // 遍历条件查询条件
        if(req.scdStatus ==='all'){
            andParams = {
                [Op.or]: [
                    {scd_status: status},
                    {[Op.and]:[ {pay_gap: 0},{pay_sum:Sequelize.col('zj_price')}]},
                ]
            }
        }else if(req.scdStatus ==='0'){
            andParams = {
                [Op.or]: [
                    {scd_status: '0'},
                    {scd_status: '1'},
                ]
            }
        }else {
            if(req.scdStatus === '6'){
                andParams = {
                    pay_sum:{[Op.gte]:Sequelize.col('zj_price')},
                }
            }
            else {
                andParams.scd_status = req.scdStatus
            }
        }

        if(req.overDueStatus === '0'){
            andParams.overdue_date = {[Op.lte]:dateNow}
        }else if(req.overDueStatus === '1'){
            andParams.overdue_date = {[Op.or]:[{[Op.gte]:dateNow},{[Op.eq]:null},{[Op.eq]:''}]}
        }


        // sequelize.col('dailyview.stateDate')),'>=',sequelize.fn('TO_DAYS',lastDate))
        await this.ctx.model.XPlans.findAndCountAll({
            attributes: {
                include: [
                    [Sequelize.fn('STRCMP',Sequelize.col('overdue_date'),dateNow),'overdue' ],
                    [Sequelize.fn('DATE_ADD',Sequelize.col('scd_time'),Sequelize.literal('INTERVAL 8 hour')),'scdTime' ],
                    [Sequelize.fn('DATE_ADD',Sequelize.col('created_at'),Sequelize.literal('INTERVAL 8 hour')),'createTime' ]
                ] },
            where: {
                [Op.or]: params,
                [Op.and]: {
                    [Op.or]: [{
                        cst_name: {
                            [Op.like]: search,
                        },
                    }, {
                        cst_address: {
                            [Op.like]: search,
                        },
                    },{
                        user_name: {
                            [Op.like]: search,
                        },
                    },{
                        zj_capacity: {
                            [Op.like]: search,
                        },
                    },{
                        zj_price: {
                            [Op.like]: search,
                        },
                    }
                    ],
                    [Op.and]:[
                        Sequelize.where(Sequelize.fn('date_format', Sequelize.col(queryTime), '%Y-%m-%d'),'>=' ,req.beginDate),
                        Sequelize.where(Sequelize.fn('date_format', Sequelize.col(queryTime), '%Y-%m-%d'),'<=' ,req.endDate),
                        andParams,
                    ]

                }
            },
            order: [ ["created_at","desc"] ]

        }).then(result => {
            page.totalCount = result.count
            page.content = result.rows
            // console.log(page.content)
        })
        return page
    }
}

module.exports = ExcleSignService;
