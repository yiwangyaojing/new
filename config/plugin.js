'use strict';

// had enabled by egg
// exports.static = true;
exports.session = true;
// 开启校验
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
exports.oss = {
  enable: true,
  package: 'egg-oss',
  useAgent: true,
};
// exports.alinode = {
//   enable: true,
//   package: 'egg-alinode',
//   env: [ 'test', 'prod' ],
// };
