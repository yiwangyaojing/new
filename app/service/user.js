'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async findByOpenId(openid) {
    const user = await this.ctx.model.XUsers.findOne({ where: { openid } });
    return user;
  }

  async create(user) {
    let result;
    let isCreated;
    await this.ctx.model.XUsers.findOrCreate({
      where: { openid: user.openid },
      defaults: user,
    }).spread((model, created) => {
      result = model.get({ plain: true });
      isCreated = created;
    });
    if (isCreated === false) {
      await this.ctx.model.XUsers.update(user, { where: { openid: user.openid } });
    }

    // console.log(result);
    return result.id;

  }
}

module.exports = UserService;
