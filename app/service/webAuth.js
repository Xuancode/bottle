const Service = require('egg').Service;

const short = require('short-uuid');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class WebAuthService extends Service {
  async getUidByCode(code) {
    const {ctx} = this
    const {appid, secretid} = this.config.weChat[ctx.request.body.type]
    const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secretid}&code=${code}&grant_type=authorization_code`, { method: 'GET', dataType: 'json' })
    let user = null
    if (result.data.errcode) {
      ctx.body = { ...this.app.resCode['REMOTE_ERR'], more_msg: result.data}
      return
    } else {
      user = await ctx.service.webAuth.creatOrUpdateWechatByOpenid(result.data.openid, result.data)
      return user
    }
  }
  
  /**creatOrUpdateWechatByOpenid 后续要使用事务; 返回user */
  async creatOrUpdateWechatByOpenid(openid, data) {
    // 查询wechat、user数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    const {ctx} = this
    const {type} = ctx.request.body
    const {session_key, refresh_token, access_token, unionid} = data
    let tempObj = {session_key, refresh_token, access_token, unionid}
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)

    let res = await ctx.model.Wechat.findOne({
      where: {openid}
    })
    let user = null
    if (res) {
      // 已存在，更新wecaht表
      await ctx.model.Wechat.update({type, ...tempObj}, {where: {openid: openid}})
      user = await ctx.model.User.findOne({where: {user_id: res.user_id}})
    } else {
      // 不存在，新建用户、wechat信息
      let nickName = 'ID' + Math.round(Math.random()*1000000)
      user = await ctx.model.User.create({
        name: nickName,
        user_id: short.generate(),   // 生成唯一id
      })

      wechat = await ctx.model.Wechat.create({
        openid: openid,
        user_id: user.user_id,
        type,
        ...tempObj
      })
    }
    return user
  }
}
module.exports = WebAuthService