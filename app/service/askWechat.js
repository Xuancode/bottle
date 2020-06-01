const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class AskWechatService extends Service {
  async getFocusStatusByUid(uid, type) {
    const {ctx} = this

    const {appid, secretid} = this.config.weChat[ctx.query.type]
    const wxUser = await ctx.model.Wechat.findOne({where: {user_id: uid, type: type, is_focus: 1}})
    if (!wxUser) {
      return false
    }
    const result = await this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ctx.app.Cache.get(type)}&openid=${wxUser.openid}&lang=zh_CN`, { method: 'GET', dataType: 'json' })
    return result
  }
}
module.exports = AskWechatService