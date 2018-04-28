'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    // 用户相关rest服务
    router.post('/api/user', controller.user.create);
    router.del('/api/user/:id', controller.user.destroy);
    router.put('/api/user', controller.user.update);
    router.get('/api/user', controller.user.index);
    router.get('/api/user/:id', controller.user.show);

    router.post('/api/user/getTeam', controller.user.getTeam); // 用户获取当前的公司团队
    router.post('/api/user/getMinTeam', controller.user.getMinTeam); // 获取子公司
    router.post('/api/user/getSalesmanProject', controller.user.getSalesmanProject); // 获取业务员的项目信息


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
    router.post('/api/plans', controller.plans.basicCreate);
    router.get('/api/plans/:openId', controller.plans.findAllByUser);
    router.get('/api/plans/detail/:id', controller.plans.detail);
    router.post('/api/plans/:openId/:pageNumber', controller.plans.findByPage);
    router.post('/api/plans/:openId/:pageNumber/:search', controller.plans.findByPageAndSearch);
    router.put('/api/plans', controller.plans.update);
    router.del('/api/plans/:id', controller.plans.destroy);

    // 方案进度
    router.post('/api/planSchedule', controller.planSchedule.create);
    router.get('/api/planSchedule/:open_id/:plan_id', controller.planSchedule.index);
    // 方案回款
    router.post('/api/planPay', controller.planPay.create);
    router.get('/api/planPay/:open_id/:plan_id', controller.planPay.index);

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
    router.get('/api/team/sms/:open_id/:register_phone', controller.team.sms);
    router.get('/api/team/user/:open_id', controller.team.getUserTeam);
    router.get('/api/team/:id/:open_id', controller.team.index);
    router.post('/api/team/company', controller.team.companyCreate);
    router.put('/api/team/company', controller.team.companyUpdate);
    router.post('/api/team', controller.team.create);
    router.put('/api/team', controller.team.update);
    router.del('/api/team/:id/:open_id', controller.team.destroy);

    // 团队成员
    router.get('/api/teamUser/:teamId', controller.teamUser.index);
    router.put('/api/teamUser', controller.teamUser.updateRule);
    router.del('/api/teamUser', controller.teamUser.destroy);
    router.del('/api/teamUser/delete', controller.teamUser.deleteFromCompany);
    router.post('/api/teamUser', controller.teamUser.create);
    router.post('/api/teamUser/manager', controller.teamUser.teamManagerInit);
    router.post('/api/teamUser/join', controller.teamUser.join);
    router.post('/api/teamUser/teamUsers', controller.teamUser.findTeamUsers);   //通过 openid 和团队等级获取所有的用户 id;

    router.get('/api/teamUser/user/:open_id', controller.teamUser.userInfo);
    router.put('/api/teamUser/user', controller.teamUser.updateUser);
    router.post('/api/teamUser/user/bundling', controller.teamUser.bundling);
    router.del('/api/teamUser/user', controller.teamUser.delUser);
    router.get('/api/teamUser/friend/:company_id', controller.teamUser.friendList);
    router.get('/api/teamUser/company/:company_id', controller.teamUser.companyUsers);

    // 概况
    router.get('/api/teamUser/admin/:open_id/:company_id', controller.teamUser.getAdminTeams);
    // 逾期
    router.get('/api/overdue/:company_id', controller.overdue.index);
    router.put('/api/overdue', controller.overdue.update);
    router.post('/api/overdue', controller.overdue.query);

    // 计算排板子规则计算
    router.post('/api/roof', controller.roof.index)

};
