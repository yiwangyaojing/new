'use strict';

const Controller = require('egg').Controller;

class CalculatorController extends Controller {

  async cityPrice() {

    const { ctx, service } = this;

    const rule = {
      province: { type: 'string', required: true },
      city: { type: 'string', required: true },
    };

    ctx.validate(rule, { province: ctx.params.province, city: ctx.params.city });
    const cityPrice = await service.calculator.TblCityPrice(ctx.params);

    ctx.body = cityPrice;

  }

  // GET /api/calculator 初始化计算器数据
  async index() {

    // const request = {
    //   openId: 'oXv6k5BZ0VcLjKwjqzJkwodysKXk',
    //   province: '上海市',// 省份
    //   city: '上海市', //城市
    //   zj_gl: 1000, // 组件功率
    //   zj_sl: 10, // 组件数量
    //   unit_price: 1, // 系统单价
    //   jm_price: 0.62, // 居民电价
    //   dw_price: 0.42, //电网收购电价 - 脱硫煤电价
    //   zfzy_percent: 50, // 自发自用比例 - 余点上网 默认50 - 全额上网 0
    //   bt_country: 0.37, // 国家补贴
    //   bt_country_year: 20, // 国家补贴年数
    //   bt_province: 0.4, // 省级补贴
    //   bt_province_year: 5, // 省级补贴年数
    //   bt_city: 0, // 地方补贴
    //   bt_city_year: 0, //地方补贴年数
    //   dk_percent: 100, // '首付比例'
    //   dk_year: 0, // '贷款期限'
    //   dk_rate: 0, // '贷款利率'
    //   sunlight_hour: 100, // 光照小时
    //   qesw_price: 0.42, // '全额上网电价',  - 全额上网 = 标杆电价  当余电上网时为 0
    //   gz_level: '三类', // 光照资源区
    // }
    //
    // console.log('abc' + JSON.stringify(request))

    const { ctx, service } = this;

    const rule = {
      openId: { type: 'string', required: true },
    };

    ctx.validate(rule, { openId: ctx.params.openId });

    ctx.body = await service.calculator.index(ctx.params);

  }

  // 快速计算
  async compute() {
    const { ctx, service } = this;
    const req = ctx.request.body;
    const rule = {
      zj_gl: { type: 'number', required: true }, // 组件功率
      zj_sl: { type: 'int', required: true }, // 组件数量
      sunlight_hour: { type: 'int', required: true }, // 光照小时
      unit_price: { type: 'number', required: true }, // 系统单价
      province: { type: 'string', required: true }, // 省份
      city: { type: 'string', required: true }, // 城市
      gz_level: { type: 'string', required: false }, // 光照资源区
      bt_country_year: { type: 'int', required: true }, // 国家补贴年数
      bt_country: { type: 'number', required: true }, // 国家补贴年数
      bt_province: { type: 'number', required: true }, // 省级补贴
      bt_province_year: { type: 'number', required: true }, // 省级补贴年数
    };
    ctx.validate(rule, ctx.request.body);
    const result = await service.calculator.compute(req);
    ctx.body = result;
  }

}

module.exports = CalculatorController;
