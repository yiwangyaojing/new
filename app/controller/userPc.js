'use strict';

const Controller = require('egg').Controller;


class UserPC extends Controller {
  // PUT /api/user
    /**
     * 修改个人信息
     */
    async update() {
        const {ctx, service} = this

        const rule = {
            open_id: {type: 'string', required: true},
            name: {type: 'string', required: true},
            phone: {type: 'string', required: false},
            validateCode: {type: 'string', required: false},
        }
        const req = ctx.request.body

        ctx.validate(rule, req)

        let param = {
            name: req.name,
            phone: req.phone
        }
        try{
            //验证码校验
            if (!await service.sms.doValidate(req.open_id, req.validateCode)) {
                return;
            }
        }catch(e){
            throw e;
        }

        const result = await  service.user.updateParams(param, req.open_id)

        ctx.body = result;
    }

}

module.exports = UserPC;
