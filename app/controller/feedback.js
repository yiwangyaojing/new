'use strict';

const Controller = require('egg').Controller;

class FeedbackController extends Controller {
  async create() {

    const { ctx, service } = this;

    const rule = {
      open_id: { type: 'string', required: true },
      phone: { type: 'string', required: false },
      content: { type: 'string', required: false },
    };

    ctx.validate(rule, ctx.request.body);

    ctx.body = await service.feedback.create(ctx.request.body);
  }

  async photovoltaicCreate(){
      const { ctx, service } = this;
      let body = ctx.request.body;
      console.log('收到了',body);
      let data = await service.feedback.photovoltaicCreate(ctx.request.body);
      ctx.body = body;
  }

}

module.exports = FeedbackController;
