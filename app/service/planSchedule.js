'use strict';

const Service = require('egg').Service;
const FileType = require('../const/FileType')
const moment = require('moment')

class planScheduleService extends Service {

    /**
     * 获取方案状态信息
     */
    async index(req) {

        const result = await this.ctx.model.XPlanSchedule.findAll({
            where: {plan_id: req.plan_id},
            order: [["created_at", "desc"]]
        })

        if (result) {
            for (let scd of result) {
                if (scd.scd_time) {
                    scd.scd_time = moment(scd.scd_time).format("MM/DD")
                }
            }
        }

        return result
    }

    /**
     * 新增方案记录
     */
    async create(req) {

        const ctx = this.ctx

        // 获取上一次最新的状态
        const scd = await ctx.model.XPlanSchedule.findOne(
            {
                where: {
                    plan_id: req.plan_id
                },
                order: [["created_at", "desc"]],
            })

        if (scd) {
            req.from_status = scd.scd_status
        }
        req.scd_name = FileType.scheduleName[req.scd_status]
        req.from_name = FileType.scheduleName[req.from_status]
        req.scd_time = new Date(req.scd_time)

        const result = await ctx.model.XPlanSchedule.create(req)
        if (result) {
            // 查询公司逾期规则
            const overdue = await ctx.model.XOverdue.findOne({where: {company_id: req.company_id}})
            let overdue_date = ''
            if (overdue) {
                if (req.scd_status === FileType.schedule.htqd) {
                    overdue_date = moment(req.scd_time).add(overdue.htqd + 1, 'days').format("YYYY-MM-DD")
                } else if (req.scd_status === FileType.schedule.sgwc) {
                    overdue_date = moment(req.scd_time).add(overdue.sgwc + 1, 'days').format("YYYY-MM-DD")
                } else if (req.scd_status === FileType.schedule.bwwc) {
                    overdue_date = moment(req.scd_time).add(overdue.bwwc + 1, 'days').format("YYYY-MM-DD")
                }
            }
            await ctx.model.XPlans.update(
                {
                    scd_status: req.scd_status,
                    scd_time: req.scd_time,
                    scd_name: req.scd_name,
                    scd_id: result.id,
                    overdue_date: overdue_date
                },
                {
                    where:
                        {
                            id: req.plan_id
                        }
                })
        }

        return result
    }

}

module.exports = planScheduleService