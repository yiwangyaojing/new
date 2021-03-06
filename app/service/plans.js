'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const FileType = require('../const/FileType');
const md5 = require('md5');
const moment = require('moment')

class PlansService extends Service {

    // 分页查询方案基本信息
    async findByPage(params) {
        console.log('输出当前分页查询')
        console.log(params)
        const Op = Sequelize.Op;
        const page = {};
        let team_id = params.team_id;
        let user_openid = params.user_openid;
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

        let  userRank = FileType.UserRank.other // 用户角色
        let managerTeams = []         // 团队查询参数
        let agentTeams = [] // 业务员团队

        //管理员获取所有管理的团队
        if (user.company_id) {
            let result = await  this.service.teamUser.findManagerTeams(user.company_id, params.openId)
            console.log(result)
            managerTeams = result.managerTeamIds

            if(managerTeams && managerTeams.length > 0){
                userRank = FileType.UserRank.admin
                if( team_id && team_id.length > 0 ){
                    managerTeams = team_id
                }
                console.log('管理员：',userRank,managerTeams)
            }

            agentTeams  = await  this.service.teamUser.findAgentTeams(user.company_id, params.openId)
            console.log(agentTeams)
            if(managerTeams.length === 0 && agentTeams.length !== 0 ){
                userRank = FileType.UserRank.agent
                console.log('业务员：',userRank)
            }

        }

        console.log('输出当前查询的成员 id', user_openid)


        let Queryparams = {}
        // 生成查询参数
        if(userRank === 1){ //管理员
            if (params.user_openid && params.user_openid !== 'all') {
                Queryparams = {
                    [Op.or]: [
                        {team_id:managerTeams,open_id:user_openid},
                        {open_id: params.openId,team_id:agentTeams},
                        {open_id:params.openId,company_id:null}
                        ],
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
                }
            }else{
                Queryparams = {
                    [Op.or]: [
                        {
                            team_id:managerTeams,
                        },

                        {
                            open_id: params.openId,
                            team_id:agentTeams
                        },{
                            open_id:params.openId,
                            company_id:null
                        }],
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
                }
            }
        }else if(userRank === 2) {
            Queryparams = {
                [Op.or]: [
                    {
                        open_id: params.openId,
                        team_id:agentTeams
                    },{
                        open_id: params.openId,
                        company_id: null
                    }],
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
            }

        }else {
            Queryparams = {
                [Op.and]:[{
                  open_id: params.openId,
                },{
                  company_id: null,
                }],
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
            where: Queryparams,
            order: [['updated_at', 'desc']],
        });

        // sampleClient start
        // 如果page.pageNumber == 1,则将示例客户添加到其他客户的最前，此次返回16条数据，原本返回15条
        if (parseInt(page.pageNumber) === 1) {
            console.log('显示示例客户')
            // 查看用户是否删除了示例客户
            const userInfo = await this.ctx.model.XUsers.findOne({
                limit: 1,
                where: {
                    openid: params.openId,
                }
            });
            if(userInfo.showSampleClient === 1){
                // 通过固定id获取sampleClient
                const sampleClient = await this.ctx.model.XPlans.findOne({
                    limit: 1,
                    where: {
                        id: FileType.sampleClientId,
                    }
                });
                // 将示例客户添加到其他客户最前
                if(sampleClient){
                    pageList.unshift(sampleClient);
                }
            }
        }
        // sampleClient end
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
            // if( page.dataValues && page.dataValues. )
            page.dataValues.houseImg = houseImg;

            const team = await this.ctx.model.XTeam.findOne({where:{id:page.team_id}})
            if( team && team.dataValues && team.dataValues.name){
                page.dataValues.company_name = team.dataValues.name;
            }
        }
        return pageList;
    }
    // 获取公司信息
    async getTeam(id){
        let teamInfo = await this.ctx.model.XTeam.findOne({where:{id:id}})
        if( teamInfo && teamInfo.dataValues ){
            let obj = {
                id:teamInfo.dataValues.id,
                name:teamInfo.dataValues.name,
                level:teamInfo.dataValues.level
            }
            return obj
        }else{
            return null
        }
    }
    // 创建方案基本信息
    async basicCreate(XPlansModel) {

        XPlansModel.scd_status = FileType.schedule.xzxm,
        XPlansModel.scd_name = FileType.scheduleName[FileType.schedule.xzxm]
        XPlansModel.scd_time = new Date()
        XPlansModel.scd_status_all = '0'
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
        if (detail.zj_price && !plan.zj_price) {
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

    // luchen 用户删除示例客户 start
    async updateSampleClient(userOpenId) {
        return await this.ctx.model.XUsers.update({ showSampleClient: 0 }, { where: { openid: userOpenId } });
    }
    // luchen 用户删除示例客户 end

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


        let  userRank = FileType.UserRank.other // 用户角色
        let managerTeams = []         // 团队查询参数
        let agentTeams = [] // 业务员团队
        //管理员获取所有管理的团队
        if (user.company_id) {
            let result = await  this.service.teamUser.findManagerTeams(user.company_id, openId)
            managerTeams = result.managerTeamIds

            if(managerTeams && managerTeams.length > 0){
                userRank = FileType.UserRank.admin
                console.log('管理员：',userRank)
            }

            agentTeams  = await  this.service.teamUser.findAgentTeams(user.company_id,openId)

            if(managerTeams.length === 0 && agentTeams.length !== 0 ){
                userRank = FileType.UserRank.agent
                console.log('业务员：',userRank)
            }

        }

        let Queryparams = {}
        // 生成查询参数
        if(userRank === 1){ //管理员
            Queryparams = {
                [Op.or]: [
                    {
                        team_id:managerTeams
                    },

                    {
                        open_id: openId,
                        team_id: agentTeams
                    },{
                        open_id:openId,
                        company_id:null
                    }],
            }
        }else if(userRank === 2) {
            Queryparams = {
                [Op.or]: [
                    {
                        open_id: openId,
                        team_id: agentTeams
                    },{
                        open_id: openId,
                        company_id: null
                    }],
            }

        }else {
            Queryparams = {
                open_id: openId,
                company_id: null,
            }
        }
        // 根据用户的openid 和 companyid 获取所有可管理的团队
        const plans = await this.ctx.model.XPlans.findAll({
            where: Queryparams
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

    async clearInfo(pageList){

        let all = []
        const Op = Sequelize.Op
        for( let i in pageList ){
            if( !pageList[i] || !pageList[i].dataValues || !pageList[i].dataValues.scd_status_all || !pageList[i].dataValues.id ){
                continue
            }
            let planId = pageList[i].dataValues.id
            let statusAll = [];
            //如果当前的状态长度为1,则代表只有一个状态
            if( String(pageList[i].dataValues.scd_status_all).length == 1 ){
                statusAll.push(pageList[i].dataValues.scd_status_all)
            }else{
                //如果在多状态的情况下
                let str = pageList[i].dataValues.scd_status_all
                //出现项目终止的状态,则跳过这个项目
                if( str.indexOf('9') > -1 ){
                    continue
                }
                //如果有1状态出现,则把0状态取消;
                if( str.indexOf('1') > -1 ){
                    console.log('有1')
                    str = str.replace("0,","")
                    console.log(str)
                }
                statusAll = str.split(",")
            }

            let planAll = await this.ctx.model.XPlanSchedule.findAll({
                where: {
                    plan_id: planId,
                    scd_status: {
                        [Op.or]: statusAll
                    }
                },
                order:[[Sequelize.literal("scd_time DESC")]],
                group:'scd_status'

            })
            //当回款完成时;未回款金额为0时
            if( (pageList[i].dataValues.pay_gap == '0' || pageList[i].dataValues.pay_gap == 0) && (pageList[i].dataValues.pay_sum && pageList[i].dataValues.pay_sum !== 0) ){
                console.log('回款完成!!')
                let date = ''
                let minPlan = await this.ctx.model.XPlanPay.findOne({where:{plan_id:planId,pay_gap:0},order:[[Sequelize.literal("created_at DESC")]]})
                if (!minPlan){
                    date = moment(pageList[i].dataValues.pay_time).format('YYYY-MM-DD');
                }else{
                    date = moment(minPlan.dataValues.created_at).format('YYYY-MM-DD');
                }

                let hkwc = {};
                hkwc['dataValues'] = {
                    // 总价
                    'zj_price': pageList[i].dataValues.zj_price,
                    // 装机容量
                    'zj_capacity': pageList[i].dataValues.zj_input_capacity || pageList[i].dataValues.zj_capacity,
                    // 状态
                    'scd_status': 6,
                    // 客户姓名
                    'cst_name': pageList[i].dataValues.cst_name,
                    // 负责人id
                    'open_id': pageList[i].dataValues.open_id,
                    // 当前项目的 id
                    'id': pageList[i].dataValues.id,
                    // 项目创建时间
                    'scd_time': date
                }
                all.push(hkwc)
            }
            for( let p in planAll ){
                if( planAll[p] && planAll[p].dataValues && planAll[p].dataValues.scd_time ){
                    let min = {};
                    min['dataValues'] = {
                        // 总价
                        'zj_price': pageList[i].dataValues.zj_price,
                        // 装机容量
                        'zj_capacity': pageList[i].dataValues.zj_input_capacity || pageList[i].dataValues.zj_capacity,
                        // 状态
                        'scd_status': planAll[p].dataValues.scd_status,
                        // 客户姓名
                        'cst_name': pageList[i].dataValues.cst_name,
                        // 负责人id
                        'open_id': pageList[i].dataValues.open_id,
                        // 当前项目的 id
                        'id': pageList[i].dataValues.id,
                        // 项目状态创建时间
                        'scd_time': planAll[p].dataValues.scd_time
                    }
                    all.push(min);
                }
            }

        }
        return all
    }
    async clearInfoTwo(pageList){
        moment().format();
        let all = []
        const Op = Sequelize.Op
        for( let i in pageList ){
            if( !pageList[i] || !pageList[i].dataValues || !pageList[i].dataValues.scd_status_all || !pageList[i].dataValues.id ){
                continue
            }
            let planId = pageList[i].dataValues.id
            let statusAll = [];
            //如果当前的状态长度为1,则代表只有一个状态
            if( String(pageList[i].dataValues.scd_status_all).length == 1 ){
                statusAll.push(pageList[i].dataValues.scd_status_all)
            }else{
                //如果在多状态的情况下
                let str = pageList[i].dataValues.scd_status_all
                //出现项目终止的状态,则跳过这个项目
                if( str.indexOf('9') > -1 ){
                    continue
                }
                //如果有1状态出现,则把0状态取消;
                if( str.indexOf('1') > -1 ){
                    console.log('有1')
                    str = str.replace("0,","")
                    console.log(str)
                }
                statusAll = str.split(",")
            }

            let planAll = await this.ctx.model.XPlanSchedule.findAll({
                where: {
                    plan_id: planId,
                    scd_status: {
                        [Op.or]: statusAll
                    }
                },
                order:[[Sequelize.literal("scd_time DESC")]],
                group:'scd_status'

            })
            //当回款完成时;未回款金额为0时
            let user = await this.ctx.model.XUsers.findOne({
                where: {
                    openid: pageList[i].dataValues.open_id
                }
            })
            if( (pageList[i].dataValues.pay_gap == '0' || pageList[i].dataValues.pay_gap == 0) && (pageList[i].dataValues.pay_sum && pageList[i].dataValues.pay_sum !== 0)  ){
                let hkwc = {};
                let date = ''
                let minPlan = await this.ctx.model.XPlanPay.findOne({where:{plan_id:planId,pay_gap:0},order:[[Sequelize.literal("created_at DESC")]]})
                if (!minPlan){
                    date = moment(pageList[i].dataValues.pay_time).format('YYYY-MM-DD');
                }else{
                    date = moment(minPlan.dataValues.created_at).format('YYYY-MM-DD');
                }
                hkwc = {
                    // 总价
                    'zj_price': pageList[i].dataValues.zj_price || 0,
                    // 装机容量
                    'zj_capacity': pageList[i].dataValues.zj_input_capacity || pageList[i].dataValues.zj_capacity,
                    // 状态
                    'scd_status': 6,
                    // 状态名称
                    'scd_name': '回款完成',
                    // 客户姓名
                    'cst_name': pageList[i].dataValues.cst_name,
                    // 负责人id
                    'open_id': pageList[i].dataValues.open_id,
                    // 负责人姓名
                    'user_name': user.name,
                    // 当前项目的 id
                    'id': pageList[i].dataValues.id,
                    // 当前项目的 所属公司
                    'team_id': pageList[i].dataValues.team_id,
                    // 项目创建时间
                    'scd_time': date,
                    //  地址
                    'cst_address': pageList[i].dataValues.cst_address,
                    //  回款金额
                    'pay_sum': pageList[i].dataValues.pay_sum
                }
                all.push(hkwc)
            }
            for( let p in planAll ){
                if( planAll[p] && planAll[p].dataValues && planAll[p].dataValues.scd_time ){
                    let min = {};
                    min = {
                        // 总价
                        'zj_price': pageList[i].dataValues.zj_price || 0,
                        // 装机容量
                        'zj_capacity': pageList[i].dataValues.zj_input_capacity || pageList[i].dataValues.zj_capacity,
                        // 状态
                        'scd_status': planAll[p].dataValues.scd_status,
                        // 状态名称
                        'scd_name': planAll[p].dataValues.scd_name || '',
                        // 客户姓名
                        'cst_name': pageList[i].dataValues.cst_name,
                        // 负责人姓名
                        'user_name': user.name,
                        // 当前项目的 所属公司
                        'team_id': pageList[i].dataValues.team_id,
                        // 负责人id
                        'open_id': pageList[i].dataValues.open_id,
                        // 当前项目的 id
                        'id': pageList[i].dataValues.id,
                        // 项目创建时间
                        'scd_time': moment(planAll[p].dataValues.scd_time).format('YYYY-MM-DD'),
                        //  地址
                        'cst_address': pageList[i].dataValues.cst_address,
                        //  回款金额
                        'pay_sum': pageList[i].dataValues.pay_sum
                    }
                    all.push(min);
                }
            }

        }
        return all
    }
    //获取公司内的项目历史
    async getTeamProject(info,openId){
        const Op = Sequelize.Op
        let companyId = info.companyId
        let teams = info.arr
        if( !companyId || !teams || !openId ){
            return {}
        }
        if( teams.length == 0 ){
            const user = await this.ctx.model.XUsers.findOne({
                where: {
                    openid: openId
                }
            })
            let result = await this.service.teamUser.findManagerTeams(user.company_id, openId)
            teams = result.managerTeamIds
        }
        let Queryparams = {[Op.or]: [{team_id:teams}]}
        //1,找到所有的公司团队下的项目
        //2,遍历所有项目查看他们的状态记录
        //3,通过他们的状态记录查看历史状态,并提取出历史时间.以时间来排序
        const pageList = await this.ctx.model.XPlans.findAll({
            where: Queryparams,
        });

        let all = await this.ctx.service.plans.clearInfo(pageList)
        all = await this.ctx.service.user.getProjectInfo('',all)
        return all
    }

    //获取单个业务员的历史信息
    async getSalesmanProject(info){
        let oepnId = info.openId
        if( !oepnId ){
            return {}
        }
        let user = await this.ctx.model.XUsers.findOne({where:{openid:oepnId}})
        let companyId = user.dataValues.company_id
        let plans = await this.ctx.model.XPlans.findAll({where:{open_id:oepnId,company_id:companyId}})

        let all = await this.ctx.service.plans.clearInfo(plans)
        all = await this.ctx.service.user.getProjectInfo('',all)

        return all
    }
     // 客户在用户间转移
    async changePlanOwner(params) {
    const customerId = params.customerId;
    const openId = params.openId;
    const newUserName = params.userName;
    const newTeamId = params.teamId;
    const operatorName = params.operatorName;
    // 获取客户数据
    const planInfo = await this.ctx.model.XPlans.findOne({ where: { id: customerId } });
    // 原始用户，团队信息
    const oldUserName = planInfo.user_name;
    // const oldTeamId = planInfo.team_id;

    // 插入项目状态
    let planScheduleObj = {};
    planScheduleObj.open_id = openId;
    planScheduleObj.plan_id = customerId;
    planScheduleObj.scd_status = FileType.schedule.xmzy;
    planScheduleObj.scd_name = '项目负责人由 '+ oldUserName +' 变更为 ' + newUserName;
    planScheduleObj.scd_remark = operatorName;
    planScheduleObj.scd_time = new Date();
    const planScheduleResult = await this.ctx.model.XPlanSchedule.create(planScheduleObj);
    // 修改用户表
    const planResult = await this.ctx.model.XPlans.update({
        open_id: openId,
        user_name: newUserName,
        team_id: newTeamId,
    }, {
            where: {
                id: customerId
            }
        }
    )

    return planResult
}
    //  小程序获取逾期
    async getoverdue(req){
        const ctx = this.ctx
        const Op = Sequelize.Op

        const dateNow = moment().format("YYYY-MM-DD")

        const scdList = [FileType.schedule.htqd, FileType.schedule.sgwc, FileType.schedule.bwwc]

        let result = {}

        const user = await ctx.model.XUsers.findOne({
            where: {
                openid: req.open_id
            }
        })

        if( req.open_id && !req.arr ){
            console.log("查询单个业务员",req.open_id)
            let teamIds = []
            // 获取个人所在团队
            if(user.company_id){
                const teams = await  this.ctx.model.XTeamUser.findAll({where:{open_id:req.open_id}})
                for(let team of teams){
                    if(teamIds.indexOf(team.team_id) ===-1){
                        teamIds.push(team.team_id)
                    }
                }
            }
            result = await ctx.model.XPlans.findAll(
                {
                    attributes: ['id', 'open_id', 'cst_name', 'user_name', 'scd_status', 'zj_capacity', 'zj_price', 'zj_input_capacity', 'scd_time'],
                    where: {
                        [Op.or]:[
                            {open_id: req.open_id, team_id:teamIds},
                            {open_id: req.open_id, company_id: null},
                        ],
                        overdue_date: {[Op.lte]: dateNow},
                        scd_status: {[Op.in]: scdList},

                    }
                }
            )
        }

        if( req.open_id && req.arr ){
            console.log("查询团队")
            // 查询公司所有团队
            let team = await this.service.teamUser.findManagerTeams(user.company_id, req.open_id)
            // 遍历下级直系团队
            let teams = []

            if( req.arr.length === 0 ){
                teams = team.managerTeamIds
            }else{
                teams = req.arr
            }

            result = await ctx.model.XPlans.findAll(
                {
                    attributes: ['id', 'open_id', 'cst_name', 'user_name', 'scd_status', 'zj_capacity', 'zj_price' ,'zj_input_capacity', 'scd_time'],
                    where: {
                        team_id: {[Op.in]: teams},
                        company_id: user.company_id,
                        overdue_date: {[Op.lte]: dateNow},
                        scd_status: {[Op.in]: scdList}
                    }
                }
            )
        }

        return result
    }
    //   pc 版获取逾期
    async getoverduePc(req){
        const ctx = this.ctx
        const Op = Sequelize.Op

        const dateNow = moment().format("YYYY-MM-DD")

        const scdList = [FileType.schedule.htqd, FileType.schedule.sgwc, FileType.schedule.bwwc]

        let result = {}

        const user = await ctx.model.XUsers.findOne({
            where: {
                openid: req.open_id
            }
        })

        if( req.open_id && !req.arr ){
            console.log("查询单个业务员",req.open_id)
            let teamIds = []
            // 获取个人所在团队
            if(user.company_id){
                const teams = await  this.ctx.model.XTeamUser.findAll({where:{open_id:req.open_id}})
                for(let team of teams){
                    if(teamIds.indexOf(team.team_id) ===-1){
                        teamIds.push(team.team_id)
                    }
                }
            }
            result = await ctx.model.XPlans.findAll(
                {
                    attributes: ['id', 'open_id', 'cst_name',
                        'user_name', 'scd_status', 'zj_capacity',
                        'zj_price', 'zj_input_capacity', 'scd_time',
                        'overdue_date', 'team_id',
                        'cst_address','user_name','pay_sum','scd_name'
                    ],
                    where: {
                        [Op.or]:[
                            {open_id: req.open_id, team_id:teamIds},
                            {open_id: req.open_id, company_id: null},
                        ],
                        overdue_date: {[Op.lte]: dateNow},
                        scd_status: {[Op.in]: scdList},

                    }
                }
            )
        }

        if( req.open_id && req.arr ){
            console.log("查询团队")
            // 查询公司所有团队
            let team = await this.service.teamUser.findManagerTeams(user.company_id, req.open_id)
            // 遍历下级直系团队
            let teams = []

            if( req.arr.length === 0 ){
                teams = team.managerTeamIds
            }else{
                teams = req.arr
            }

            result = await ctx.model.XPlans.findAll(
                {
                    attributes: ['id', 'open_id', 'cst_name',
                        'user_name', 'scd_status', 'zj_capacity',
                        'zj_price', 'zj_input_capacity', 'scd_time',
                        'overdue_date', 'team_id',
                        'scd_name','cst_address','user_name','pay_sum'
                    ],
                    where: {
                        team_id: {[Op.in]: teams},
                        company_id: user.company_id,
                        overdue_date: {[Op.lte]: dateNow},
                        scd_status: {[Op.in]: scdList}
                    }
                }
            )
        }

        console.log(result)
        return result
    }

    //  pc 获取团队项目历史信息
    async getAllPlans(teamId){
        if (!teamId || teamId.length == 0){
            return []
        }

        const Op = Sequelize.Op
        let Queryparams = {[Op.or]: [{team_id:teamId}]}
        const pageList = await this.ctx.model.XPlans.findAll({
            where: Queryparams,
        });

        let all = await this.ctx.service.plans.clearInfoTwo(pageList)
        return all

    }

    //  pc 版获取单个业务员项目历史信息
    async getUserPlans(oepnId) {
        if(!oepnId){
            return []
        }
        let user = await this.ctx.model.XUsers.findOne({where:{openid:oepnId}})
        let companyId = user.dataValues.company_id
        let plans = await this.ctx.model.XPlans.findAll({where:{open_id:oepnId,company_id:companyId}})
        let all = await this.ctx.service.plans.clearInfoTwo(plans)
        return all
    }
}

module.exports = PlansService;
