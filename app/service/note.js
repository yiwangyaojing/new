'use strict';

const Service = require('egg').Service;

class NoteService extends Service {

  async index(openId) {

    return await this.ctx.model.XNote.findAll({ where: { open_id: openId } , order: [ ["updated_at","desc"] ] });
  }

  async create(req) {

    return await this.ctx.model.XNote.create(req);

  }

  async update(req) {

    return await this.ctx.model.XNote.update(req, { where: { id: req.id } });

  }

  async destroy(id) {
    return await this.ctx.model.XNote.destroy({ where: { id } });
  }

  async show(id) {
    return await this.ctx.model.XNote.findOne({ where: { id } });
  }

}

module.exports = NoteService;
