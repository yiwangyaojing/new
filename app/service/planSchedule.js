'use strict';

const Service = require('egg').Service;
const FileType = require('../const/FileType')
const moment = require('moment')
const Sequelize = require('sequelize')

class planScheduleService extends Service {

    /**
     * 获取方案状态信息
     */
    async index(req) {

        const result = await this.ctx.model.XPlanSchedule.findAll({
            where: {plan_id: req.plan_id},
            order: [["updated_at", "desc"]]
        })

        if (result) {
            for (let scd of result) {
                if (scd.scd_time) {
                    scd.scd_time = moment(scd.scd_time).format('YYYY-MM-DD HH:mm')
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
        console.log(1)
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

        console.log(2)
        const result = await ctx.model.XPlanSchedule.create(req)
        if (result) {
            console.log(3)
            // 查询公司逾期规则
            let overdue = {}
            if(!req.company_id){
                overdue.htqd =7
                overdue.sgwc =7
                overdue.bwwc =7
            }else{
                overdue = await ctx.model.XOverdue.findOne({where: {company_id: req.company_id}})
            }
            let overdue_date

            console.log(4)
            if (req.scd_status === FileType.schedule.htqd) {
                overdue_date = moment(req.scd_time).add(overdue.htqd + 1, 'days').format("YYYY-MM-DD")
            } else if (req.scd_status === FileType.schedule.sgwc) {
                overdue_date = moment(req.scd_time).add(overdue.sgwc + 1, 'days').format("YYYY-MM-DD")
            } else if (req.scd_status === FileType.schedule.bwwc) {
                overdue_date = moment(req.scd_time).add(overdue.bwwc + 1, 'days').format("YYYY-MM-DD")
            }

            console.log(5)
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

        console.log(6)
        return result
    }

    async writeNote(params) {
        const planScheduleObj = {};
        planScheduleObj.open_id = params.open_id;
        planScheduleObj.plan_id = params.plan_id;
        planScheduleObj.scd_status = FileType.schedule.xgj;
        planScheduleObj.scd_name = FileType.scheduleName[FileType.schedule.xgj];
        planScheduleObj.scd_remark = params.scd_remark;
        planScheduleObj.scd_r_remark = params.content;
        planScheduleObj.scd_time = new Date();

        return await this.ctx.model.XPlanSchedule.create(planScheduleObj);
    }

    async updateSchedule(params) {
        const ctx = this.ctx
        // 更新客户表的状态列
        const planInfo = await this.ctx.model.XPlans.findOne({ where: { id: params.plan_id } });
        let new_scd_status_all = planInfo.scd_status_all;
        let new_scd_status = planInfo.scd_status;
        let new_scd_time = planInfo.scd_time;
        let new_scd_id = planInfo.scd_id;
        let new_scd_name = planInfo.scd_name;

        if (params.createArray.length > 0) {
            for (let i = 0; i < params.createArray.length; i++) {
                const planScheduleObj = {};
                planScheduleObj.open_id = params.open_id;
                planScheduleObj.plan_id = params.plan_id;
                planScheduleObj.scd_status = params.createArray[i].status;
                planScheduleObj.scd_name = FileType.scheduleName[params.createArray[i].status];
                planScheduleObj.scd_remark = params.scd_remark;
                planScheduleObj.scd_time = params.createArray[i].time;

                // 更新状态表状态
                const result = await this.ctx.model.XPlanSchedule.create(planScheduleObj);

                // 处理客户表状态
                new_scd_status_all = new_scd_status_all + ',' + params.createArray[i].status;
                // 如果新状态比原状态级别高,则用新状态
                if (new_scd_status < result.scd_status) {
                    new_scd_status = result.scd_status;
                    new_scd_time = result.scd_time;
                    new_scd_id = result.id;
                    new_scd_name = result.scd_name;
                }
            }
        }
        let overdue = {}
        if(!planInfo.company_id){
            overdue.htqd =7
            overdue.sgwc =7
            overdue.bwwc =7
        }else{
            overdue = await ctx.model.XOverdue.findOne({where: {company_id: planInfo.company_id}})
        }
        let overdue_date

        if (new_scd_status === FileType.schedule.htqd) {
            overdue_date = moment(new_scd_time).add(overdue.htqd + 1, 'days').format("YYYY-MM-DD")
        } else if (new_scd_status === FileType.schedule.sgwc) {
            overdue_date = moment(new_scd_time).add(overdue.sgwc + 1, 'days').format("YYYY-MM-DD")
        } else if (new_scd_status === FileType.schedule.bwwc) {
            overdue_date = moment(new_scd_time).add(overdue.bwwc + 1, 'days').format("YYYY-MM-DD")
        }
        await this.ctx.model.XPlans.update({
            scd_status_all: new_scd_status_all,
            scd_name: new_scd_name,
            scd_id: new_scd_id,
            scd_status: new_scd_status,
            scd_time: new_scd_time,
            overdue_date: overdue_date
        }, {
                where: {
                    id: params.plan_id,
                }
            })
        if (params.updateArray.length > 0) {
            for (let i = 0; i < params.updateArray.length; i++) {
                await this.ctx.model.XPlanSchedule.update({
                    scd_time: params.updateArray[i].time,
                }, {
                        limit: 1,
                        where: {
                            plan_id: params.plan_id,
                            scd_status: params.updateArray[i].status,
                        }
                    });

                // 更新了原最高状态的时间
                if (new_scd_status === params.updateArray[i].status) {
                    new_scd_time = params.updateArray[i].time;
                }
            }
        }

        await this.ctx.model.XPlans.update({
            scd_status_all: new_scd_status_all,
            scd_name: new_scd_name,
            scd_id: new_scd_id,
            scd_status: new_scd_status,
            scd_time: new_scd_time,
            overdue_date: overdue_date
        }, {
                where: {
                    id: params.plan_id,
                }
            })
        return 'success';
    }

    async stop(params) {
        const planScheduleObj = {};
        planScheduleObj.open_id = params.open_id;
        planScheduleObj.plan_id = params.plan_id;
        planScheduleObj.scd_status = FileType.schedule.xmzz;
        planScheduleObj.scd_name = FileType.scheduleName[FileType.schedule.xmzz];
        planScheduleObj.scd_remark = params.scd_remark;
        planScheduleObj.scd_time = new Date();

        const result = await this.ctx.model.XPlanSchedule.create(planScheduleObj);
        // 更新客户表的状态列
        const planInfo = await this.ctx.model.XPlans.findOne({ where: { id: params.plan_id } });
        const new_scd_status_all = planInfo.scd_status_all + ',' + FileType.schedule.xmzz;
        return await this.ctx.model.XPlans.update({
            scd_id: result.id,
            scd_time: result.scd_time,
            scd_status_all: new_scd_status_all,
            scd_status: FileType.schedule.xmzz,
            scd_name: FileType.scheduleName[FileType.schedule.xmzz],
        }, {
                where: {
                    id: params.plan_id,
                }
            })
    }

    async resume(params) {
        // 删除项目终止记录
        await this.ctx.model.XPlanSchedule.destroy({
            where: {
                plan_id: params.plan_id,
                scd_status: FileType.schedule.xmzz,
            }
        });
        // 更新客户表的状态列
        const planInfo = await this.ctx.model.XPlans.findOne({ where: { id: params.plan_id } });
        const Op = Sequelize.Op;
        const planScheduleInfo = await this.ctx.model.XPlanSchedule.findOne({ where: { plan_id: params.plan_id, scd_status: { [Op.in]: [0, 1, 2, 3, 4] } }, order: [['scd_status', 'desc']] });
        // 如果存在项目终止的状态则去掉该状态
        if (planInfo.scd_status_all.indexOf(',9') > 0) {
            const new_scd_status_all = planInfo.scd_status_all.replace(',9', '');
            await this.ctx.model.XPlans.update({
                scd_status_all: new_scd_status_all,
                scd_name: planScheduleInfo.scd_name,
                scd_id: planScheduleInfo.id,
                scd_status: planScheduleInfo.scd_status,
                scd_time: planScheduleInfo.scd_time,
            }, {
                    where: {
                        id: params.plan_id,
                    }
                })
        }
        return 'success';
    }
}

module.exports = planScheduleService