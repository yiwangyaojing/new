'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', () => {

    it('获取业务员的项目信息 POST /api/user/getSalesmanProject',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/user/getSalesmanProject')
            .send({
                openId:'osT8H0QFSjZdqWqJ-PKSS57pzdx0'
            })
            .expect(200)
            .then(response => {
                if( response.body ){
                    assert(response.body.ProjectInfo['累计'].length > -1, true)
                }
            })

        return app.httpRequest()
            .post('/api/user/getSalesmanProject')
            .send({
                openId:'osT8H0QFSjZdqWqJ-PKSS570'
            })
            .expect(500)
    })

});
