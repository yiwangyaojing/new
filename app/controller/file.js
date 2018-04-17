'use strict';

const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');
const path = require('path');
const moment = require('moment');
const FileType = require('../const/FileType');

class FileController extends Controller {
  // GET /api/file
  async index() {
    this.ctx.body = await this.ctx.service.file.index();
  }

  // 保存对应的 file信息
  async create() {

    const { ctx, service } = this;

    const rule = {
      plan_id: { type: 'int', required: true },
      open_id: { type: 'string', required: true },
      source_type: { type: 'int', required: true },
    };
    const req = ctx.request.body;

    ctx.validate(rule, req);
    // 获取用户对应的方案信息
    const plan = await service.plans.detail(req.plan_id);
    if (req.source_type === 2) {
      plan.h_is_finish = 1; // 更改拍房子状态及备注
      plan.h_face = req.h_face;
      plan.h_remark = req.remark;
    } else if (req.source_type === 3) { // 更改收资料状态及备注
      plan.d_is_finish = 1;
      plan.d_remark = req.remark;
    } else if (req.source_type === 5) { // 排板子资料上传
      plan.rf_is_finish = 1;
      plan.rf_remark = req.remark;
    }

    // 遍历files
    const tmpFiles = [];
    for (const file of req.files) {
      let tmpFile;
      console.log('this is file ====>>', file, typeof file);
      if (typeof file === 'object') {
        tmpFile = file;
      } else {
        tmpFile = JSON.parse(file);
      }
      tmpFile.created_at = new Date();
      console.log('this is tmpFile ====>>', tmpFile, tmpFile.created_at);
      tmpFile.plan_id = req.plan_id;
      tmpFile.open_id = req.open_id;
      tmpFiles.push(tmpFile);
    }
    // 保存file以及更新plan
    const body = await service.file.create(plan, tmpFiles, req.source_type);

    ctx.body = body;

  }

  // 上传oss服务器
  async upload() {

    const ctx = this.ctx;

    const context = FileType.OssContext; // 根目录
    const today = moment(new Date()).format('YYYYMMDD'); // 服务器时间
    let seq = await this.app.redis.get(today); // 获取当天的redis序列
    if (!seq) {
      // 失效时间12小时
      await this.app.redis.pipeline().set(today, 12, 'EX', 60 * 60 * 12).get(today)
        .exec(function(err, result) {
          seq = result[1][1];
        });
    }
    const stream = await ctx.getFileStream();
    const fileName = path.basename(stream.filename);
    const source_type = encodeURIComponent(stream.fields.source_type);
    const data_type = encodeURIComponent(stream.fields.data_type);
    const filePath = context + '/' + today + '/' + source_type + '/' + data_type + '/' + seq + '/' + fileName;

    let url = '';
    let mini_url = '';
    const bucket = this.config.oss.client.bucket;
    let size = '';
    // 文件处理，上传到云存储等等
    let result;
    try {
      result = await ctx.oss.put(filePath, stream);
      url = result.url;
      mini_url = url + '?x-oss-process=image/resize,w_750';
      size = result.size;
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }

    await this.app.redis.set(today, ++seq, 'EX', 60 * 60 * 12);

    const resp = {};

    resp.file_name = fileName;
    resp.oss_file_name = filePath;
    resp.source_type = parseInt(source_type);
    resp.data_type = parseInt(data_type);
    resp.url = url;
    resp.mini_url = mini_url;
    resp.size = size;
    resp.bucket = bucket;

    ctx.body = resp;

  }

  /**
   * 修改
   */
  async update() {
    const { ctx, service } = this;

    const rule = {
      plan_id: { type: 'int', required: true },
      source_type: { type: 'int', required: true },
      open_id: { type: 'string', required: true },
    };
    const req = ctx.request.body;

    ctx.validate(rule, req);

    // 获取用户对应的方案信息
    const plan = await service.plans.detail(req.plan_id);
    if (req.source_type === 2) {
      plan.h_is_finish = 1; // 更改拍房子状态及备注
      plan.h_face = req.h_face;
      plan.h_remark = req.remark;
    } else if (req.source_type === 3) { // 更改收资料状态及备注
      plan.d_is_finish = 1;
      plan.d_remark = req.remark;
    } else if (req.source_type === 5) { // 排板子资料上传
      plan.rf_is_finish = 1;
      plan.rf_remark = req.remark;
    }


    // 遍历files
    const tmpFiles = [];
    for (const file of req.files) {
      let tmpFile;
      console.log('this is file ====>>', file, typeof file);
      if (typeof file === 'object') {
        tmpFile = file;
      } else {
        tmpFile = JSON.parse(file);
      }
      tmpFile.created_at = new Date();
      console.log('this is tmpFile ====>>', tmpFile, tmpFile.created_at);
      tmpFile.plan_id = req.plan_id;
      tmpFile.open_id = req.open_id;
      tmpFiles.push(tmpFile);
    }

    ctx.body = service.file.update(plan, tmpFiles);

  }

  async destory() {

    const ctx = this.ctx;
    const rule = {
      id: { type: 'int', required: false },
      oss_file_name: { type: 'string', required: true },
    };

    ctx.validate(rule, ctx.request.body);

    ctx.body = await this.service.file.destory(ctx.request.body);
  }

  // 查看项目详情
  async detail() {
    const { ctx, service } = this;

    const rule = {
      plan_id: { type: 'string', required: true },
      source_type: { type: 'string', required: true },
    };
    ctx.validate(rule, ctx.params);

    ctx.body = await service.file.findBySource(ctx.params);

  }
  // 查询首页滚动图片列表
  async queryIndexSliderAd() {
    const files = await this.ctx.service.file.queryFilesOrderByType(FileType.IndexSliderAd);
    const result = [];
    files.forEach(item => {
      result.push({ id: item.id, url: item.url, linkUrl: item.mini_url, sort: item.sort });
    });
    this.ctx.body = result;
  }


}

module.exports = FileController;

