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
        const req = ctx.request.body
        ctx.validate(rule, req);
        ctx.body = await service.sms.sendValidateCode(req.phone,req.phone, "SMS_134240358");
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
        try{
            //验证码校验
            if (!await service.sms.doValidate(req.phone, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }
        const userInfo = await service.user.findByPhone(phone);

        if (!userInfo) {
            throw new Error('当前用户不存在!')
        } else {
            ctx.body = userInfo;
            console.log(ctx.session.maxAge)
            ctx.session.user = userInfo
        }
    }

    async logout(){
        // 销毁登录
        this.ctx.session.user = null;
        this.ctx.body = { message: '退出成功' };
    }
}

module.exports = LoginController;