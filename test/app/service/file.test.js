'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/file.test.js', () => {

  it('根据save_type文件类型，查询文件', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const files = await ctx.service.file.index();
    assert(!!files);
  });

});
