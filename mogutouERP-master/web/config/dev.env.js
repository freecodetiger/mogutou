'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = {
  NODE_ENV: '"development"',
  BASE_API: '"/api/v1"' // 开发环境，使用代理
}
