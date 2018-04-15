'use strict';

const Controller = require('egg').Controller;

class FeedbackController extends Controller {
  async create() {

    const { ctx, service } = this;

    const rule = {
      open_id: { type: 'string', required: true },
      phone: { type: 'string', required: true },
      content: { type: 'string', required: true },
    };

    ctx.validate(rule, ctx.request.body);

    ctx.body = await service.feedback.create(ctx.request.body);
  }

}

module.exports = FeedbackController;
