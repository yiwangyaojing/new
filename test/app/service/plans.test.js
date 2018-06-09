'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/plans.test.js', () => {
  it('创建计划基本信息', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.xcustomer
    const PlanDemo = {
      cst_name: 'service李雷',
      open_id: '1111',
      // zj_format: 1,
      // rf_is_finish: 0,
      // h_is_finish: 0,
      // d_is_finish: 0,
      // zj_num: 0,
    };
    const xcustomer = await ctx.service.plans.basicCreate(PlanDemo);
    assert(xcustomer != null);
  });

});
