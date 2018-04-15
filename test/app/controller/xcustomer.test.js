'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/xcustomer.test.js', () => {
  it('创建客户基本信息 POST /api/xcustomer', () => {
    app.mockCsrf();
    return app.httpRequest()
      .post('/api/xcustomer')
      .send({
        name: 'controller李雷',
        user_id: Math.floor(new Date().getTime() / 1000),
        phone: '13300001111',
        province: '上海市',
        city: '上海市',
        street: '浦东新区惠南镇学海路28号',
      })
      .expect(200);
  });
});
