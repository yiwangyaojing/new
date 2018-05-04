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
    this.ctx.body = await this.ctx.service.user.findOrUpdateByOpenId(this.ctx.params.id);

  }
  // 模拟数据
  // async getTeam() {
  //   const { ctx, service } = this;
  // 	console.log('接收到了获取用户公司的请求-开始获取用户信息');
  //   const body = ctx.request.body;
  //   const userInfo = await this.ctx.service.user.findByOpenId('osT8H0RtHK1EwgD2YvWN4ZqkXo0E');
  //   console.log('通过公司 id, 开始获取公司信息');
  //   const team = await service.user.findTeamByOpenId('44');
  //   // console.log(userInfo.dataValues)
  //   //  let company_id = userInfo.company_id;
	//   const data = await service.teamUser.findOneByOpenIdteamId('44', 'osT8H0RtHK1EwgD2YvWN4ZqkXo0E');
  //   // let data = await service.teamUser.teamInfo('osT8H0fhmIydGLxj0erBGRnnTsA4','31');
  //   // console.log(data)
  //   // console.log(team)
	//   ctx.body = { data, team };
  // }
  
  // 获取用户团队公司--通过用户 openid 获取用户信息,通过用户信息内的company_id获取公司信息,通过公司信息内的等级创建人等等信息,筛选公司等级返回前端;
  async getTeam() {
    const { ctx, service } = this;
  	console.log('接收到了获取用户公司的请求-开始获取用户信息');
    const body = ctx.request.body;
    let openId = body.openId;
    const userInfo = await this.ctx.service.user.findByOpenId(openId);
    let company_id = userInfo.maxTeamId;
    console.log('通过公司 id, 开始获取公司信息');
    if( !userInfo.company_id || !company_id ){
      ctx.body =  {} ;
      return;
    }
    const team = await service.user.findTeamByOpenId(company_id);
	  const data = await service.teamUser.findOneByOpenIdteamId(company_id, openId);
	  ctx.body = { data, team };
  }

  // 获取公司子团队
  async getMinTeam() {
    this.ctx.body = '子团队成功';
  }
  // 获取业务员的项目信息
  async getSalesmanProject(){
    const { ctx, service } = this;  
    let body = ctx.request.body;
    let openId = body.openId;
    let date = body.date;
    // 
    let ProjectInfo = await service.user.getProjectInfo(openId,'one');
    // console.log(ProjectInfo)
    ctx.body = {ProjectInfo};
  }
}

module.exports = UserController;
