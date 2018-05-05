'use strict';
/**
 * PC端用户登录
 */
const Controller = require('egg').Controller;
const SMSClient = require('@alicloud/sms-sdk');

class LoginController extends Controller {
    /**
     * 发送手机验证码
     */
    async sms() {
        const {ctx, config, app} = this
        const rule = {
            phone: {type: 'string', required: true},
        };

        const req = ctx.params
        ctx.validate(rule, req);

        // 获取当天的redis序列
        const redisKey = req.phone + 'validateCode';


        // 生成5位随机数
        let num = '';
        for (let i = 0; i < 4; i++) {
            num += Math.floor(Math.random() * 10);
        }

        console.log("validate_code:", num)

        // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
        const accessKeyId = config.sms.client.accessKeyId
        const secretAccessKey = config.sms.client.accessKeySecret
        const signName = config.sms.client.signName
        const templateCode = config.sms.client.templateCode
        const param = config.sms.client.param

        //初始化sms_client
        let smsClient = new SMSClient({accessKeyId, secretAccessKey})
        发送短信
        await smsClient.sendSMS({
            PhoneNumbers: req.phone,
            SignName: signName,
            TemplateCode: templateCode,
            TemplateParam: '{"' + param + '":"' + num + '"}'
        }).then(function (res) {
            let {Code} = res
            if (Code === 'OK') {
                // 处理返回参数 保存随机数值redis中  失效时间10分钟
                app.redis.set(redisKey, num, 'EX', 60 * 10);
                ctx.body = {message: '验证码发送成功！'}
            }
        }, function (err) {
            ctx.body = {message: '验证码发送失败 ！'}
            console.log(err)
        })

        await app.redis.set(redisKey, num, 'EX', 60 * 10);
        console.log("验证码发送成功！ ---------" + req.phone + "-------------->>>", num)
        ctx.body = {
            code: num
        }
    }

    /**
     * 用户登录
     */
    async userLogin() {
        const {ctx, service} = this;
        console.log(" ctx.request-------------->>>",  ctx.request)
        const req = ctx.request.body;

        const rule = {
            phone: {type: 'string', required: true}, // 注册手机号
            validateCode: {type: 'string', required: true}, // 验证码
        };

        ctx.validate(rule, req)

        // 验证码校验
        const redisKey = req.phone + 'validateCode'
        const num = await this.app.redis.get(redisKey)
        if (!num) {
            throw new Error('验证码已失效!')
        } else {
            if (num !== ctx.request.body.validateCode) {
                throw new Error('验证码不匹配!')
            }
        }

        let phone = req.phone;

        const userInfo = await service.user.findByPhone(phone);
        console.log("userInfo", userInfo)
        if(!userInfo){
            throw new Error('找不到该电话的用户!')
        }else {
            ctx.body = userInfo;
        }
    }
}

module.exports = LoginController;