'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 用户相关rest服务
  router.post('/api/user', controller.user.create);
  router.del('/api/user/:id', controller.user.destroy);
  router.put('/api/user', controller.user.update);
  router.get('/api/user', controller.user.index);
  router.get('/api/user/:id', controller.user.show);

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
  router.get('/api/plans/:openId/:pageNumber', controller.plans.findByPage);
  router.get('/api/plans/:openId/:pageNumber/:search', controller.plans.findByPageAndSearch);
  router.put('/api/plans', controller.plans.update);
  router.del('/api/plans/:id', controller.plans.destroy);

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

  // 反馈
  router.post('/api/feedback', controller.feedback.create);
};
