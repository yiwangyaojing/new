'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1521168656806_9590';

    // add your config here
    config.middleware = [];
    config.redis = {
        client: {
            port: 6379, // Redis port
            host: '120.26.102.228', // Redis host
            password: 'None',
            db: 0,
        },
    };

    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        database: 'xiaosolar_development',
        host: 'rm-uf6g4eg5i62q13010ho.mysql.rds.aliyuncs.com',
        port: '3306',
        username: 'xiaosolar_dev_user',
        password: 'aiy1ohqu0Yopheet',
    };
    // config.sequelize = {
    //   dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    //   database: 'xiaosolar_test',
    //   host: 'rm-uf6g4eg5i62q13010ho.mysql.rds.aliyuncs.com',
    //   port: '3306',
    //   username: 'xiaosolar_test_user',
    //   password: 'ooMoo8wun0etaaso',
    // };
    config.security = {
        csrf: {
            enable: false,
            // ignoreJSON: true,
            useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
            cookieName: 'apicsrfToken', // Cookie 中的字段名，默认为 csrfToken
            sessionName: 'apicsrfToken', // Session 中的字段名，默认为 csrfToken
            headerName: 'x-csrf-token', // Session 中的字段名，默认为 csrfToken
        },
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
            signName: '光伏好销售',
            templateCode: 'SMS_132095605',
            param: 'code',
        },
    };
    config.wechat = {
        appId: 'wx6441dd4482409ffb',
        secret: 'cf5450752f7639a753f57acaa796da7d',
        openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session',
    };
    // yk本地开发
    /* config.wechat = {
       appId: 'wx0c878877bf2012f7',
       secret: '07bab2ddd65628a535fb529b7b02e422',
       openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session',
     };*/
    return config;
};
