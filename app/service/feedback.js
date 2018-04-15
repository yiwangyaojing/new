'use strict';

const Service = require('egg').Service;

class FeedbackService extends Service {

  async create(req) {

    return this.ctx.model.Feedback.create(req);
  }

}

module.exports = FeedbackService;
