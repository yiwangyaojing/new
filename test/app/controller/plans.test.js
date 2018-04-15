'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/plans.test.js', () => {
  it('创建客户方案基本信息 POST /api/plans', () => {
    app.mockCsrf();
    return app.httpRequest()
      .post('/api/plans')
      .send({
        open_id: '11111',
        cst_name: 'controller李雷',
        cst_phone: '13122332323',
        cst_remark: '备注备注',
      })
      .expect(200);
  });
});
