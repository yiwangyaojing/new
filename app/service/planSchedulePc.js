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
        const status  = [0,2,3,4]
        let search = req.search
        if(!search){
            search= ''
        }
        search = '%'+search+'%'

        let  andParams = {}
        // 遍历条件查询条件
        if(req.scdStatus ==='all'){
            andParams = {
                [Op.or]: [
                    {scd_status: status},
                    {pay_gap: 0}
                ]
            }
        }else {
            if(req.scdStatus === '6'){
                andParams.pay_gap = 0
            }
        }

        if(req.overDueStatus === '0'){
            andParams.overdue_date = {[Op.lte]:dateNow}
        }else if(req.overDueStatus === '1'){
            andParams.overdue_date = {[Op.or]:[{[Op.gte]:dateNow},{[Op.eq]:null},{[Op.eq]:''}]}
        }

        // 计算当前条数
       // sequelize.col('dailyview.stateDate')),'>=',sequelize.fn('TO_DAYS',lastDate))
        await this.ctx.model.XPlans.findAndCountAll({
            attributes: { include: [[Sequelize.fn('STRCMP',Sequelize.col('overdue_date'),dateNow),'overdue' ]] },
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
                        andParams,
                        Sequelize.where(Sequelize.fn('date_format', Sequelize.col('scd_time'), '%Y-%m-%d'),'>=' ,req.beginDate),
                        Sequelize.where(Sequelize.fn('date_format', Sequelize.col('scd_time'), '%Y-%m-%d'),'<=' ,req.endDate),
                    ]

                }
            },
            offset: page.pageIndex,
            limit: page.pageSize,
            order: [ ["created_at","desc"] ]

        }).then(result => {
            page.totalCount = result.count
            page.content = result.rows
            console.log(page.content)
        })

        return page
    }


}

module.exports = planSchedulePcService