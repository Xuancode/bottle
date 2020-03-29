// 本地开发环境会将本文件的配置合并到默认配置
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

  // 数据库配置
  config.sequelize = {
    username: "xpl",
    password: "xplhandsome",
    dialect: 'mysql',
    host: '193.112.106.197',
    port: 3306,
    database: 'main_data',
    timezone: '+08:00',
    define: {
      freezeTableName: true,  // 禁止转换表明，防止自动加s
      underscored: true,
    },
    logging: false  // 关闭sql输出
  };

  // 启动配置
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '0.0.0.0', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
    }
  };

  config.security = {
    csrf: false,    // 关闭csrf校验
    domainWhiteList:['http://localhost:8080', 'http://molitown.cn', 'https://molitown.cn', 'http://192.168.0.108:8080'],     // 跨域白名单
  };

  return {
    ...config
  };
};
