'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const OBJ = require('../../testConfig');
describe('test/app/controller/team.test.js', () => {
    it('短信验证接口 POST /api/team/sms',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/team/sms')
            .send({
                register_phone:'152383188746',
                open_id:OBJ.openId,
                template_code:'SMS_134250285'
            })
            .expect(500)
    });

    it('通过用户 id 获取用户所在的所有团队 GET /api/team/user/:open_id',() => {
        app.mockCsrf();
        return app.httpRequest()
            .get('/api/team/user/' + OBJ.openId)
            .expect(200)
    })

    it('通过用户 id 和公司 id 获取公司详情 GET /api/team/:id/:open_id',() => {
        app.mockCsrf();
        return app.httpRequest()
            .get('/api/team/user/' + OBJ.openId)
            .expect(200)
    })
    it('创建公司信息  POST  /api/team/company',() => {
        app.mockCsrf();
        // return app.httpRequest()
        //     .post('/api/team/company')
        //     .send({
        //         open_id:OBJ.openId,
        //         register_phone:'15238318785',
        //         name:'接口脚本检测公司',
        //         validateCode:'5140'
        //     })
        //     .expect(200)


        return app.httpRequest()
            .post('/api/team/company')
            .send({
                open_id:OBJ.openId,
                register_phone:'15238369547',
                name:'接口脚本检测公司',
                validateCode:'5140'
            })
            .expect(500)
    })

    it('修改公司信息 PUT /api/team/company',() => {
        app.mockCsrf();
        return app.httpRequest()
            .put('/api/team/company')
            .send({
                id:999,
                name:'后台接口测试新建团队',
                open_id: OBJ.openId,
                validateCode: '5466',
                oss_name: 'hskasd',
                logo: 'http://'
            })
            .expect(500)
    })

    it('创建团队信息 POST /api/team',() => {      //在查找总公司的时候,应需要进行判断总公司是否存在
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/team')
            .send({
                name:'后台接口测试分团队',
                open_id: OBJ.openId,
                level:2,
                parent_id:999999999,
                company_id:999999999,
                company_name: '测试',
            })
            .expect(200)

    })

    it('修改团队信息 PUT /api/team',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/team')
            .send({
                id: 999999999,
                name:'测试团队',
                open_id: OBJ.openId
            })
            .expect(500)
    })

    it('解散团队 DEL /api/team/:id/:open_id',() => {
        app.mockCsrf();
        return app.httpRequest()
            .del('/api/team/999999999/' + OBJ.openId)
            .expect(500)

    })


});





















