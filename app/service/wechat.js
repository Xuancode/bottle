const Service = require('egg').Service;
class WeChatService extends Service {
  /**
   * 设置关注、取消关注状态，该表状态不严格准确，严格准确还需要询问微信服务器
   * @param openid
   * @param status 0或1
   */
  async setFocus(openid, type, status) {
    const { ctx } = this
    let data = { is_focus: status, type }
    const wxUser = await this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${this.config.weChat['type']}&openid=${openid}&lang=zh_CN`, {
      dataType: 'json',
      method: 'GET'
    })
    if (wxUser && wxUser.unionid) {
      data.unionid = unionid
    }

    const userAndUnion = await ctx.service.webAuth.creatOrUpdateWechatByHasUnionid(openid, data)
    // const resUser = await ctx.service.wechat.creatOrUpdateWechatByUidAndType(openid, type, data)
    return userAndUnion
  }

  async setUnFocus(openid, type, status) {
    const { ctx } = this
    await ctx.model.Wechat.findOrcreate({ where: { openid }, defaults: { openid, type, is_focus: status } })
  }

  /** 返回成功或失败的布尔值 */
  async creatOrUpdateWechatByUidAndType(openid, type, data) {
    // 查询wechat数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    const { ctx } = this
    const { session_key, refresh_token, access_token, unionid, is_focus } = data // 表里的所有非索引数据
    let tempObj = { session_key, refresh_token, access_token, unionid, is_focus, type, openid }
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    let res = await ctx.model.Wechat.findOne({
      where: { user_id: ctx.uid, type, openid }
    })
    let user = null
    if (res) {
      // 已存在，更新wecaht表
      await ctx.model.Wechat.update({ ...tempObj }, { where: { user_id: ctx.uid, type, openid } })
      // user = await ctx.model.User.findOne({where: {user_id: res.user_id}})
      return true
    } else {
      // 不存在，新建wechat信息
      await ctx.model.Wechat.create({
        openid,
        user_id: ctx.uid,
        ...tempObj
      }, { transaction })
      // try {

      //   await transaction.commit()
      //   return true
      // } catch (error) {
      //   await transaction.rollback()
      //   ctx.body = {...this.app.resCode['ERROR'], msg: '新建失败'}
      //   return false
      // }
    }
  }
}
module.exports = WeChatService