'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const https = require('https');

class FeedbackService extends Service {

  async create(req) {

    let resp;

    const ctx = this.ctx;

    if (req.type === 1) {
      const files = req.files;
      for (const file of files) {
        file.open_id = req.open_id;
      }

      const feedback = {};
      feedback.open_id = req.open_id;
      feedback.content = req.content;
      feedback.type = req.type;

      const cfg = this.config.sequelize;
      cfg.logging = false;
      const sequelize = new Sequelize(cfg);

      await sequelize.transaction(function(t) {
        return ctx.model.Feedback.create(feedback, { transaction: t }).then(function(result0) {
          for (const file of files) {
            file.source_id = result0.id;
          }
          return ctx.model.XFiles.bulkCreate(files, { transaction: t });
        });
      }).then(function(result) {
        // 往钉钉群发反馈内容
        let str = '';
        for (let i = 0; i < result.length; i++) {
          str = str + result[i].url + ' \n\n';
        }
        const dingContent = {};
        dingContent.msgtype = 'text';
        dingContent.text = {};
        dingContent.text.content = '特殊房型备注:\n' + feedback.content + ' \n图片链接:\n' + str;
        const dingContentJson = JSON.stringify(dingContent);
        const options = {
          host: 'oapi.dingtalk.com',
          port: 443,
          path: '/robot/send?access_token=7247d2d3db4442f12692d8af53dfe9eeb06f6d5ad4058280b0a9fb951a5fd754',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        };
        const dingReq = https.request(options, res => {
          res.setEncoding('utf8');
          res.on('data', data => {
            console.log('data:', data);
          });
        });
        dingReq.write(dingContentJson);
        dingReq.end();
        resp = result;
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      resp = await this.ctx.model.Feedback.create(req);
      // 往钉钉群发送反馈内容
      const dingContent = {};
      dingContent.msgtype = 'text';
      dingContent.text = {};
      dingContent.text.content = '联系方式:\n' + req.phone + ' \n意见和建议:\n' + req.content;
      const dingContentJson = JSON.stringify(dingContent);
      const options = {
        host: 'oapi.dingtalk.com',
        port: 443,
        path: '/robot/send?access_token=7247d2d3db4442f12692d8af53dfe9eeb06f6d5ad4058280b0a9fb951a5fd754',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      };
      const dingReq = https.request(options, res => {
        res.setEncoding('utf8');
        res.on('data', data => {
          console.log('data:', data);
        });
      });
      dingReq.write(dingContentJson);
      dingReq.end();
    }

    return resp;

  }

  async photovoltaicCreate(data){

      if (data.contactsName.length > 50) {
          this.sign_fail('用户名字长度不能超过50')
          return  '用户名字长度不能超过50'
      }
      if (data.contactsText.length > 5000) {
          this.sign_fail('留言过长')
          return '留言过长'
      }
      if (data.contactsPlone.length > 50) {
          this.sign_fail('用户手机号长度不能超过50')
          return '用户手机号长度不能超过50'
      }
      if (data.teamName.length > 50) {
          this.sign_fail('公司名字长度不能超过50')
          return '公司名字长度不能超过50'
      }
      let info = await this.ctx.model.XPhotovoltaic.create(data);
      return info
  }
}

module.exports = FeedbackService;
