const Subscription = require('egg').Subscription
const askWechat = require('../util/askWechat')

class UpDateWeChatAccessToken extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: `${60 * 60 * 1.8}s`, // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    for (const key in this.config.weChat) {
      if (this.config.weChat.hasOwnProperty(key)) {
        askWechat.getAccessTokenByAppType(this, key)
      }
    }
  }
}

module.exports = UpDateWeChatAccessToken