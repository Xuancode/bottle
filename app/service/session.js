/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 17:32:18
 * @Description: file content
 * @FilePath: /bottle/app/service/session.js
 */
const Service = require('egg').Service

const short = require('short-uuid')

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}


class SessionService extends Service {
  async miniPlogin(wxcode, type) {
    // 请求小程序服务器拿到session
    const { ctx } = this
    const appid = ctx.app.config.weChat[type].appid
    const secretid = ctx.app.config.weChat[type].secretid
    const result = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretid}&js_code=${wxcode}&grant_type=authorization_code
    `, { dataType: 'json' })
    // 报错处理
    if (!result.data.session_key) {
      console.log("现在懒，交给error_handle处理")
    }

    // 查询wechat是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    await ctx.service.session.createOrUpdateWechat(result.data)
    // 后进行自定义用户体系的登录
    const token = await ctx.service.session.uid2Token(result.data.openid)
    // console
    let data = { token: token }
    return data
  }

  // async getOpenidByCode(code) {
  //   const {ctx} = this
  //   const {appid, secretid} = this.config.weChat['310']
  //   const result = await ctx.curl(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secretid}&code=${code}&grant_type=authorization_code`, { method: 'GET', dataType: 'json' })
  //   let user = null
  //   if (result.data.errcode) {
  //     ctx.body = { ...this.app.resCode['REMOTE_ERR'], more_msg: result.data}
  //   } else {
  //     user = await ctx.service.session.openid2uid(result.data.openid, result.data)
  //     ctx.body = user
  //   }

  // }

  /**openid2uid */
  async createOrUpdateWechat(data) {
    // 查询wechat、user数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    const { ctx } = this
    const { type } = ctx.request.body
    const { session_key, openid } = data
    let tempObj = { session_key }
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)

    let res = await ctx.model.Wechat.findOrCreate({
      where: { openid },
      defaults: {
        openid,
        type,
        ...tempObj
      }
    })
    // 如果新创建,第二个元素为true;已存在为false， 此时要更新
    if (!res[1]) {
      res = await ctx.model.Wechat.update(tempObj, { where: { openid } })
    }
    return res
  }
  /** 初始化token */
  async uid2Token(uid) {
    const ctx = this.ctx
    const data = {
      uid: uid
    }
    const token = await ctx.helper.initToken(data, 60 * 60 * 24 * 7)
    return token
  }

  /**获取当前登录用户的信息 */
  async getUser() {
    const ctx = ctx
    let token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    let uid = token.uid

    let res = await ctx.model.User.findOne({
      // attributes: [],
      where: { user_id: uid }
    })
    return res
  }
}
module.exports = SessionService