'use strict';

const Service = require('egg').Service;
const FileType = require('../const/FileType')
const Sequelize = require('sequelize')

// 时间工具插件;
var moment = require('moment');

class UserService extends Service {
    // async findByOpenId(openid) {
    //   const user = await this.ctx.model.XUsers.findOne({ where: { openid } });
    //   return user;
    // }

    async create(user) {
        let result;

        let createUser = Object.assign({}, user)

        createUser.name = user.nickName

        result = await this.findByOpenId(user.openid)

        if (!result) {
            result = await this.ctx.model.XUsers.create(createUser)
        } else {
            await this.ctx.model.XUsers.update(user, {where: {openid: user.openid}});
        }

        // await this.ctx.model.XUsers.findOrCreate({
        //   where: { openid: user.openid },
        //   defaults: createUser,
        // }).spread((model, created) => {
        //   result = model.get({ plain: true });
        //   isCreated = created;
        // });
        // if (isCreated === false) {
        //   await this.ctx.model.XUsers.update(user, { where: { openid: user.openid } });
        //   result = await this.findByOpenId(user.openid)
        // }

        // console.log(result);
        return result;
    }

    async findByOpenId(open_id) {
        let result = await this.ctx.model.XUsers.findOne({where: {openid: open_id}})

        if (result && result.managerTeams) {

            result.dataValues.managerTeams = result.managerTeams

        }
        return result
    }

    async findOrUpdateByOpenId(open_id) {
        const result = await this.ctx.model.XUsers.findOne({where: {openid: open_id}})
        let team
        let user = {}
        if (result) {
            user = result.dataValues;
            team = await this.service.teamUser.findMaxLevel(result.openid, result.company_id)
            if (team) {
                user.maxTeamLevel = team.team_level
                user.maxTeamId = team.team_id
                user.maxTeamRank = team.user_rank
            }

            // 获取所有可管理的团队Id
            /*  let managerTeams = []
              const teamUser = await this.ctx.model.XTeamUser.findOne({
                  where: {
                      open_id: open_id,
                      team_company_id: result.company_id,
                      user_rank: FileType.UserRank.admin
                  }, order: [['team_level', 'asc']]
              })*/
            /*    if (teamUser) {
                    // 获取所有团队
                    // const Op = Sequelize.Op;
                    managerTeams.push(teamUser.team_id)
                   /!* const teams = await  this.ctx.model.XTeam.findAll(
                        {
                            where:
                                {
                                    company_id: result.company_id,
                                    level: {
                                        [Op.gt]: teamUser.team_level
                                    }
                                }
                        })
                    for (let team of teams) {
                        if (managerTeams.indexOf(team.id) === -1) {
                            managerTeams.push(team.id)
                        }
                    }*!/
                }*/
            // user.managerTeams = JSON.stringify(managerTeams)  // 无用字段

            await this.ctx.model.XUsers.update(user, {where: {openid: user.openid}})
        }


        return user
    }

    async updateParams(param, open_id) {
        return await this.ctx.model.XUsers.update(param, {where: {openid: open_id}})
    }


    //通过用户 team_id 获取所有公司及其团队
    async findTeamByOpenId(id) {

        console.log('执行查找团队')
        const team = await this.ctx.model.XTeam.findOne({where: {id: id}});
        if (team) {
            return team.dataValues;
        } else {
            return '';
        }
    }

    async getAllProject(openId) {
        const team = await this.ctx.model.XPlans.findAll({where: {open_id: openId}});
        if (!team) {
            return false;
        }
        // 所有未排序的业务项目
        let arr = [];
        for (var i = 0; i < team.length; i++) {
            arr.push(team[i])
        }
        return arr
    }

    // 业务员的 openid,在这里进行排序;
    async getProjectInfo(openId, type) {
        moment().format();
        var allProject = {
            '今日': [],
            '昨日': [],
            '本周': [],
            '上周': [],
            '本月': [],
            '上月': [],
            '本年': [],
            '累计': []
        };
        // let arr = await this.getAllProject(openId);
        // 今日开始
        var day = moment().startOf("days").format('YYYY-MM-DD HH:mm')
        // 昨日开始
        var sDay = moment().subtract(1, 'days').startOf("days").format('YYYY-MM-DD HH:mm');  //昨日开始的时间
        // 昨日结束
        var sDayEnd = moment().subtract(1, 'days').endOf("days").format('YYYY-MM-DD HH:mm');
        // 本周第一天
        var weekStart = moment().startOf("isoWeek").format("YYYY-MM-DD HH:mm");  //从周一开始的第一天
        // 上周第一天
        var sWeekStart = moment().subtract(1, 'Weeks').startOf("isoWeek").format("YYYY-MM-DD HH:mm")
        // 上周最后一天
        var sWeekEnd = moment().subtract(1, 'Weeks').endOf("isoWeek").format("YYYY-MM-DD HH:mm")
        // 本月第一天
        var yue = moment().startOf("month").format("YYYY-MM-DD HH:mm");
        // 上月第一天
        var sYueStart = moment().subtract(1, 'months').startOf("month").format("YYYY-MM-DD HH:mm");
        // 上月最后一天
        var sYueEnd = moment().subtract(1, 'months').endOf("month").format("YYYY-MM-DD HH:mm");
        // 今年第一天
        var yearStart = moment().startOf("year").format("YYYY-MM-DD HH:mm");

        //转化时间戳
        function time(data) {
            return new Date(data).getTime();
        }

        var data;
        if (type == 'one') {
            data = await this.getAllProject(openId);

        } else {
            data = type;
        }
        if (!data || data.length == 0) {
            console.log(data);
            return {};
        }
        for (var i = 0; i < data.length; i++) {
            // 如果 该项目的状态是未启动,也就是新客户, 那么不需要进行下面的操作;
            if (!data[i].dataValues.scd_status || data[i].dataValues.scd_status == 0) {
                continue;
            }
            // 项目的创建时间
            var date = time(moment(data[i].dataValues.scd_time).format('YYYY-MM-DD HH:mm'));
            date = date - 0 + 1;
            // 筛选重要的信息-精炼数据;
            var minData = {
                // 总价
                'zj_price': data[i].dataValues.zj_price,
                // 装机容量
                'zj_capacity': data[i].dataValues.zj_capacity,
                // 状态
                'scd_status': data[i].dataValues.scd_status,
                // 客户姓名
                'cst_name': data[i].dataValues.cst_name,
                // 负责人姓名
                'duty_name': (await this.ctx.model.XUsers.findOne({where: {openid: data[i].dataValues.open_id}})).dataValues.name,
                // 当前项目的 id
                'id': data[i].dataValues.id
            };
            // console.log('输出本周' + time(weekStart))
            // console.log('输出本周' + weekStart)
            // console.log('当前时间' + time(day))
            console.log('当前时间' + moment(data[i].dataValues.scd_time).format('YYYY-MM-DD HH:mm'))
            // 判断今日
            if (date > time(day) || date == time(day)) {
                allProject['今日'].push(minData);
            }
            // 判断昨日
            if (date > time(sDay) && date < time(sDayEnd)) {
                allProject['昨日'].push(minData);
            }
            // 判断本周
            if (date > time(weekStart) || date == time(weekStart)) {
                allProject['本周'].push(minData);
            }
            // 判断上周
            if (date > time(sWeekStart) && date < time(sWeekEnd)) {
                allProject['上周'].push(minData);
            }
            // 判断本月
            if (date > time(yue)) {
                allProject['本月'].push(minData);
            }
            // 判断上月
            if (date > time(sYueStart) && date < time(sYueEnd)) {
                allProject['上月'].push(minData);
            }
            // 判断本年
            if (date > time(yearStart)) {
                allProject['本年'].push(minData);
            }
            // 累计
            allProject['累计'].push(minData);
        }

        return allProject;
    }

    // 对业务员进行便利循环
    async allUserGetProjectInfo(users) {
        console.log('业务员')
        console.log(users)
        var data = []
        for (var i = 0; i < users.length; i++) {
            var user = await this.getAllProject(users[i]);
            console.log(user.length)
            if (user.length > 0) {
                for (var p = 0; p < user.length; p++) {
                    data.push(user[p])
                }
            }
        }
        ;
        let allInfo = await this.getProjectInfo('', data);
        return allInfo
    }
}

module.exports = UserService;
