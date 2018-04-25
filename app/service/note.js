'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');

class NoteService extends Service {

  async index(openId) {

    return await this.ctx.model.XNote.findAll({ where: { open_id: openId }, order: [[ 'updated_at', 'desc' ]] });
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

  async searchByOpenId(params) {
    return await this.ctx.model.XNote.findAll({
      where: {
        open_id: params.open_id
      },
      order: [[ 'updated_at', 'desc' ]]
    })
  }

  async searchBySearchContent(params) {
    const Op = Sequelize.Op;
    return await this.ctx.model.XNote.findAll({
      where: {
        [Op.or]: [{
          contents_text: {
            [Op.like]: '%' + params.search + '%',
          }
        }],
        open_id: params.open_id
      },
      order: [[ 'updated_at', 'desc' ]]
    })
  }

  async deleteByBatch(params) {
    console.log('this is ctx', this.ctx.request.body)
    const Op = Sequelize.Op;
    return await this.ctx.model.XNote.destroy({
      where: {
        id: {
          [Op.in]: params.idList
        },
        open_id: params.open_id
      }
    })
  }
}

module.exports = NoteService;
