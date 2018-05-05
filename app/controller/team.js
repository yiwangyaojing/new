'use strict';

const Controller = require('egg').Controller;
const SMSClient = require('@alicloud/sms-sdk');


class TeamController extends Controller {

    /**
     * 发送手机验证码
     */
    async sms() {

        const {ctx, config, app} = this
        const rule = {
            register_phone: {type: 'string', required: true},
            open_id: {type: 'string', required: true},
        };

        const req = ctx.params
        ctx.validate(rule, req);

        // 获取当天的redis序列
        const redisKey = req.open_id + 'validateCode';


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
        //发送短信
        await smsClient.sendSMS({
            PhoneNumbers: req.register_phone,
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
     * 创建公司团队
     */
    async companyCreate() {

        const {ctx, service} = this;

        const req = ctx.request.body;

        const rule = {
            open_id: {type: 'string', required: true},
            register_phone: {type: 'string', required: true}, // 注册手机号
            name: {type: 'string', required: true},
            // oss_name: {type: 'string', required: false, // oss文件名称
            // logo: {type: 'string', required: false},
            validateCode: {type: 'string', required: true}, // 验证码
        };

        ctx.validate(rule, req)

        // 验证码校验
        const redisKey = req.open_id + 'validateCode'
        const num = await this.app.redis.get(redisKey)
        if (!num) {
            throw new Error('验证码已失效!')
        } else {
            if (num !== ctx.request.body.validateCode) {
                throw new Error('验证码不匹配!')
            }
        }
        const result = await service.team.companyCreate(req);

        ctx.body = result;

    }

    /**
     * 获取公司详情
     */
    async index() {

        const {ctx, service} = this
        const req = ctx.params;

        console.log(req)
        const rule = {
            open_id: {type: 'string', required: true}, // 操作人Id
            id: {type: 'string', required: true}, // 公司Id
        }
        ctx.validate(rule, req)

        ctx.body = await service.team.index(req)
    }

    /**
     * 修改公司团队
     */

    async companyUpdate() {
        const {ctx, service} = this

        const req = ctx.request.body;
        req.level = 0

        const rule = {
            id: {type: 'int', required: true}, // 团队id
            name: {type: 'string', required: true}, // 团队名称
            open_id: {type: 'string', required: true}, // 操作人Id
            validateCode: {type: 'string', required: true}, // 验证码
            oss_name: {type: 'string', required: true}, // oss 文件名称
            logo: {type: 'string', required: true}, // logo地址
        };
        ctx.validate(rule, req)
        // 验证码校验
        const redisKey = req.open_id + 'validateCode'
        const num = await this.app.redis.get(redisKey)
        if (!num) {
            throw new Error('验证码已失效!')
        } else {
            if (num !== ctx.request.body.validateCode) {
                throw new Error('验证码不匹配!')
            }
        }
        // 修改公司团队信息
        const result = await  service.team.update(req)

        ctx.body = result

    }

    /**
     * 团队创建
     */
    async create() {

        const {ctx, service} = this

        const req = ctx.request.body;

        const rule = {
            name: {type: 'string', required: true}, // 团队名称
            open_id: {type: 'string', required: true}, // 操作人Id
            level: {type: 'int', required: true}, // 团队等级
            parent_id: {type: 'int', required: true}, // 父级团队ID
            company_id: {type: 'int', required: true}, // 公司团队ID
            company_name: {type: 'string', required: true}, // 公司团队ID
        };

        ctx.validate(rule, req)

        // const agents = {
        //   open_id:{type:'string' ,required:true}, // 成员openId
        //   user_rank:{type:'string' ,required:true}, // 成员角色 1，管理员 2，业务员
        // }


        const result = await service.team.create(req)

        ctx.body = result
    }

    async update() {

        const {ctx, service} = this

        const req = ctx.request.body;
        const rule = {
            id: {type: 'int', required: true}, // 团队id
            name: {type: 'string', required: true}, // 团队名称
            open_id: {type: 'string', required: true}, // 操作人Id
        }

        ctx.validate(rule, req)

        const result = await service.team.update(req)

        ctx.body = result
    }

    /**
     * 解散团队
     */
    async destroy() {

        const {ctx, service} = this
        const req = ctx.params
        const rule = {
            id: {type: 'string', required: true}, // 团队id
            open_id: {type: 'string', required: true}, // 操作人id
        }
        ctx.validate(rule, req)


        const result = await  service.team.destroy(req)

        console.log(result)

        ctx.body = result

    }

    /**
     * 获取用户的所在的所有团队
     */

    async getUserTeam() {
        const {ctx, service} = this
        const req = ctx.params
        const rule = {
            open_id: {type: 'string', required: true}, // 操作人id
        }
        ctx.validate(rule, req)

        ctx.body = await service.team.getUserTeam(req)
    }

}

module.exports = TeamController;
