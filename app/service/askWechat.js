const Service = require('egg').Service
const askWechat = require('../util/askWechat')

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
    console.log(wxUser)
    // const wxUser = await ctx.model.Wechat.findOne({where: {user_id: uid, type: type, is_focus: 1}})
    if (!wxUser || !wxUser[0]) {
      return false
    }
    const result = await askWechat.getUserInfo(this, type, wxUser[0].openid)
    ctx.logger.info('result.data: %j', result)
    console.log(result)
    if (!result.subscribe) {
      return false
    } else {
      return result
    }
  }
}
module.exports = AskWechatService