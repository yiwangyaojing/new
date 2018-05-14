'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    // 用户相关rest服务
    router.post('/api/user', controller.user.create);           //已写入测试-运行正常        将获取到的微信用户信息保存到数据库
    router.get('/api/user/:id', controller.user.show);          //已写入测试-运行正常     通过用户 id 获取用户的信息
    router.put('/api/user', controller.user.update);            //已写入测试-运行正常     通过用户 id, 修改用户信息

    router.post('/api/user/getTeam', controller.user.getTeam); // 已写入测试-正常运行     用户获取当前的公司团队(最高层级)
    router.post('/api/user/getSalesmanProject', controller.user.getSalesmanProject); // 已写入测试-正常运行   获取业务员的项目信息
    router.post('/api/user/getSign',controller.user.getSign); // 已写入测试-正常运行      获取业务员的签到信息
    router.post('/api/user/isRank',controller.user.isRank);// 已写入测试-正常运行    判断底层是否是管理员

    // 文件上传rest服务
    router.get('/api/file', controller.file.index);
    router.post('/api/file', controller.file.create);
    router.post('/api/file/upload', controller.file.upload);
    router.put('/api/file', controller.file.update);
    router.post('/api/file/del', controller.file.destory);
    router.get('/api/file/:plan_id/:source_type/:open_id', controller.file.detail);
    router.get('/api/file/queryIndexSliderAd', controller.file.queryIndexSliderAd);

    // 获取openId
    router.get('/api/wechat/:code', controller.wechat.getOpenId);

    // 客户相关rest服务
    router.post('/api/plans', controller.plans.basicCreate);    //已写入测试-正常运行   创建方案(项目)基本信息
    router.get('/api/plans/:openId', controller.plans.findAllByUser); //已写入测试-正常运行      获取用户的所有客户信息
    router.get('/api/plans/detail/:id', controller.plans.detail);   //已写入测试-正常运行     通过项目 id查看项目详情
    router.post('/api/plans/:openId/:pageNumber', controller.plans.findByPage);  //已写入测试-正常         通过用户 id 和当前页面数量查询客户项目信息
    router.post('/api/plans/:openId/:pageNumber/:search', controller.plans.findByPageAndSearch);//已写入测试-正常运行   通过用户 id +页面数量+搜索条件查询用户项目信息
    router.put('/api/plans', controller.plans.update);  //已写入测试-运行正常    更新方案,项目信息(创建方案,项目详细信息)
    router.del('/api/plans/:id', controller.plans.destroy); //已写入测试-运行正常     通过方案(项目)id 删除当前方案(项目)
    router.put('/api/plans/sampleClient/:id', controller.plans.updateSampleClient); //已写入测试-运行正常    删除示例客户(修改用户)

    // 方案进度 --  逾期
    router.post('/api/planSchedule', controller.planSchedule.create);       //已写入测试-运行正常    新增方案
    router.get('/api/planSchedule/:open_id/:plan_id', controller.planSchedule.index); //已写入测试-运行正常 通过 openid 和方案 id 获取方案信息
    // 方案回款 --  回款
    router.post('/api/planPay', controller.planPay.create);  //已写入测试-运行正常   新建回款信息,或者是修改信息
    router.get('/api/planPay/:open_id/:plan_id', controller.planPay.index); //已写入测试-运行正常   通过 openid和方案 id获取该方案信息

    // 计算器相关rest服务
    router.get('/api/calculator/:openId', controller.calculator.index);
    router.get('/api/calculator/:province/:city', controller.calculator.cityPrice);
    router.post('/api/calculator', controller.calculator.compute);

    // 笔记本相关rest服务
    router.post('/api/note', controller.note.create);
    router.del('/api/note/:id', controller.note.destroy);
    router.put('/api/note', controller.note.update);
    router.get('/api/note/:openId', controller.note.index);
    router.get('/api/note/show/:id', controller.note.show);
    router.get('/api/note/search/:open_id', controller.note.searchByOpenId);
    router.get('/api/note/search/:open_id/:search', controller.note.searchBySearchContent);
    router.post('/api/note/del', controller.note.deleteByBatch);

    // 反馈
    router.post('/api/feedback', controller.feedback.create);

    // 团队
    router.post('/api/team/sms', controller.team.sms);  //已写入测试-运行正常  短信接口
    router.get('/api/team/user/:open_id', controller.team.getUserTeam); //已写入测试-运行正常  通过用户 id 获取用户所在的所有团队
    router.get('/api/team/:id/:open_id', controller.team.index);    //已写入测试-运行正常    通过用户 id 和公司 id, 获取公司详情
    router.post('/api/team/company', controller.team.companyCreate);    //已写入测试-运行正常    创建公司团队
    router.put('/api/team/company', controller.team.companyUpdate); //已写入测试-运行正常  修改公司信息
    router.post('/api/team', controller.team.create);   //已写入测试  团队创建
    router.put('/api/team', controller.team.update);    //已写入测试-运行正常  修改团队
    router.del('/api/team/:id/:open_id', controller.team.destroy);  //已写入测试-运行正常 通过团队 id 和操作人 id解散团队
    // 团队成员
    router.get('/api/teamUser/:teamId', controller.teamUser.index); //已写入测试-运行正常  查询当前团队所有用户
    router.put('/api/teamUser', controller.teamUser.updateRule);    //已写入测试-运行正常  修改用户权限
    router.del('/api/teamUser', controller.teamUser.destroy);   //已写入测试-运行正常 彻底删除团队
    router.del('/api/teamUser/delete', controller.teamUser.deleteFromCompany);  //已写入测试-运行正常  把用户从公司删除
    router.post('/api/teamUser', controller.teamUser.create);   //将用户拉入公司
    router.post('/api/teamUser/manager', controller.teamUser.teamManagerInit);
    router.post('/api/teamUser/join', controller.teamUser.join);
    router.post('/api/teamUser/teamUsers', controller.teamUser.findTeamUsers);   //通过 openid 和团队等级获取所有的用户 id;

    router.get('/api/teamUser/user/:open_id', controller.teamUser.userInfo);
    router.put('/api/teamUser/user', controller.teamUser.updateUser);
    router.post('/api/teamUser/user/bundling', controller.teamUser.bundling);
    router.del('/api/teamUser/user', controller.teamUser.delUser);
    router.get('/api/teamUser/friend/:company_id', controller.teamUser.friendList);
    router.get('/api/teamUser/company/:company_id', controller.teamUser.companyUsers);
    router.post('/api/teamUser/getSign',controller.teamUser.teamGetSign); // 获取团队内的所有人的签到信息

    // 概况
    router.get('/api/teamUser/admin/:open_id/:company_id', controller.teamUser.getAdminTeams);
    // 逾期
    router.get('/api/overdue/:company_id', controller.overdue.index);
    router.put('/api/overdue', controller.overdue.update);
    router.post('/api/overdue', controller.overdue.query);

    // 计算排板子规则计算
    router.post('/api/roof', controller.roof.index);

    // PC端登录
    router.post('/api/login/sms', controller.login.sms);
    router.post('/api/login', controller.login.userLogin);

    // 签到
    router.post('/api/sign/sign',controller.sign.signs);    //创建签到信息

    //PC端进度详情
    router.post('/api/detailSettingPc/settingDetails', controller.detailSettingPc.findParamsByPage);
    router.post('/api/detailSettingPc/planDetail/:id', controller.detailSettingPc.findPlanById);
    router.post('/api/detailSettingPc/contractStatus/:id', controller.detailSettingPc.findContractStatusById);
    router.post('/api/detailSettingPc/payStatus/:id', controller.detailSettingPc.findPayStatusById);

};
