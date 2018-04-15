'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {

  it('should GET /api/file', () => {
    app.mockCsrf();
    return app.httpRequest()
      .get('/api/file')
      .expect(200)
      .then(response => {
        // 判断返回值
        assert(response.body.length, 2);
      });
  });
});
