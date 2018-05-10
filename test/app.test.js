//该文件测试端口是否能够联通,以及一些测试数据的创建(用户信息-公司信息-项目信息等等)

'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const OBJ = require('./testConfig')
console.log(OBJ)
describe('test/app/controller/user.test.js', () => {
    it('创建客户信息===========>此为前提!  POST  /api/user',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/user')
            .send(OBJ.userInfo)
            .expect(200);

    })
});