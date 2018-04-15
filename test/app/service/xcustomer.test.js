'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/xcustomer.test.js', () => {
  it('创建customer基本信息', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.xcustomer
    const demoCustomer = {
      name: 'service李雷',
      user_id: Math.floor(new Date().getTime() / 1000),
      phone: '13300001111',
      province: '上海市',
      city: '上海市',
      street: '浦东新区惠南镇学海路28号',
    };
    const xcustomer = await ctx.service.xcustomer.basicCreate(demoCustomer);
    assert(xcustomer != null);
  });

});
