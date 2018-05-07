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
        const req = ctx.request.body;

        const rule = {
            phone: {type: 'string', required: true}, // 注册手机号
            validateCode: {type: 'string', required: true}, // 验证码
        };

        ctx.validate(rule, req)

        let phone = req.phone;
        if(!await service.sms.doValidate(phone,req.validateCode)){
            return;
        }
        const userInfo = await service.user.findByPhone(phone);

        if (!userInfo) {
            throw new Error('当前用户不存在!')
        } else {
            ctx.body = userInfo;
        }
    }
}

module.exports = LoginController;