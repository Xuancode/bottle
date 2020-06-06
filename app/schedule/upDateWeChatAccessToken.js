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
    // const appid = this.config.weChat['110'].appid
    // const secret = this.config.weChat['110'].secretid

    for (const key in this.config.weChat) {
      if (this.config.weChat.hasOwnProperty(key)) {
        const ele = this.config.weChat[key]
        this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ele.appid}&secret=${ele.secretid}`, {
          dataType: 'json',
          method: 'GET'
        }).then(res => {
          this.ctx.logger.info(res)
          if (res && res.data && res.data.access_token) {
            this.ctx.app.Cache.set(key, res.data.access_token, 60 * 60 * 2) // 官方2小时有效
          }
        }).catch(err => {
          throw new Error(err)
        })
      }
    }
  }
}

module.exports = UpDateWeChatAccessToken