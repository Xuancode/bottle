const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class AskWechatService extends Service {
  async getFocusStatusByUser(user, type) {
    const { ctx } = this

    const { appid, secretid } = this.config.weChat[ctx.query.type]
    try {
      const unionRes = await user.getUnions()
      var wxUser = await unionRes[0].getWechats({ where: { type } })
    } catch (error) {
      throw new Error(error)
    }
    // const wxUser = await ctx.model.Wechat.findOne({where: {user_id: uid, type: type, is_focus: 1}})
    if (!wxUser || !wxUser[0]) {
      return false
    }
    const result = await this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ctx.app.Cache.get(type)}&openid=${wxUser[0].openid}&lang=zh_CN`, { method: 'GET', dataType: 'json' })
    if (result.errcode || !result.data.subscribe) {
      return false
    } else {
      return result
    }
  }
}
module.exports = AskWechatService