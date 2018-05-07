'use strict';

const Service = require('egg').Service;
const SMSClient = require('@alicloud/sms-sdk');

class SmsService extends Service {

    /**
     * 短信发送验证码
     * @param phone 手机号
     * @param templateCode 模板
     * @returns {Promise<*>}
     */
    async sendValidateCode(phone, templateCode) {
        let redisKey = phone + "validateCode";
        const {app, config} = this;
        let existCode = await app.redis.get(redisKey);
        let num = '';
        // 存在则继续使用原有的
        if (existCode != null) {
            num = existCode;
        } else {
            // 生成5位随机数
            for (let i = 0; i < 4; i++) {
                num += Math.floor(Math.random() * 10);
            }
        }

        const accessKeyId = config.sms.client.accessKeyId;
        const secretAccessKey = config.sms.client.accessKeySecret;
        const signName = config.sms.client.signName;
        const param = config.sms.client.param;
        console.log(param, num);
        //初始化sms_client
        let smsClient = new SMSClient({accessKeyId, secretAccessKey});
        let retval = {message: '验证码发送成功！'};
        //发送短信
        await smsClient.sendSMS({
            PhoneNumbers: phone,
            SignName: signName,
            TemplateCode: templateCode,
            TemplateParam: '{"' + param + '":"' + num + '"}'
        }).then(function (res) {
            let {Code} = res;
            if (Code === 'OK') {
                // 处理返回参数 保存随机数值redis中  失效时间10分钟
                app.redis.set(redisKey, num, 'EX', 60 * 10);
            }
        }, function (err) {
            console.log(err)
            retval = {message: '短信发送失败！'}
        });
        return retval;
    }

    /**
     * 校验验证码是否正确，正确后，会清空缓存
     * @param phone
     * @param validateCode
     * @returns {Promise<void>}
     */
    async  doValidate(phone, validateCode) {
        const {app, config} = this;
        let redisKey = phone + "validateCode";
        const num = await this.app.redis.get(redisKey);
        if (!num) {
            throw new Error('验证码已失效或不存在!')
        } else {
            if (num !== validateCode) {
                throw new Error('验证码不匹配!')
            }
        }
        await  this.app.redis.del(redisKey);
        return true;
    }

}

module.exports = SmsService;
