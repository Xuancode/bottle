const Service = require('egg').Service

const short = require('short-uuid');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class WebAuthService extends Service {
  async getUserByCode(code) {
    const { ctx } = this
    const { appid, secretid } = this.config.weChat[ctx.request.body.type]
    const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secretid}&code=${code}&grant_type=authorization_code`, { method: 'GET', dataType: 'json' })
    let userAndUnion = null
    if (result.data.errcode) {
      ctx.body = { ...this.app.resCode['REMOTE_ERR'], more_msg: result.data }
      return
    } else {
      result.data.type = ctx.request.body.type
      userAndUnion = await ctx.service.webAuth.creatOrUpdateWechatByHasUnionid(result.data.openid, result.data)
      return userAndUnion
    }
  }

  /**creatOrUpdateWechatByHasUnionid 后续要使用事务; 返回user */
  async creatOrUpdateWechatByHasUnionid(openid, data) {
    // 查询wechat数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    const { ctx } = this
    const { session_key, refresh_token, access_token, is_focus, type, unionid } = data
    let tempObj = { session_key, refresh_token, access_token, is_focus, type }
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    let wechatRes = await ctx.model.Wechat.findOne({ where: { openid } })

    // 事务开始
    let transaction = null
    let unionRes = null
    let userRes = null
    try {
      transaction = await this.ctx.model.transaction()
      // 已存在，更新wecaht表, 不存在则新建
      if (wechatRes) {
        await ctx.model.Wechat.update({ ...tempObj }, { where: { openid } }, { transaction })
      } else {
        wechatRes = await ctx.model.Wechat.create({ openid, ...tempObj }, { transaction })
      }
      // 不存在union则新建
      unionRes = await ctx.model.Union.findOne({ where: { unionid } }, { transaction })
      // 按照设计，有union一定关联了user；没有union还要新建user并且关联
      if (!unionRes) {
        unionRes = await ctx.model.Union.create({ unionid }, { transaction })
        userRes = await ctx.model.User.create({ name: ctx.service.user.createNickName(), user_id: ctx.service.user.createUid() }, { transaction })
        await unionRes.setUsers([userRes], { transaction })
        // union关联wechat
        await unionRes.addWechat(wechatRes, { transaction })
        // 关联user
      } else {
        // 判断wechat和union是否关联，若没有则关联
        let linkWechat = await unionRes.getWechats({ where: { openid } }, { transaction })
        if (!(linkWechat && linkWechat.length > 0)) {
          await unionRes.addWechat(wechatRes, { transaction })
        }
        userRes = await unionRes.getUsers({ transaction })
        userRes = userRes[0]
      }

      await transaction.commit()
    } catch (err) {
      console.log(err)
      await transaction.rollback()
      ctx.body = { ...this.app.resCode['ERROR'], msg: '新建失败' }
      throw new Error(err)
    }
    return { user: userRes, union: unionRes }
  }

  createUserByUnionid() {

  }
}
module.exports = WebAuthService