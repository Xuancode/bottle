const Subscription = require('egg').Subscription

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
    const appid = this.config.wechat.appid
    const secret = this.config.wechat.secretid
    const res = await this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`, {
      dataType: 'json',
      method: 'GET'
    })
    if (res && res.data && res.data.access_token) {
      this.ctx.app.Cache.set('weChatAccessToken', res.data.access_token, 60 * 60 * 2) // 官方2小时有效
    }
    console.log(this.ctx.app.Cache.get('weChatAccessToken'))
  }
}

module.exports = UpDateWeChatAccessToken