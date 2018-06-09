'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const FileType = require('../const/FileType');
const md5 = require('md5');

// 时间工具插件;
var moment = require('moment');

class DetailSettingPCService extends Service {
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

        if (!searchvalue) {
            searchvalue = '';
        }
        searchvalue = '%' + searchvalue + '%';

        let tjzqStartDate = datevalue[0]+' '+'00:00:00';
        let tjzqEndDateDate = datevalue[1]+' '+'23:59:59';
        // if(tjzqvalue==='当日'){
        //     tjzqStartDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+'00:00:00';
        //     tjzqEndDateDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+'23:59:59';
        // }
        // if(tjzqvalue==='昨日'){
        //     let yesterday = new Date(date.getTime()-1000*60*60*24);
        //     tjzqStartDate = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1)+'-'+(yesterday.getDate()-1)+' '+'00:00:00';
        //     tjzqEndDateDate = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1)+'-'+(yesterday.getDate()-1)+' '+'23:59:59';
        // }
        // if(tjzqvalue==='本周'){
        //     let monday;
        //     if(date.getDay()>1){
        //         monday = new Date(date.getTime()-1000*60*60*24*(date.getDay()-1));
        //     }else {
        //         monday = new Date(date.getTime()-1000*60*60*24*6);
        //     }
        //     tjzqStartDate = monday.getFullYear()+'-'+(monday.getMonth()+1)+'-'+(monday.getDate()-1)+' '+'00:00:00';
        // }
        // if(tjzqvalue==='上周'){
        //     let lastMonday;
        //     let lastSunday;
        //     let monday;
        //     if(date.getDay()>1){
        //         monday = new Date(date.getTime()-1000*60*60*24*(date.getDay()-1));
        //     }else {
        //         monday = new Date(date.getTime()-1000*60*60*24*6);
        //     }
        //     lastMonday = new Date(monday.getTime()-1000*60*60*24*7)
        //     lastSunday = new Date(monday.getTime()-1000*60*60*24)
        //     tjzqStartDate = lastMonday.getFullYear()+'-'+(lastMonday.getMonth()+1)+'-'+(lastMonday.getDate()-1)+' '+'00:00:00';
        //     tjzqEndDateDate = lastSunday.getFullYear()+'-'+(lastSunday.getMonth()+1)+'-'+(lastSunday.getDate()-1)+' '+'23:59:59';
        // }
        // if(tjzqvalue==='本月'){
        //     tjzqStartDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+'01'+' '+'00:00:00';
        //     let newDate = new Date(date.getFullYear(),date.getMonth()+1,1);
        //     let lastOneDate = new Date(newDate.getTime()-1000*60*60*24);
        //     tjzqStartDate = lastOneDate.getFullYear()+'-'+(lastOneDate.getMonth()+1)+'-'+lastOneDate.getDate()+' '+'23:59:59';
        // }
        // if(tjzqvalue==='上月'){
        //     tjzqStartDate = date.getFullYear()+'-'+date.getMonth()+'-'+'01'+' '+'00:00:00';
        //     let newDate = new Date(date.getFullYear(),date.getMonth(),1);
        //     let lastOneDate = new Date(newDate.getTime()-1000*60*60*24);
        //     tjzqEndDateDate = lastOneDate.getFullYear()+'-'+(lastOneDate.getMonth()+1)+'-'+lastOneDate.getDate()+' '+'23:59:59';
        // }
        // if(tjzqvalue==='本年'){
        //     tjzqStartDate = date.getFullYear()+'-'+'01-01'+' '+'00:00:00';
        //     tjzqEndDateDate = (date.getFullYear()+1)+'-'+'12-31'+' '+'23:59:59';
        // }
        // if(datevalue){
        //     tjzqStartDate = datevalue[0]+' '+'00:00:00';
        //     tjzqEndDateDate = datevalue[1]+' '+'23:59:59';
        // }

        // 计算当前条数
        const start = (page.pageNumber - 1) * page.pageSize;

        const user = await this.ctx.model.XUsers.findOne({
            where: {
                openid: params.openId
            }
        })
        // 获取所有可管理的团队
        let managerTeams = []

        const teamUsers = await this.ctx.model.XTeamUser.findAll({
            attributes: ['team_id','team_company_id','team_level'],
            where: {
                open_id: params.openId,
                user_rank:FileType.UserRank.admin
            }
        })

        for(let tu of teamUsers){
            if(managerTeams.indexOf(tu.dataValues.team_id) === -1 ){
                managerTeams.push(tu.dataValues.team_id)
            }
            let ids = await  this.ctx.model.XTeam.findAll({
                attributes: ['id'],
                where: {
                    company_id: tu.team_company_id,
                    level: {[Op.gt]: tu.team_level},
                }

            })
            for(let id of ids){
                if(managerTeams.indexOf(id.dataValues.id) === -1 ){
                    managerTeams.push(id.dataValues.id)
                }
            }
        }

        params.managerTeams = managerTeams;

        // 开始分页查询
        const pageList = await this.ctx.model.XPlans.findAll({
            offset: start,
            limit: page.pageSize,
            where: {
                [Op.or]: [{
                    team_id: {
                        [Op.in]: params.managerTeams
                    },
                }, {
                    open_id: params.openId,
                },],
                [Op.and]: {
                    [Op.or]: [{
                        cst_name: {
                            [Op.like]: searchvalue,
                        },
                    }, {
                        cst_address: {
                            [Op.like]: searchvalue,
                        },
                    },{
                        created_at:{
                            [Op.gte]: tjzqStartDate,
                            [Op.lte]: tjzqEndDateDate,
                        }
                    }, {
                        scd_name: contractvalue,
                    }
                    ]
                },
                company_id: user.company_id
            },
            order: [['updated_at', 'desc']],
        });
        return pageList;
    }

    //PC端进度详情概况
    async findPlanById(rowId){
        let  result = await this.ctx.model.XPlans.findOne({where: {id: rowId}});

        // 获取用户信息
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



module.exports = DetailSettingPCService;