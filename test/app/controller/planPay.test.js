'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const OBJ = require('../../testConfig');
describe('test/app/controller/planPay.test.js', () => {
    it('新建方案回款信息 POST /api/planPay',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/planPay')
            .send(OBJ.planPay)
            .expect(200)
            .then(response => {
                assert(response.body.open_id,OBJ.openId)
            })
    });

    it('获取方案回款信息 GET /api/planPay/:open_id/:plan_id',() => {
        app.mockCsrf();
        return app.httpRequest()
            .get('/api/planPay/' + OBJ.openId + '/1')
            .send(OBJ.planPay)
            .expect(200)

    })
});
