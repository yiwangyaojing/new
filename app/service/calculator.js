'use strict';

const Service = require('egg').Service;
const FileType = require('../const/FileType');

class CalculatorService extends Service {

  // 获取城市电价
  async TblCityPrice() {
    const ctx = this.ctx;
    const params = ctx.params;
    const resp = {};
    const TblCityPrice = await ctx.model.TblCityPrice.findOne({ where: { province: params.province, city: params.city } });
    if (TblCityPrice) {
      resp.province = TblCityPrice.province;
      resp.city = TblCityPrice.city;
      resp.jm_price = TblCityPrice.price_jm;
      resp.bg_price = TblCityPrice.price_bg;
      resp.dw_price = TblCityPrice.price_tlm;
      resp.gz_level = TblCityPrice.gz_level;
      resp.bt_country = TblCityPrice.bt_country;
      resp.bt_country_year = TblCityPrice.bt_country_year;
      resp.bt_province = TblCityPrice.bt_province;
      resp.bt_province_year = TblCityPrice.bt_province_year;
      resp.sunlight_hour = TblCityPrice.sunlight_hour;
    }


    return resp;
  }

  // 获取上一次查询信息
  async index() {
    const ctx = this.ctx;
    const params = ctx.params;

    const resp = {};
    // 查询历史信息
    const queryHistory = await ctx.model.TblQueryHistory.findOne({ where: { open_id: params.openId } });
    if (queryHistory) {
      resp.queryHistory = queryHistory;
      // 查询历史结果
      const queryResult = await ctx.model.TblQueryResult.findOne({ where: { query_id: queryHistory.id } });
      if (queryResult) {
        resp.queryResult = queryResult;
      }
    }

    return resp;
  }

  // 快速计算
  async compute(request) {

    // const request = {
    //   province: req.province,// 省份
    //   city: req.city , //城市
    //   zj_gl: req.zj_gl , // 组件功率
    //   zj_sl: req.zj_sl , // 组件数量
    //   unit_price: req.unit_price , // 系统单价
    //   jm_price: req.rice_jm , // 居民电价
    //   dw_price: req.dw_price , //电网收购电价 - 脱硫煤电价
    //   zfzy_percent: req.zfzy_percent , // 自发自用比例 - 余点上网 默认50 - 全额上网 0
    //   bt_country: req.bt_country , // 国家补贴
    //   bt_country_year: req.bt_country_year, // 国家补贴年数
    //   bt_province: req.bt_province , // 省级补贴
    //   bt_province_year: req.bt_province_year , // 省级补贴年数
    //   bt_city: req.bt_city , // 地方补贴
    //   bt_city_year: req.bt_city_year , //地方补贴年数
    //   dk_percent: req.dk_percent , // '首付比例'
    //   dk_year: req.dk_year , // '贷款期限'
    //   dk_rate: req.dk_rate , // '贷款利率'
    //   sunlight_hour: req.sunlight_hour , // 光照小时
    //   qesw_price: req.qesw_price , // '全额上网电价',  - 全额上网 = 标杆电价 - 余点上网 0
    //   gz_level: req.gz_level, // 光照资源区
    // }

    const result = {
      province: request.province, // 省份
      city: request.city, // 城市
      xtrl: 0, // '系统容量',
      xtzj: 0, // 系统总价',
      nfdl: 0, // '年发电量',
      sn_profit: 0, // '首年收益',
      sd_profit: 0, // '省电收益',
      md_profit: 0, // '卖电收益',
      bt: 0, // '补贴',
      total_profit: 0, // '总收益',
      sn_pay: 0, // '首付',
      sn_repay: 0, // '首年还款',
      dkqj_profit: 0, // '贷款期净收益',
      y25_profit: 0, // '25年净收益',
      ext_info: '', // '扩展信息',
    };

    const matrixList = [];
    const matrix = {};
    let dwPrice = request.dw_price;
    if (request.qesw_price > 0) {
      dwPrice = request.qesw_price;
    }

    const dkPercent = request.dk_percent / 100; // 贷款期限
    const dkRate = request.dk_rate / 100; // 贷款利率
    const zfzyPercent = request.zfzy_percent / 100; // 自发自用比例


    // 计算装机容量 装机(系统)容量 = 组件功率（规格） * 组件数量
    result.xtrl = request.zj_gl * request.zj_sl / 1000;

    // 计算年度电量 =装机(系统)容量 * 光照小时
    result.nfdl = result.xtrl * request.sunlight_hour;

    // 计算系统总价 = 装机(系统)容量 * 单价
    result.xtzj = result.xtrl * request.unit_price * 1000;

    // 补贴总数 = 国家补贴 + 城镇补贴 + 地区补贴
    let countryBt = 0;
    if (request.bt_country_year >= 1) {
      countryBt = result.nfdl * request.bt_country; // 国家补贴 = 年度电量 * 补贴金额
    }

    let provinceBt = 0;
    if (request.bt_country_year >= 1) {
      provinceBt = result.nfdl * request.bt_province; // 省补贴 = 年度电量 * 补贴金额
    }

    let cityBt = 0;
    if (request.bt_country_year >= 1) {
      cityBt = result.nfdl * request.bt_city; // 地区补贴 = 年度电量 * 补贴金额
    }
    result.bt = countryBt + provinceBt + cityBt;

    // 计算省电收益 = 自用电量 * 居民电价
    const zy_total = result.nfdl * zfzyPercent; // 自用电量= 年度发电 * 自发比例
    result.sd_profit = zy_total * request.jm_price;

    // 计算卖电收益 = 上网电量 * 电网收购电价
    const sw_total = result.nfdl - zy_total; // 上网电量 = 年发电量  - 自用电量
    result.md_profit = sw_total * dwPrice;

    // 总收益 = 首年收益 = 补贴总数 + 省电收益 + 卖电收益
    result.sn_profit = result.bt + result.sd_profit + result.md_profit;
    result.total_profit = result.sn_profit;

    // 首付 = 系统总价 * 贷款期限
    result.sn_pay = result.xtzj * dkPercent;

    // 第一年矩阵
    matrix.query_id = request.openId;
    matrix.seq = 1;
    matrix.year_total = result.nfdl; // 年发电量
    matrix.zy_total = zy_total;// 自用电量
    matrix.sw_total = sw_total; // 上网电量
    matrix.sd_profit = result.sd_profit; // 省点收益
    matrix.md_profit = result.md_profit; // 买电收益
    matrix.bt_country = countryBt; // 国家补贴
    matrix.bt_province = provinceBt; // 省补贴
    matrix.bt_city = cityBt; // 地区补贴ßß
    matrix.bt_total = result.bt; // 总补贴
    matrix.profit_total = result.sn_profit; // 总收益


    // 首付 = 系统总价 * [（1 - 首付比例）* 贷款利率 ] *  [ （1 + 贷款利率）的 贷款年限次方] / [ （1 + 贷款利率）的 贷款年限次方 -1 ]
    if (dkPercent !== 1) {
      result.sn_repay = result.xtzj * (1 - dkPercent) * dkRate * (Math.pow((1 + dkRate), request.dk_year)) / (Math.pow((1 + dkRate), request.dk_year) - 1);
    }
    if (request.dk_year > 1) {
      matrix.dk_total = result.sn_repay;
    } else {
      matrix.dk_total = 0;
    }
    matrix.user_profit = matrix.profit_total - matrix.dk_total; // 用户收益 = 总收益 - 还贷款
    matrix.user_sum_profit = matrix.user_profit;

    matrixList.push(matrix);
    // 25年总收益
    let y25_profit = matrix.profit_total;

    const y25List = [
      { year: '第1年',
        profit: Math.round(matrix.profit_total),
      },
    ];

    for (let i = 2; i <= 25; ++i) {
      const matrix = {};
      matrix.seq = i;
      matrix.year_total = matrixList[i - 2].year_total * (1 - FileType.reduction / 100);
      matrix.zy_total = matrix.year_total * zfzyPercent; // 自用电量
      matrix.sw_total = matrix.year_total - matrix.zy_total; // 上网电量
      matrix.sd_profit = matrix.zy_total * request.jm_price; // 省电收益
      matrix.md_profit = matrix.sw_total * dwPrice; // 卖电收益
      let countryBt = 0;
      if (request.bt_country_year >= i) {
        countryBt = matrix.year_total * request.bt_country; // 国家补贴 = 年度电量 * 补贴金额
      }
      let provinceBt = 0;
      if (request.bt_province_year >= i) {
        provinceBt = matrix.year_total * request.bt_province; // 省补贴 = 年度电量 * 补贴金额
      }
      let cityBt = 0;
      if (request.bt_country_year >= i) {
        cityBt = matrix.year_total * request.bt_city; // 地区补贴 = 年度电量 * 补贴金额
      }
      matrix.bt_country = countryBt;
      matrix.bt_province = provinceBt;
      matrix.bt_city = cityBt;
      matrix.bt_total = countryBt + provinceBt + cityBt; // 总补贴
      matrix.profit_total = matrix.bt_total + matrix.sd_profit + matrix.md_profit; // 总收益

      y25_profit += matrix.profit_total; // 25年总收益

      // 净收益
      if (i <= request.dk_year) {
        matrix.dk_total = result.sn_repay;
      } else {
        matrix.dk_total = 0;
      }
      matrix.user_profit = matrix.profit_total - matrix.dk_total;
      matrix.user_sum_profit = matrix.user_profit + (matrixList[i - 2].user_sum_profit);

      const yearProfit = {
        year: '第' + i + '年',
        profit: Math.round(matrix.profit_total),
      };
      y25List.push(yearProfit);
      matrixList.push(matrix);
    }


    // 四舍五入取整数
    result.nfdl = Math.round(result.nfdl)
    result.xtzj = Math.round(result.xtzj);
    result.sn_profit = Math.round(result.sn_profit);
    result.sn_repay = Math.round(result.sn_repay);
    result.sd_profit = Math.round(result.sd_profit);
    result.md_profit = Math.round(result.md_profit);
    result.bt_total = Math.round(result.bt_total);
    result.y25_profit = Math.round(y25_profit);
    result.total_profit = Math.round(matrixList[24].user_sum_profit); // 25年净收益

    result.y25_list = JSON.stringify(y25List);

    // 保存request
    let isCreatedQuery;
    let queryHistory;
    await this.ctx.model.TblQueryHistory.findOrCreate({
      where: { open_id: request.open_id },
      defaults: request,
    }).spread((model, created) => {
      queryHistory = model.get({ plain: true });
      isCreatedQuery = created;
    });
    if (isCreatedQuery === false) {
      await this.ctx.model.TblQueryHistory.update(request, { where: { open_id: request.open_id } });
    }

    // 保存result
    result.query_id = queryHistory.id;

    let isCreatedResult;
    // let queryResult;
    await this.ctx.model.TblQueryResult.findOrCreate({
      where: { query_id: result.query_id },
      defaults: result,
    }).spread((model, created) => {
      // queryResult = model.get({ plain: true });
      isCreatedResult = created;
    });
    if (isCreatedResult === false) {
      await this.ctx.model.TblQueryResult.update(result, { where: { query_id: result.query_id } });
    }

    return result;

  }
}

module.exports = CalculatorService;
