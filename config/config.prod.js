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
      host: 'redis', // Redis host
      password: 'ShLjyF7VI5wrzNIYjx52zR09CiGWMaGx',
      db: 0,
    },
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'xiaosolar_production',
    host: 'rm-uf6g4eg5i62q13010.mysql.rds.aliyuncs.com',
    port: '3306',
    username: 'xiaosolar_prod_user',
    password: 'boob2xohWiquahh1',
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
      accessKeyId: 'LTAIgXzy1bL842zP',
      accessKeySecret: 'GHDW2xWNpl0wxHvw3aJFuE4sJJ2OKY',
      bucket: 'haoxiaoshou',
      endpoint: 'oss-cn-shanghai.aliyuncs.com',
      timeout: '60s',
    },
  };
  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '17138',
    secret: '5669934ac33e5e5a4862e814deb87547efaba5f6',
  };
  config.wechat = {
    appId: 'wx6441dd4482409ffb',
    secret: 'cf5450752f7639a753f57acaa796da7d',
    openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  };
  return config;
};
