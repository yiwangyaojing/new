'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1521168656806_9590';

    // add your config here
    config.middleware = [ 'adminAuthHandler' ];

    config.adminAuthHandler = {
        // 只针对这个路径开头的请求做拦截
        match: '/api/pc',
    };

    // add your config here
    config.redis = {
        client: {
            port: 6379, // Redis portn
            host: '120.26.102.228', // Redis host
            password: 'None',
            db: 0,
        },
    };
    config.session = {
        key: "EGG_SESSION",
        maxAge: 8* 60 * 60 * 1000, // 8h
        httpOnly: true,
        encrypt: false
    };
    //本地开发
    // config.sequelize = {
    //     dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    //     database: 'crm_development',
    //     host: 'rm-uf6g4eg5i62q13010ho.mysql.rds.aliyuncs.com',
    //     port: '3306',
    //     username: 'crm_dev_user',
    //     password: '1q2w3e4r',
    // };
    //线上生产
    // config.sequelize = {
    //   dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    //   database: 'crm_production',
    //   host: 'rm-uf6g4eg5i62q13010ho.mysql.rds.aliyuncs.com',
    //   port: '3306',
    //   username: 'crm_prod_user',
    //   password: '1q2w3e4r',
    // };
    //线上测试
    config.sequelize = {
      dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
      database: 'crm_test',
      host: 'rm-uf6g4eg5i62q13010ho.mysql.rds.aliyuncs.com',
      port: '3306',
      username: 'crm_test_user',
      password: '1q2w3e4r',
    };
    config.cors = {
        allowMethods:['GET','HEAD','PUT','POST','DELETE','OPTIONS'],
        credentials: true,
    };
    config.security = {
        csrf: {
            enable: false,
            // ignoreJSON: true,
            useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
            cookieName: 'apicsrfToken', // Cookie 中的字段名，默认为 csrfToken
            sessionName: 'apicsrfToken', // Session 中的字段名，默认为 csrfToken
            headerName: 'x-csrf-token', // Session 中的字段名，默认为 csrfToken
        },
        domainWhiteList: [ 'localhost:8003','web.xiaosolar.com' ,'web.xiaosolar.cn','mpa.xiaosolar.com','mp.xiaosolar.com','mpa.xiaosolar.cn','mp.xiaosolar.cn','crm.xiaosotech.com']
    };
    config.oss = {
        client: {
            accessKeyId: 'LTAIKWs1kELOi15p',
            accessKeySecret: 'YSSLU7Rcl35cVZtSy7VeKPrI5KcHno',
            bucket: 'haoxiaoshou-test',
            endpoint: 'oss-cn-shanghai.aliyuncs.com',
            timeout: '60s',
        },
    };
    config.sms = {
        client: {
            accessKeyId: 'LTAIJq3IvPywFWPH',
            accessKeySecret: 'KT0AIH0RL4sYNd5efvcBklnjrR27n7',
            signName: '好销售CRM',
            templateCode: 'SMS_132095605',
            param: 'code',
        },
    };
    config.wechat = {
        // appId: 'wx6441dd4482409ffb',
        // secret: 'cf5450752f7639a753f57acaa796da7d',
        appId: 'wx352e48c1b3170cfe',
        secret: '9882b566eb6fb40a5d27a44256c00384',
        openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session',

        qrAppId :'wxc63276646e2fe762',
        qrSecret:'f1b0306f9af3b2adfbdef176500f4631',
        accessTokenUrl:'https://api.weixin.qq.com/sns/oauth2/access_token'
    };
    config.httpAuth = {
        username: 'marvel_comics',
        password: 'Xiaosolar2018',
        // match: '/api',
        // which routes you want to ignore this middleware
        // ignore: ''
        // match: (ctx) {
        // }
    };
    config.onerror = {
        html(err, ctx) {
            // html hander
            ctx.body =  err.message;
            ctx.status = 500;
            console.error(err)
        },
        json(err, ctx) {
            // json hander
            ctx.body = { message: err.message };
            ctx.status = 500;
        },
        accepts(ctx) {
            if (ctx.get('x-requested-with') === 'XMLHttpRequest') return 'json';
            return 'html';
        }
    };
    return config;
};
