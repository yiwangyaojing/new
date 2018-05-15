const Service = require('egg').Service;

const Sequelize = require('sequelize')

const FileType = require('../const/FileType')


class TeamUserService extends Service {

    async index(req) {

        const teamId = req.teamId


        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        const result = await sequelize.query(
            "select tu.*, u.id as user_id, u.name, u.avatarUrl " +
            "from x_team_user tu , x_users u  " +
            "where tu.open_id = u.openid " +
            "and tu.team_id = :teamId ",
            {replacements: {teamId: teamId}, type: Sequelize.QueryTypes.SELECT})

        return result

    }

    async findTeamChildPlan(req){

        let teams = []


        if(req.id){
            // 查询所有团队
            console.log("概况：查询团队以及团队一下。")
            const companyTeams = await this.ctx.model.XTeam.findAll({where: {company_id: req.company_id}})
            teams.push(req.id)
            await this.service.team.linealTeam(companyTeams, req, teams, 'child')
        }else{
            console.log("概况：查询公司本级。")
            teams.push(req.company_id)
        }

        const plans = await this.ctx.model.XPlans.findAll({where:{team_id:teams}})

        let allInfo = await this.service.user.getProjectInfo('', plans);

        return allInfo
    }

    async findTeamUsers(req) {

        const users = []
        const Op = Sequelize.Op
        console.log(req)
        if (req.id) {
            // 查询公司所有团队
            const companyTeams = await this.ctx.model.XTeam.findAll({where: {company_id: req.company_id}})

            // 遍历下级直系团队
            let teams = []
            teams.push(req.id)
            console.log(teams)

            await this.service.team.linealTeam(companyTeams, req, teams, 'child')

            console.log(teams)
            // 查找当前团队以及直系下级所有用户
            const teamUsers = await this.ctx.model.XTeamUser.findAll({
                where: {
                    team_id: {[Op.in]: teams},
                    team_company_id: req.company_id
                }
            })
            for (let u of teamUsers) {
                if (users.indexOf(u.open_id) === -1) {
                    users.push(u.open_id)
                }
            }
        } else {
            // 查找总公司所有业务员
            const teamUsers = await  this.ctx.model.XTeamUser.findAll({where: {team_company_id: req.company_id}})
            for (let u of teamUsers) {
                if (users.indexOf(u.open_id) === -1) users.push(u.open_id)
            }
        }

        console.log(users)
        return users

    }

    async updateRule(req) {

        const ctx = this.ctx

        const users = req.users

        const team = await ctx.model.XTeam.findOne({where: {id: req.team_id}})

        if (!team) {
            throw new Error("团队不存在")
        }

        // 判断权限
        if (!await this.validatePower(team, req.operator)) {
            throw  new Error("权限不足")
        }

        for (let user of users) {
            await ctx.model.XTeamUser.update({user_rank: user.user_rank}, {where: {open_id: user.open_id , team_id:req.team_id}})
        }

    }

    async create(req) {
        const ctx = this.ctx

        const team = await ctx.model.XTeam.findOne({where: {id: req.team_id}})


        if (!team) {
            throw new Error("团队不存在")
        }
        // 判断权限
        if (!await this.validatePower(team, req.operator)) {
            throw  new Error("权限不足")
        }

        // 获取公司
        let company = await this.ctx.model.XTeam.findOne({
            where: {id: team.company_id}
        })

        let agents = req.users  //要添加的业务员
        let openIds = []
        let bulkCreate =[]


        // 获取当前团队所有的用户
        const users = await ctx.model.XTeamUser.findAll({where: {team_id: req.team_id}})

            for(let agent of agents){
               let flag = true
                for(let user of users){
                    if(agent.open_id === user.dataValues.open_id){
                        flag = false
                    }
                }
                if(flag){
                    openIds.push(agent)
                }
            }
            console.log(agents)
        for(let openId of openIds){
            let agent = {}
            agent.open_id = openId
            agent.team_parent_id = team.parent_id
            agent.team_company_id = team.company_id
            agent.team_level = team.level
            agent.user_rank = req.user_rank
            agent.team_id= req.team_id
            await ctx.model.XUsers.update({
                company_id:   company.id,
                company_name: company.name,
                company_logo: company.logo,
                company_founder:company.open_id,
            }, {where: {openid: agent.open_id}});
            bulkCreate.push(agent)
        }

        return await  ctx.model.XTeamUser.bulkCreate(bulkCreate);
    }

    async destroy(req) {

        const ctx = this.ctx

        const team = await ctx.model.XTeam.findOne({where: {id: req.team_id}})

        if (!team) {
            throw new Error("团队不存在")
        }

        // 判断权限
        if (!await this.validatePower(team, req.operator)) {
            throw  new Error("权限不足")
        }

        return await ctx.model.XTeamUser.destroy({where: {team_id: req.team_id, open_id: req.open_id}})
    }

    // 从公司删除
    async deleteFromCompany(openid) {
        const ctx = this.ctx
        await ctx.model.XTeamUser.destroy({where: {open_id: openid}})
        return await ctx.model.XUsers.update({
            company_id: null,
            company_name: null,
            company_founder:null,
            company_logo: null,
            maxTeamLevel: null,
            maxTeamId: null,
            maxTeamRank: null,
            managerTeams: '[]'
        }, {
            where: {
                openid: openid
            }
        })
    }

    async validatePower(team, open_id) {

        let teamLevel = team.level
        const teamUser = await  this.ctx.model.XTeamUser.findOne({
            where: {open_id: open_id, user_rank: FileType.UserRank.admin},
            order: [['team_level', "ASC"]]
        })
        if (!teamUser || teamUser.team_level > teamLevel) {
            return false;
        }

        return true

    }

    // 获取用户想详情
    async teamInfo(open_id, company_id) {

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        const result = await sequelize.query(
            "select xt.* , xtu.user_rank  from x_team_user xtu, x_team xt " +
            "where xtu.team_id = xt.id " +
            "and xtu.open_id =:open_id " +
            "and xt.company_id =:company_id ",
            {replacements: {open_id: open_id, company_id: company_id}, type: Sequelize.QueryTypes.SELECT})

        return result

    }

    async delUser(open_id) {

        return await this.ctx.modle.XTeamUser.destroy({where: {open_id: open_id}})

    }

    /**
     * 获取用户的最高团队等级
     */
    async findMaxLevel(open_id, company_id) {
        return await this.ctx.model.XTeamUser.findOne({
            where: {open_id: open_id, team_company_id: company_id},
            limit: 1,
            order: [['team_level', 'asc']]
        })

    }

    /**
     * 根据用户获取 用户团队信息team_
     */
    async teamManagerInit(req) {


        const ctx = this.ctx

        const result = {}

        const teamParent = []
        const teamChild = []


        const teamUser = await ctx.model.XTeamUser.findOne({
            where: {
                team_company_id: req.company_id,
                team_id: req.team_id,
                open_id: req.open_id
            }
        })

        //  result.user_rank 0，上级包括上上的管理员  1，本级团队管理员 ，2.业务员
        if (req.max_level > req.team_level) {  // 如果最高团队低于当前团队，在当前团队统一为业务员权限

            result.user_rank = FileType.UserRank.agent

        } else if (req.max_level === req.team_level) {  // 如果进入的是本级团队，判断是否为创始人
            let team = await ctx.model.XTeam.findOne({where: {id: req.team_id, open_id: req.open_id}})
            if (team) {
                result.user_rank = 0
            } else {
                if (teamUser) {
                    result.user_rank = teamUser.user_rank
                } else {
                    result.user_rank = FileType.UserRank.agent
                }
            }
        } else {
            // 如果进入的是下级团队 ，先判断在上级是否为管理员
            if (req.max_level_rank === FileType.UserRank.admin.toString()) {
                result.user_rank = 0  // 超管
            } else {
                // 上级最高不是业务员
                if (teamUser) {
                    result.user_rank = teamUser.user_rank
                } else {
                    result.user_rank = FileType.UserRank.agent
                }

            }
        }

        // const parentId = teamUser ? teamUser.team_parent_id : null
        // 获取当前团队下 所有团队列表
        const companyTeams = await  ctx.model.XTeam.findAll({where: {company_id: req.company_id},order:[['level','desc']]})

        // 获取当前team信息
        let team = {}
        let parentIds = []

        for(let t of companyTeams){
            if(t.id.toString() === req.team_id){
                result.founder  = t.open_id
                parentIds.push(t.id)
                team = t
            }
        }
        await this.service.team.linealTeam(companyTeams,team,parentIds,'parents') // 获取直系父级团队

        console.log(parentIds)

        for(let t of companyTeams){
            if(parentIds.indexOf(t.id) !== -1){
                teamParent.push(t)
            }
            if(t.parent_id === team.id){
                teamChild.push(t)
            }
        }

        // 获取当前团队所有的用户
        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取公司
        const teamUsers = await sequelize.query(
            "select u.name ,u.avatarUrl , u.openid , tu.user_rank  from x_team_user tu,  x_users u " +
            "where tu.open_id =  u.openid " +
            "and tu.team_id = :team_id " +
            "and tu.team_company_id = :company_id " +
            "order by tu.created_at desc ",
            {replacements: {team_id: req.team_id, company_id: req.company_id}, type: Sequelize.QueryTypes.SELECT})


        result.agents = teamUsers
        result.teamParent = teamParent
        result.teamchild = teamChild

        return result

    }


    async getAdminTeams(company_id, open_id) {

        const ctx = this.ctx

        let result = {}

        const adminTeam = await this.findManagerTeams(company_id,open_id)

        result.maxLevel = adminTeam.maxLevel
       // 获取所有团队信息
        const teams = await ctx.model.XTeam.findAll({where:{id:adminTeam.managerTeamIds}})
        result.teams = teams

        return result
    }


    // 获取公司所有用户
    async companyUsers(company_id) {

        return await  this.ctx.model.XUsers.findAll({where: {company_id: company_id}})
    }

    // 通讯录
    async getFriendList(company_id) {


        let result = {}

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);


        if (!company_id) return result

        // 获取公司所有用户团队信息
        const teamUsers = await sequelize.query(
            "select u.name, u.avatarUrl ,u.openid as open_id , tu.team_id , t.name as team_name ,t.level " +
            "from x_users u " +
            "left join x_team_user tu on tu.open_id = u.openid  " +
            "left join  x_team t on  t.id = tu.team_id " +
            "where u.company_id = :company_id ",
            {replacements: {company_id: company_id}, type: Sequelize.QueryTypes.SELECT})


        // const teamUsers = await sequelize.query(
        //   "select u.name, u.avatarUrl ,u.openid as open_id , tu.user_rank ,tu.team_id , t.name as team_name ,t.level  " +
        //   "from x_team_user tu, x_team  t, x_users u " +
        //   "where tu.open_id =  u.openid " +
        //   "and tu.team_id =  t.id " +
        //   "and tu.team_company_id = :company_id " +
        //   "order by tu.team_level asc" ,
        //   { replacements: {company_id:company_id}, type: Sequelize.QueryTypes.SELECT })

        // 封装团队信息
        let agents = []
        let teams

        for (let teamUser of teamUsers) {
            let team = {}
            team.level = teamUser.level
            team.team_id = teamUser.team_id
            team.teamName = teamUser.team_name
            team.userRank = teamUser.user_rank

            let agent
            for (let tempAgent of agents) {
                if (tempAgent.open_id === teamUser.open_id) {
                    agent = tempAgent
                }
            }

            if (!agent) {
                teamUser.teams = []
                if (team.team_id) {
                    teamUser.teams.push(team)
                }
                agents.push(teamUser)
            } else {
                if (team.team_id) agent.teams.push(team)
            }
        }

        // 获取所有公司所有team
        teams = await this.ctx.model.XTeam.findAll({where:{company_id:company_id}, order: [['level', "ASC"]] })

        result.agents = agents
        result.teams = teams

        return result


    }

    // 通过团队 id 和普通用户 id 获取该 用户所在团队的职位,管理员或者普通员工,及其公司子团队父团队等等
    async findOneByOpenIdteamId(team_id, open_id) {
        console.log('开始获取成员团队职务' + open_id + ',' + team_id);
        const team = await this.ctx.model.XTeamUser.findOne({where: {open_id: open_id, team_id: team_id}});
        if (team && team.dataValues) {
            return team.dataValues;
        } else {
            return ''
        }
    }
    // 通过转发邀请用户
    async join(params) {

        let resp = null;

        const ctx = this.ctx

        // 校验该成员是否已经加入团队
        const user = await ctx.model.XUsers.findOne({
          where: {
            openid: params.open_id
          }
        })
        if (user && user.company_id) {
          throw new Error('对不起，您已经加入团队，不得重复加入！')
        }

        // 获取团队
        let team = await ctx.model.XTeam.findOne({where: {id: params.team_id}})

        if(!team){
            throw new Error('团队不存在！')
        }

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

        // 获取公司
        let company = await this.ctx.model.XTeam.findOne({
            where: {id: params.company_id}
        })

        if(!company){
            throw new Error('公司不存在！')
            return
        }

        // 添加用户团队
        const addTeam = {
            team_id: params.team_id,
            operator: params.operator,
            open_id: params.open_id,
            user_rank: params.user_rank,
            team_level:team.level,
            team_parent_id :team.parent_id,
            team_company_id:team.company_id,

        }
        // await this.ctx.model.XTeamUser.create(addTeam)

        const updateParams = {
            phone: params.register_phone,
            name: params.name,
            company_id: company.id,
            company_name: company.name,
            company_founder: company.open_id,
            company_logo: company.logo
        }

        await sequelize.transaction(function (t) {
            return  ctx.model.XTeamUser.create(addTeam,{transaction: t}).then(function (result){
                if(result){
                    resp =  ctx.service.user.updateParams(updateParams, params.open_id)
                }
            })
        })
        if(!resp){
            throw new Error('团队加入失败！')
        }
        return resp
    }
    
    // 通过团队的总 id 和等级获取下限所有的业务员签到信息
    async teamGetSign(info){
        let all = {};
        let teamId = info.teamId;
        let level = info.level - 0;
        let time = info.time;
        let userOpenId = info.openId;


        let data_sign = await this.findManagerTeams(info.teamId,info.openId)
        console.log('输出签到的公司')
        console.log(data_sign)
        // 这是所有已经签到的人的信息;
        let data = []
        // 未签到的
        let n_data = []
        //获取当前公司下的所有用户
        for( let ji = 0 ; ji < data_sign.managerTeamIds.length ; ji++ ){
            let min_n_data =  await this.ctx.model.XTeamUser.findAll({where:{team_id:data_sign.managerTeamIds[ji]}})
            if( min_n_data.length > 0 ) {
                for( let yy = 0 ; yy < min_n_data.length ; yy++ ){
                    n_data.push(min_n_data[yy])
                }
            }
        }
        if( n_data.length > 0 ){
            for( let u = 0 ; u < n_data.length ; u++ ){
                let min_open_id = n_data[u].dataValues.open_id
                console.log('输出当前的所有用户')
                let min_data =  await this.ctx.model.XSign.findAll({where:{open_id:min_open_id,min_date:time}})
                if( min_data.length > 0 ){
                    for( let ii = 0 ; ii < min_data.length ; ii++ ){
                        data.push(min_data[ii])
                    }
                 }
            }
        }
        // 这是签到人数,以及其 open_id
        let obj_signNum = {};
        // 这是清理之后的签到信息,因为一个人会签到多次,需要进行排重
        let min_all = [];
        // 这是签到的公司成员
        let obj_teamUser = {};
        // 以及签到的人员 open 名单
        let true_sign_open_id = [];
        // 所有签到人的信息
        let t_user_all = [];
        if( data.length > 0 ){
            for( let i = 0 ; i < data.length ; i ++ ){
                // 添加签到的人数和每人的个数
                if( !obj_signNum[data[i].name] ){
                    // 当前的签到次数,当前的用户 id, 当前用户的头像,当前用户的签到地址,签到经度,签到的纬度
                    obj_signNum[data[i].name] = [
                        1,
                        data[i].open_id,
                        data[i].url,
                        data[i].site,
                        data[i].longitude,
                        data[i].latitude]
                }else{
                    ++obj_signNum[data[i].name][0]
                }
                // 清理签到人,排重
                if( min_all.length === 0 ){
                    min_all.push(data[i])
                    true_sign_open_id.push(data[i].open_id)
                }else{
                    let ll = false;
                    for( let p = 0 ; p < min_all.length ; p ++ ){
                        if( min_all[p].open_id === data[i].open_id ){
                            ll = true;
                        }
                    }
                    if( !ll ){
                        min_all.push(data[i])
                        true_sign_open_id.push(data[i].open_id)
                    }
                }
            };
            // 获取签到的人的信息
            // for( let t = 0 ; t < true_sign_open_id.length ; t ++ ){
            //     let t_user = await this.ctx.model.XUsers.findOne({where:{openid:true_sign_open_id[t]}});
            //     let id = await this.ctx.model.XSign.max('id',{where:{open_id:true_sign_open_id[t],min_date:time}});
            //     let t_sign = await this.ctx.model.XSign.findOne({where:{id:id}});
            //     console.log(t_sign)
            //     if( t_user && t_user.dataValues ){
            //         let tt = {};
            //         tt['open_id'] = t_user.dataValues.openid;
            //         tt['name'] = t_user.dataValues.name;
            //         tt['url'] = t_user.dataValues.avatarUrl;
            //         t_user_all.push(tt)
            //     }
            // }

            // 
        }
        all['已签到'] = obj_signNum



        // 查询未签到的
        //所有人的 openid
        let all_openid = [];
        // 未签到人的 openid
        let n_sign_open_id = [];
        // 未签到人的详细信息
        let f_user_all = [];
        if( n_data.length > 0 ){
            for( let m = 0 ; m < n_data.length ; m ++ ){
            // 所有的openid
                if( all_openid.indexOf(n_data[m].open_id) < 0 ){
                    all_openid.push(n_data[m].open_id)
                }
            }
            // 未签到的 openid
            for( let z = 0 ; z < all_openid.length ; z ++ ){
                if( true_sign_open_id.indexOf(all_openid[z]) < 0 ){
                    n_sign_open_id.push(all_openid[z])
                }
            }
            for( let j = 0 ; j < n_sign_open_id.length ; j ++ ){
                let f_user = await this.ctx.model.XUsers.findOne({where:{openid:n_sign_open_id[j]}});
                if( f_user && f_user.dataValues ){
                    let f = {};
                    f['open_id'] = f_user.dataValues.openid;
                    f['name'] = f_user.dataValues.name;
                    f['url'] = f_user.dataValues.avatarUrl;
                    f_user_all.push(f)
                }
            }
        }
        all['未签到'] = f_user_all
        all['数量'] = true_sign_open_id.length
        return all
    }


    async findAgentTeams(company_id,open_id){


        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);

         const result = await sequelize.query(
            "select tu.team_id  from  x_team_user tu where tu.open_id =:open_id " +
            "and user_rank =:user_rank " +
            "and tu.team_company_id =:company_id " +
            "order by tu.team_level asc ",
            {replacements: {open_id: open_id ,user_rank:FileType.UserRank.agent,company_id:company_id}, type: Sequelize.QueryTypes.SELECT})

        let teams = []

        for(let r of result){
             if(teams.indexOf(r.team_id) === -1){
                 teams.push(r.team_id)
             }
        }


        return teams

    }



    // 根据用户id获取所有管理的团队信息
    async findManagerTeams(company_id,open_id){

        const ctx = this.ctx

        let result = {}
        let managerTeamIds = []

        const cfg = this.config.sequelize;
        cfg.logging = false;
        const sequelize = new Sequelize(cfg);


        // 根据用户获取最高团管理团队
    /*    const teamUsers = await sequelize.query(
            "select  tu.*,  MIN(tu.team_level) as max_level  " +
            "from x_team_user tu where tu.open_id =:open_id  " +
            "and user_rank=:user_rank " +
            "and tu.team_company_id =:company_id ",
            {replacements: {open_id: open_id ,user_rank:FileType.UserRank.admin,company_id:company_id}, type: Sequelize.QueryTypes.SELECT})*/
        
        let teamUsers = await sequelize.query(
            "select tu.*  from  x_team_user tu where tu.open_id =:open_id " +
            "and user_rank =:user_rank " +
            "and tu.team_company_id =:company_id " +
            "order by tu.team_level asc ",
            {replacements: {open_id: open_id ,user_rank:FileType.UserRank.admin,company_id:company_id}, type: Sequelize.QueryTypes.SELECT})

        // 获取公司所有团队
        const company = await  ctx.model.XTeam.findAll({where:{company_id:company_id}})

        for(let index in teamUsers){
            if(index === 0 || index === '0' ){
                // console.log(index)
                // console.log(teamUsers[index].team_level)
                result.maxLevel = teamUsers[index].team_level
            }
            let team ={
                id:teamUsers[index].team_id,
                level:teamUsers[index].team_level,
            }
            //递归过去所有的团队
            managerTeamIds.push(teamUsers[index].team_id)
            await  this.service.team.linealTeamArray(company,team,managerTeamIds,'child',teamUsers,index);

        }

       /* // 获取最高等级
        for(let i =0;i<teamUsers.length;i++){
            let teamUser = teamUsers[i]
            if(i === 0){
                result.maxLevel = teamUser.max_level
            }
            let team ={
                id:teamUser.team_id,
                level:teamUser.team_level,
            }
            managerTeamIds.push(teamUser.team_id)
            //递归过去所有的团队
            await  this.service.team.linealTeam(company,team,managerTeamIds,'child');
        }*/

        result.managerTeamIds = managerTeamIds

        console.log('-----------------------------》managerTeamIds',result)


        return result

    }

//    获取当前用户所管理的所有团队和子团队
    async manageTeam(teams){
        let data = []
        for( let i = 0 ; i < teams.length ; i++ ){
            let min = await this.ctx.model.XTeam.findOne({where:{id:teams[i]}})
            data.push(min)
        }
        return data
    }



}

module.exports = TeamUserService
