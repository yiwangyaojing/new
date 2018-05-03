'use strict'
const merge = require('webpack-merge')
const uatEnv = require('./uat.env')

module.exports = merge(uatEnv, {
  NODE_ENV: '"uat"',
  CONTEXT: '""',
  CONTEXT_HTML : '""'
})
