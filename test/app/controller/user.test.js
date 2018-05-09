'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {
  it('should GET /api/user', () => {
    app.mockCsrf();
    return app.httpRequest()
      .get('/api/user')
      .expect('<h1>404 Not Found</h1>')
      .expect(404);
  });

  it('通过 id检测用户不存在时,返回的结果 GET /api/user/:id', () => {
    app.mockCsrf();

    return app.httpRequest()
      .get('/api/user/4561')
      .expect(200)
      .then(response => {
        // 判断返回值
        assert(response, {});
      });
  });

  it('通过 id检测用户存在时,返回的结果 GET /api/user/:id', () => {
        app.mockCsrf();

        return app.httpRequest()
            .get('/api/user/osT8H0QFSjZdqWqJ-PKSS57pzdx0')
            .expect(200)
            .then(response => {
                // 判断返回值
                assert(response.body.openid, 'osT8H0QFSjZdqWqJ-PKSS57pzdx0');
            });
  });

  it('更新请求 should PUT /api/user', () => {
    app.mockCsrf();

    return app.httpRequest()
      .put('/api/user')
      .expect('<h1>404 Not Found</h1>')
      .expect(404);
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

  it( '通过用户 id 获取用户公司与团队信息 POST /api/user/getTeam',() => {
      app.mockCsrf();
      return app.httpRequest()
          .post('/api/user/getTeam')
          .send({
              openId:'osT8H0QFSjZdqWqJ-PKSS57pzdx0'
          })
          .expect(200)
          .then(response => {
              //公司信息不存在时
              if( String(response.body) == '{}'){
                  assert(response.body, {});
              }else{
                  assert(response.body.data.open_id, 'osT8H0QFSjZdqWqJ-PKSS57pzdx0');
              }
          })

  })


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


    it('获取业务员的签到信息 POST /api/user/getSign',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/user/getSign')
            .send({
                openId:'osT8H0QFSjZdqWqJ-PKSS57pzdx0',
                time:'2018-05-09'
            })
            .expect(200)
            .then(response => {
                assert(response.body.length > -1, true)
            })

    })

    it('判断底层是否是管理员 POST /api/user/isRank',() => {
        app.mockCsrf();
        return app.httpRequest()
            .post('/api/user/isRank')
            .send({
                openId:'osT8H0QFSjZdqWqJ-PKSS57dx0',
            })
            .expect(200)

    })

});
