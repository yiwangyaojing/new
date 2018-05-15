'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const OBJ = require('../../testConfig');
describe('test/app/controller/planSchedule.test.js', () => {

    it('新增方案状态(逾期)  POST /api/planSchedule', () => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/planSchedule')
            .send(OBJ.lanSchedule)
            .expect(200)
    });

    it('获取逾期方案信息 GET /api/planSchedule/:open_id/:plan_id',() => {
        app.mockCsrf();
        return app.httpRequest()
            .get('/api/planSchedule/'+ OBJ.openId +'/1')
            .send(OBJ.lanSchedule)
            .expect(200)
    })
});
