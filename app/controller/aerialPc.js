'use strict';

const Controller = require('egg').Controller;

class AerialController extends Controller {

  // 保存航拍上传信息
  async save() {
    const { ctx, service } = this;
    const rule = {
      linkman: { type: 'string', required: true },
      projectName: { type: 'string', required: true },
      phone: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.request.body);

    ctx.body = await service.aerialPc.save(ctx.request.body);
  }
}

module.exports = AerialController;
