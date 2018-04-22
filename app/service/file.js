'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const FileType = require('../const/FileType');

class FileService extends Service {

  async index() {
    const files = await this.ctx.model.XFiles.findAll({ where: { source_type: FileType.IndexSliderAd }, order: [[ 'sort', 'DESC' ]] });
    return files;
  }

  async create(plan, files, sourceType) {

    const { ctx, config } = this;
    const cfg = config.sequelize;
    cfg.logging = false;
    const sequelize = new Sequelize(cfg);

    let _result = 0;

    // 清除排板子oss文件
    if(sourceType === 5){
      const file = await ctx.model.XFiles.findOne({where :{plan_id:plan.id,source_type:sourceType}})
      if(file){
        await this.ctx.oss.delete(file.oss_file_name);
      }
    }

    // 清除历史数据
    await ctx.model.XFiles.destroy({ where: { plan_id: plan.id, source_type: sourceType } });



    await sequelize.transaction(function(t) {
      return ctx.model.XFiles.bulkCreate(files, { transaction: t }).then(function() {
        return ctx.model.XPlans.update(plan, { where: { id: plan.id } }, { transaction: t });
      });
    }).then(function(result) {
      _result = result[0];
    }).catch(function(err) {
      console.log(err);
    });

    return _result;

  }

  async destory(params) {
    const rowid = params.id;
    const oss_file_name = params.oss_file_name;
    let resp = 0;
    if (rowid) {
      // const file = await  this.ctx.model.XFiles.findOne({where: {id: rowid}})
      const result = await this.ctx.model.XFiles.destroy({ where: { id: rowid } });
      if (result[0] >= 1) {
        resp = await this.ctx.oss.delete(oss_file_name);
      }
    } else {
      resp = await this.ctx.oss.delete(oss_file_name);
    }

    return resp;
  }

  // 更新
  async update(plan, files) {

    const { ctx, config } = this;

    let _result = 0;

    if (files && files.length > 0) {
      const cfg = config.sequelize;
      cfg.logging = false; // 实例化 sequelize 时 logging异常，设置为false
      const sequelize = new Sequelize(cfg);

      await sequelize.transaction(function(t) {
        return ctx.model.XFiles.bulkCreate(files, { transaction: t }).then(function() {
          return ctx.model.XPlans.update(plan, { where: { id: plan.id } }, { transaction: t });
        });
      }).then(function(result) {
        _result = result[0];
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      const result = await ctx.model.XPlans.update(plan, { where: { id: plan.id } });
      _result = result[0];
    }

    return _result;
  }

  async findBySource(params) {
    return await this.ctx.model.XFiles.findAll({ where: { plan_id: params.plan_id, open_id:params.open_id, source_type: params.source_type } });
  }

  /**
   * 根据类型查询文件列表，并按sort排序
   * @param {string} sourceType 类型
   * @return {Promise<*>} 文件列表
   */
  async queryFilesOrderByType(sourceType) {
    let files = await this.ctx.model.XFiles.findAll({ where: { source_type: sourceType },
      order: [[ 'sort', 'DESC' ]] });
    if (files === null || files.length === 0) {
      files = [];
    }
    return files;
  }
}

module.exports = FileService;
