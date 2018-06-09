'use strict';

const Controller = require('egg').Controller;

class NoteController extends Controller {

  async index() {

    const { ctx, service } = this;

    const rule = {
      openId: { type: 'string', required: true },
    };

    ctx.validate(rule, ctx.params);

    ctx.body = await service.note.index(ctx.params.openId);
  }

  async create() {

    const { ctx, service } = this;

    const rule = {
      open_id: { type: 'string', required: true },
      contents_text: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.request.body);

    ctx.body = await service.note.create(ctx.request.body);

  }

  async update() {

    const { ctx, service } = this;

    const rule = {
      id: { type: 'int', required: true },
      contents_text: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.request.body);

    ctx.body = await service.note.update(ctx.request.body);
  }

  async destroy() {

    const { ctx, service } = this;

    console.log(ctx.params);
    const rule = {
      id: { type: 'id', required: true },
    };
    ctx.validate(rule, ctx.params);

    ctx.body = await service.note.destroy(ctx.params.id);

  }

  async show() {
    const { ctx, service } = this;

    console.log(ctx.params);
    const rule = {
      id: { type: 'id', required: true },
    };
    ctx.validate(rule, ctx.params);

    ctx.body = await service.note.show(ctx.params.id);
  }

  async searchByOpenId() {
    const {ctx, service} = this;
    console.log('查询参数===>>', ctx.params);
    const rule = {
      open_id: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.params);
    ctx.body = await service.note.searchByOpenId(ctx.params)
  }

  async searchBySearchContent() {
    const {ctx, service} = this;
    console.log('查询参数===>>', ctx.params);
    const rule = {
      open_id: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.params);

    ctx.body = await service.note.searchBySearchContent(ctx.params)
  }

  async deleteByBatch() {
    const {ctx, service} = this;
    console.log('查询参数===>>', ctx.request.body);
    const rule = {
      open_id: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.request.body);
    ctx.body = await service.note.deleteByBatch(ctx.request.body)
  }

}

module.exports = NoteController;

