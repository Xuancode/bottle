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
    'jwt',    // jwt验证
    'httpLog',  // 日志增加请求rul信息
    'errorHandler',
  ];

  // 从 `Node.js 性能平台` 获取对应的接入参数
  config.alinode = {
    appid: '84157',
    secret: 'f8557da52f1d6d10afbae3d41156af9e2b0c0764',
  };

  // 只对 /api 前缀的url生效
  config.errorHandler = {
    match: '/api',
  };

  // 验证插件
  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  // jwt验证
  config.jwt = {
    enable: true,
    ignore: [ '/api/v1/session'], // 哪些请求不需要认证
  };

  // 启用file模式
  config.multipart = {
    mode: 'file',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 微信配置
  config.wechat = {
    appid: 'wxe1eed4b0094c75ed',
    secretid: '2d9dd090f267c5478a83227c784d4e30'
  };

  return {
    ...config,
    ...userConfig,
  };
};
