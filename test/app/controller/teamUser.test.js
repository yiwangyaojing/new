'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const OBJ = require('../../testConfig');
describe('test/app/controller/teamUser.test.js', () => {

    it('通过团队id 查看当前团队下所有的用户  GET /api/teamUser/:teamId',() => {
        app.mockCsrf();
        return app.httpRequest()
            .get('/api/teamUser/999999999')
            .expect(200)
    })

    it('修改用户权限 PUT /api/teamUser',() => {
        app.mockCsrf();
        return app.httpRequest()
            .put('/api/teamUser')
            .send({
                team_id: 999999999,
                operator:'454',
                users: [1,5]
            })
            .expect(500)
    })

    it('彻底删除团队 DEL /api/teamUser',() => {
        app.mockCsrf();
        return app.httpRequest()
            .del('/api/teamUser')
            .send({
                team_id:999999999,
                operator:'454',
                open_id:OBJ.openId
            })
            .expect(500)

    })

    it('把用户从公司删除 DEL /api/teamUser/delete',() => {
        app.mockCsrf();
        return app.httpRequest()
            .del('/api/teamUser/delete')
            .send({
                open_id:'99999999'
            })
            .expect(200)
    })

    it('添加用户到团队中 POST /api/teamUser',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/teamUser')
            .send({

            })

    })

});





















