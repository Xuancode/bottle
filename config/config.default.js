/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1577612349535_5569';

  // add your middleware config here
  config.middleware = [
    'errorHandler',
    'jwt'
  ];

  // 数据库配置
  config.sequelize = {
    username: "xpl",
    password: "xplhandsome",
    dialect: 'mysql',
    host: '193.112.106.197',
    port: 3306,
    database: 'ps_please_dev',
    define: {
      freezeTableName: true,  // 禁止转换表明，防止自动加s
      underscored: true,
    }
  };

  // 只对 /api 前缀的url生效
  config.errorHandler = {
    match: '/api',
  };

  // 开发过程关闭csrf校验
  config.security = {
    csrf: false
  };

  // 验证插件
  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  // jwt验证
  config.jwt = {
    secret: 'egg-api-jwt',
  };

  // 启用file模式
  config.multipart = {
    mode: 'file',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
