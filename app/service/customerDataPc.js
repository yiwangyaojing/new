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

        let tjzqvalue = params.tjzqvalue;
        let datevalue = params.datevalue;
        let tdfwvalue = params.tdfwvalue;
        let fuzerenvalue = params.fuzerenvalue;
        let contractvalue = params.contractvalue;
        let overduevalue = params.overduevalue;
        let searchvalue = params.searchvalue;
        let openId = params.openId;
        let companyId = params.companyId;

        if (!searchvalue) {
            searchvalue = '';
        }
        searchvalue = '%' + searchvalue + '%';

        let tjzqStartDate = datevalue[0]+' '+'00:00:00';
        let tjzqEndDateDate = datevalue[1]+' '+'23:59:59';

        // 计算当前条数
        const start = (page.pageNumber - 1) * page.pageSize;


        // 开始分页查询
        const pageList = await this.ctx.model.XPlans.findAll({
            offset: start,
            limit: page.pageSize,
            where: {
                open_id:openId,
                company_id: companyId
            },
            order: [['updated_at', 'desc']],
        });
        return pageList;
    }

    //PC端进度详情概况
    async findPlanById(rowId){
        const result = await this.ctx.model.XPlans.findOne({where: {id: rowId}});
        return result;
    }

    //PC端进度详情合同状态
    async findContractStatusById(rowId){
        const result = await this.ctx.model.XPlanSchedule.findAll(
            {
                where: {id: rowId},
                order: [['updated_at', 'desc']]
            },
        );
        return result;
    }

    /**
     * PC端进度详情回款
     */
    async findPayStatusById(rowId){
        const result = await this.ctx.model.XPlanPay.findAll(
            {
                where: {id: rowId},
                order: [['updated_at', 'desc']]
            },
        );
        return result;
    }
}



module.exports = CustomerDataPcService;