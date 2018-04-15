'use strict';

const Controller = require('egg').Controller;
const rule = {
  id: { type: 'string', required: true },
};

const ProvinceFormart = require('../util/ProvinceFormart');

//
class UserController extends Controller {
  // PUT /api/user
  async create() {

    const { ctx, service } = this;
    const body = ctx.request.body;
    const user = Object.assign({}, body);
    user.province = ProvinceFormart.formart(user.province);

    const result = await service.user.create(user);

    ctx.body = result;

  }

  // DEL /api/user
  async destroy() {
    this.ctx.body = 'hi, destroy';
  }

  // PUT /api/user
  async update() {
    this.ctx.body = 'hi, update';
  }

  // GET /api/user
  async index() {
    this.ctx.body = 'hi, index';
  }

  // GET /api/user/:id
  async show() {
    // URL参数参数校验
    this.ctx.validate(rule, { id: this.ctx.params.id });
    this.ctx.body = await this.ctx.service.user.findByOpenId(this.ctx.params.id);

  }

}

module.exports = UserController;
