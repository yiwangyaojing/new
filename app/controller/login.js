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
        const {ctx, config, app, service} = this
        const rule = {
            phone: {type: 'string', required: true},
        };
        const req = ctx.params
        ctx.validate(rule, req);
        ctx.body = await service.sms.sendValidateCode(req.phone, "SMS_132095605");
    }

    /**
     * 用户登录
     */
    async userLogin() {
        const {ctx, service} = this;
        console.log(" ctx.request-------------->>>", ctx.request)
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
            throw new Error('验证码已失效或不存在!')
        } else {
            if (num !== ctx.request.body.validateCode) {
                throw new Error('验证码不匹配!')
            }
        }

        let phone = req.phone;

        const userInfo = await service.user.findByPhone(phone);
        this.app.redis.del(redisKey);
        if (!userInfo) {
            throw new Error('当前用户不存在!')
        } else {
            ctx.body = userInfo;
        }
    }
}

module.exports = LoginController;