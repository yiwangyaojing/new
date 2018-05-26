'use strict';
/**
 * 后台管理用户身份认证，只有登录用户才可以访问某些地址
 */
module.exports = () => {
  return async function(ctx, next) {
    console.log('中间件执行了！ 。。。。。')
    if (!ctx.session.user) {
        ctx.logger.info('当前用户未登录，无法访问');
        ctx.body = { message: '当前用户未登录，无法访问' };
        ctx.status = 403;
    } else {
      await next();
    }
  };
};
