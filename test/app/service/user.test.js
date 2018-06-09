'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', () => {

  it('根据openId查询用户', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const user = await ctx.service.user.findByOpenId('abcd123');
    assert(user == null);
  });

});
