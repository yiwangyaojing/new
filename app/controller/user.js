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

  async update() {

    const { ctx, service } = this;
    const req = ctx.request.body;

    if(!req.openid){
        ctx.body = {message:'open_id不存在'};
        return
    }

    const result = await service.user.update(req);

    ctx.body = result;

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
    if(!userInfo){
        ctx.body =  {} ;
        return;
    }
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
  // 获取业务员的签到信息
  async getSign(){
    const { ctx, service } = this;
    let body = ctx.request.body;
    let signInfo = await service.user.oneUserGetSign(body);
    console.log(body);
    ctx.body = signInfo
  }
  // 检测该用户底层是否是管理员
  async isRank(){
    const { ctx, service } = this;
    let body = ctx.request.body;
    console.log(body)
    let teamInfo = await service.user.isRank(body);
    ctx.body = teamInfo
  }
}

module.exports = UserController;
