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
    database: 'xiaotaiyang',
    host: '120.26.102.228',
    port: '3306',
    username: 'root',
    password: 'accp',
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
  };
  config.oss = {
    client: {
      accessKeyId: 'LTAIITaDqD9Hm8UM',
      accessKeySecret: 'FaiTHiasmIWPpLkTHADH9jAj0iLv6K',
      bucket: 'xiqaiotest',
      endpoint: 'oss-cn-shanghai.aliyuncs.com',
      timeout: '60s',
    },
  };
  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '17139',
    secret: 'f3c6470786273314ae9b0464278de4ab84f8d303',
  };
  /* config.wechat = {
    appId: 'wx6441dd4482409ffb',
    secret: 'cf5450752f7639a753f57acaa796da7d',
    openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  };*/
  // yk本地开发
  config.wechat = {
    appId: 'wx0c878877bf2012f7',
    secret: '07bab2ddd65628a535fb529b7b02e422',
    openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  };
  return config;
};
