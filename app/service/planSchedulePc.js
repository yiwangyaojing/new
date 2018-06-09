'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const moment = require('moment')

class planSchedulePcService extends Service {

    /**
     * 获取方案状态信息
     */
    async query(req) {

        const Op = Sequelize.Op;

        let page = {
            pageIndex: req.pageIndex,
            pageSize: req.pageSize,
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
            offset: page.pageIndex,
            limit: page.pageSize,
            order: [ ["created_at","desc"] ]

        }).then(result => {
            page.totalCount = result.count
            page.content = result.rows
            // console.log(page.content)
        })

        return page
    }


}

module.exports = planSchedulePcService