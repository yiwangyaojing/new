'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const FileType = require('../const/FileType');
const md5 = require('md5');

class PlansService extends Service {

    // 分页查询方案基本信息
    async findByPage(params) {
        const Op = Sequelize.Op;
        const page = {};
        // 设置默认值
        page.pageNumber = params.pageNumber || 1;
        page.pageSize = 15;

        let search = params.search;
        if (!search) {
            search = '';
        }
        search = '%' + search + '%';

        // 计算当前条数
        const start = (page.pageNumber - 1) * page.pageSize;

        const user = await this.ctx.model.XUsers.findOne({
            where: {
                openid: params.openId
            }
        })
        // 获取所有可管理的团队
        let managerTeams = []

        if (user.company_id) {
            let result = await  this.service.teamUser.findManagerTeams(user.company_id, params.openId)
            managerTeams = result.managerTeamIds
        }

        /* const teamUsers = await this.ctx.model.XTeamUser.findAll({
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
*/
        params.managerTeams = managerTeams

        /*   if(params.managerTeamId && params.managerTeamLevel){
               params.managerTeams = await this.ctx.model.XTeamUser.findAll({
                   attributes: ['id'],
                   where: {
                       company_id: params.company_id,
                       level: {[Op.gt]: params.managerTeamLevel},
                       [Op.or]:[{
                           id:params.managerTeamId
                       }]
                   }
               })
           }*/


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
                            [Op.like]: search,
                        },
                    }, {
                        cst_address: {
                            [Op.like]: search,
                        },
                    },
                    ]
                }
            },
            order: [['updated_at', 'desc']],
        });
        // 获取方案拍房子图片
        for (const page of pageList) {
            let houseImg = '';
            if (page.h_is_finish === 1) {
                // 查询xfiles表获取拍房子第一张图片
                const xfile = await this.ctx.model.XFiles.findOne({
                    where: {
                        plan_id: page.id,
                        source_type: FileType.HouseImg,
                        data_type: FileType.HouseImg_h,
                    },
                    order: [
                        ['plan_id', 'ASC'],
                    ],
                });
                if (xfile) {
                    houseImg = xfile.url;
                }
            }
            page.dataValues.houseImg = houseImg;
        }
        return pageList;
    }

    // 创建方案基本信息
    async basicCreate(XPlansModel) {

        XPlansModel.scd_status = FileType.schedule.xzxm,
            XPlansModel.scd_name = FileType.scheduleName[FileType.schedule.xzxm]

        console.log(XPlansModel);
        const result = await this.ctx.model.XPlans.create(XPlansModel);

        if (result) {
            const shortUrl = await this.shortUrl(result.id);
            await this.ctx.model.XPlans.update({short_url: shortUrl}, {where: {id: result.id}});
            // 保存合同签订状态
            const schedule = {
                plan_id: result.id,
                open_id: result.open_id,
                scd_status: FileType.schedule.xzxm,
                scd_name: FileType.scheduleName[FileType.schedule.xzxm],
                scd_time: new Date()
            }
            await this.ctx.model.XPlanSchedule.create(schedule)
        }

        return result;
    }

    // 创建方案详细信息
    async create(detail) {
        // 根据id 查询方案基本信息是否存在
        const plan = await this.ctx.model.XPlans.find({
            where: {
                id: detail.id,
            },
        });
        if (plan === null) {
            throw new Error('用户基本信息不存在!');
        }
        // 创建方案基本信息
        if (detail.zj_price) {
            detail.pay_gap = detail.zj_price
        }

        if( plan.pay_sum &&  plan.zj_price !== detail.zj_price){
            detail.pay_gap = detail.zj_price  - plan.pay_sum
        }
        console.log(detail)

        const result = await this.ctx.model.XPlans.update(detail, {
            where: {
                id: detail.id,
            },
        });
        // // 判断总价是否影响回款金额
        // if (result > 0 && detail.zj_price > 0) {
        //     // 获取planPay
        //     const planPay = await this.ctx.model.XPlanPay.findAll({where: {open_id: plan.open_id, plan_id: plan.id}})
        //     if (planPay) {
        //         if (plan.zj_price - detail.zj_price !== 0) {
        //
        //             let differ = plan.zj_price - detail.zj_price  // 与原来的差价
        //             console.log(differ)
        //             for (let pay of planPay) {
        //                 let data = {
        //                     zj_price: detail.zj_price,
        //                     pay_gap: pay.pay_gap + differ
        //                 }
        //                 await this.ctx.model.XPlanPay.update(data, {where: {id: pay.id}})
        //             }
        //         }
        //     }
        // }
        return result;
    }

    // 删除方案信息
    async destroy(rowId) {
        const XPlans = await this.ctx.model.XPlans.find({
            id: rowId,
        });
        if (XPlans === null) {
            throw new Error('该方案数据不存在！');
        }

        return await this.ctx.model.XPlans.destroy({
            where: {
                id: rowId,
            },
        });
    }

    // 获取详情
    async detail(rowId) {
        const houseImgs = [];
        const dataImgs = [];

        const XPlans = await this.ctx.model.XPlans.findOne({where: {id: rowId}});
        if (XPlans === null) {
            throw new Error('该方案数据不存在！');
        }
        const result = XPlans.dataValues;

        if (result.h_is_finish === 1) {
            // 获取拍房子图片
            const fileHouse = await this.ctx.model.XFiles.findAll({
                limit: 4,
                where: {plan_id: rowId, source_type: FileType.HouseImg},
            });
            if (fileHouse) {
                for (const file of fileHouse) {
                    const imgs = {};
                    imgs.url = file.url;
                    imgs.mini_url = file.mini_url;
                    houseImgs.push(imgs);
                }
                result.houseImgs = houseImgs;
            }

        }
        if (result.d_is_finish === 1) {
            // 获取收资料图片
            const fileData = await this.ctx.model.XFiles.findAll({
                limit: 4,
                where: {plan_id: rowId, source_type: FileType.DataImg},
            });
            if (fileData) {
                for (const file of fileData) {
                    const imgs = {};
                    imgs.url = file.url;
                    imgs.mini_url = file.mini_url;
                    dataImgs.push(imgs);
                }
                result.dataImgs = dataImgs;
            }
        }
        // 排板子图片获取
        if (result.rf_is_finish === 1) {
            const file = await this.ctx.model.XFiles.findOne({where: {plan_id: rowId}});
            if (file) {
                result.rfImage = file.url;
            }
        }

        return result;
    }

    // 更新
    async update(plan) {

        return await this.ctx.model.XPlans.update(plan, {where: {id: plan.id}});
    }

    async findAllByUser(openId) {
        const Op = Sequelize.Op
        const results = [];
        const user = await this.ctx.model.XUsers.findOne({
            where: {
                openid: openId
            }
        })

        // 获取所有可管理的团队
        let managerTeams = []

        if (user.company_id) {
            let result = await  this.service.teamUser.findManagerTeams(user.company_id, openId)
            managerTeams = result.managerTeamIds
        }
        // 根据用户的openid 和 companyid 获取所有可管理的团队
        const plans = await this.ctx.model.XPlans.findAll({
            where: {
                [Op.or]: [{
                    team_id: managerTeams,
                }, {
                    open_id: openId,
                },],
            }
        });


        for (const plan of plans) {
            const result = {};
            result.name = plan.cst_name;
            result.value = plan.id;
            result.h_is_finish = plan.h_is_finish;
            result.d_is_finish = plan.d_is_finish;
            result.rf_is_finish = plan.rf_is_finish;
            result.zj_format = plan.zj_format;
            result.zj_num = plan.zj_num;
            result.zj_capacity = plan.zj_capacity;
            result.zj_price = plan.zj_price;
            result.zj_source = plan.zj_source;
            results.push(result);
        }

        return results;

    }

    async shortUrl(id) {
        const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
            'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5',
            '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z'];

        const md5Key = md5(id);

        // 把加密字符按照 8 位一组 16 进制与 0x3FFFFFFF 进行位与运算
        const sTempSubString = md5Key.substring(8, 16);

        // 这里需要使用 long 型来转换，因为 Inteper .parseInt() 只能处理 31 位 , 首位为符号位 , 如果不用 long ，则会越界
        let lHexLong = 0x3FFFFFFF & parseInt(sTempSubString, 16);

        let outChars = '';
        for (let j = 0; j < 6; j++) {
            // 把得到的值与 0x0000003D 进行位与运算，取得字符数组 chars 索引
            const index = 0x0000003D & lHexLong;
            // 把取得的字符相加
            outChars += chars[index];
            // 每次循环按位右移 5 位
            lHexLong = lHexLong >> 5;
        }

        return outChars;
    }

    // 通过业务员获取项目信息;


}

module.exports = PlansService;
