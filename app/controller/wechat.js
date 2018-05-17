'use strict';

const Controller = require('egg').Controller;

class Wechat extends Controller {

  async getOpenId() {

    const { ctx, config } = this;

    // 获取参数
    const appId = config.wechat.appId;
    const secret = config.wechat.secret;
    const url = config.wechat.openIdUrl;
    const code = ctx.params.code;
    console.log(appId);
    console.log(secret);
    // 发送http请求获取OpenId等参数信息
    const result = await ctx.curl(url + '?appid=' + appId + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + code ,{
        method: 'GET',
        dataType: 'json',
    });
    ctx.body = result.data;
  }

}

module.exports = Wechat;
