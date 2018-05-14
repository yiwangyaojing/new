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



    // 获取详情
    async detail(rowId) {
        const houseImgs = [];
        const dataImgs = [];

        const XPlans = await this.ctx.model.XPlans.findOne({ where: { id: rowId } });
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
}



module.exports = CustomerDataPcService;