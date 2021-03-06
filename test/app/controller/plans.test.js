'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const OBJ = require('../../testConfig.js');

describe('test/app/controller/plans.test.js', () => {
  it('创建客户方案基本信息 POST /api/plans', () => {
    app.mockCsrf();
    return app.httpRequest()
      .post('/api/plans')
      .send(OBJ.planyInfo)
      .expect(200);
  });
  it('获取用户的所有客户信息 GET /api/plans/:openId',() => {
      app.mockCsrf();
      return app.httpRequest()
          .get('/api/plans/'+OBJ.openId)
          .expect(200)
          .then(response => {
              assert(response.body.length > -1, true)
          })
  })

    it('通过项目 id, 查看项目详情 GET /api/plans/detail/:id',() => {
        app.mockCsrf();
        let id = '1';
        return app.httpRequest()
            .get('/api/plans/detail/' + id)
            .expect(200)
            .then(response => {
                assert(response.body.id, id)
            })

    })

    it('通过用户 id 和翻页数量查询客户项目信息 POST /api/plans/:openId/:pageNumber',() => {
        app.mockCsrf();
        let id = OBJ.openId;
        let num = 3;
        return app.httpRequest()
            .post('/api/plans/'+ id +'/' + num)
            .expect(200)
            .then(response => {
                assert(response.body.length > -1, true)
            })

    })

    it('通过用户 id 和翻页数量和搜索条件来查询客户项目信息 POST /api/plans/:openId/:pageNumber/:search',() => {
        app.mockCsrf();
        let id = OBJ.openId;
        let num = 3;
        let name = '项目'
        return app.httpRequest()
            .post('/api/plans/' + id + '/' + num + '/' + name)
            .expect(200)
            .then(response => {
                console.log(response.body)
            })

    })


    it('通过方案 id, 删除当前方案信息 DEL /api/plans/:id',() => {
        app.mockCsrf();
        return app.httpRequest()
            .del('/api/plans/1')
            .expect(200)

    })

    it('通过用户 id, 修改是否可见实例用户 PUT /api/plans/sampleClient/:id',() => {
        app.mockCsrf();
        let id = OBJ.openId;
        let num = 3;
        return app.httpRequest()
            .put('/api/plans/sampleClient/' + OBJ.openId)
            .expect(200)

    })
});
