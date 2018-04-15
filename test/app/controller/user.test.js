'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {

  it('should GET /api/user', () => {
    app.mockCsrf();
    return app.httpRequest()
      .get('/api/user')
      .expect('hi, index')
      .expect(200);
  });

  it('获取用户详情 GET /api/user/:id', () => {
    app.mockCsrf();

    return app.httpRequest()
      .get('/api/user/oXv6k5BZ0VcLjKwjqzJkwodysKXk')
      .expect(200)
      .then(response => {
        // 判断返回值
        assert(response.body.openid, 'oXv6k5BZ0VcLjKwjqzJkwodysKXk');
      });
  });

  it('should PUT /api/user', () => {
    app.mockCsrf();

    return app.httpRequest()
      .put('/api/user')
      .expect('hi, update')
      .expect(200);
  });

  it('保存用户信息 POST /api/user', () => {
    app.mockCsrf();
    return app.httpRequest()
      .post('/api/user')
      .send({
        openid: 'ojsjS5NofiBahgVbSL4fhAZFtSQA',
      })
      .expect(200)
      .then(response => {
        // 判断返回值
        assert(response.body, 2);
      });
  });
});
