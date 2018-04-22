'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');

class FeedbackService extends Service {

  async create(req) {

    let resp;

    const ctx = this.ctx

    if (req.type === 1) {
      const files = req.files;
      for (const file of files) {
        file.open_id = req.open_id;
      }

      const feedback = {};
      feedback.open_id = req.open_id;
      feedback.content = req.content;
      feedback.type=req.type;

      const cfg = this.config.sequelize;
      cfg.logging = false;
      const sequelize = new Sequelize(cfg);

      await sequelize.transaction(function(t) {
        return ctx.model.Feedback.create(feedback, { transaction: t }).then(function(result0){
          for (const file of files) {
            file.source_id = result0.id;
          }
          return ctx.model.XFiles.bulkCreate(files, { transaction: t })
        })
        return ctx.model.XFiles.bulkCreate(files, { transaction: t }).then(function() {
          return ctx.model.Feedback.create(feedback, { transaction: t });
        });
      }).then(function(result) {
        resp = result;
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      resp = await this.ctx.model.Feedback.create(req);
    }

    return resp

  }

}

module.exports = FeedbackService;
