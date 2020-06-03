const Service = require('egg').Service;

const short = require('short-uuid');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class SessionService extends Service {
  async miniPlogin(wxcode) {
    // 请求小程序服务器拿到session
    const appid = this.config.weChat['110'].appid;
    const secretid = this.config.weChat['110'].secretid;
    const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretid}&js_code=${wxcode}&grant_type=authorization_code
    `, { dataType: 'json' })
    // 报错处理
    if (!result.data.session_key) {
      console.log("现在懒，交给error_handle处理")
    }
    // console.log(result)
    var uid = ''
    var user = {}

    // 查询wechat、user数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    // openid = '7777777'
    user = await this.ctx.service.session.openid2uid(result.data.openid, result.data)
    uid = user.user_id
    // 后进行自定义用户体系的登录
    const token = await this.ctx.service.session.uid2Token(uid)
    // console
    let data = {token: token,user_info: user}
    return data
  }

  // async getOpenidByCode(code) {
  //   const {ctx} = this
  //   const {appid, secretid} = this.config.weChat['310']
  //   const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secretid}&code=${code}&grant_type=authorization_code`, { method: 'GET', dataType: 'json' })
  //   let user = null
  //   if (result.data.errcode) {
  //     ctx.body = { ...this.app.resCode['REMOTE_ERR'], more_msg: result.data}
  //   } else {
  //     user = await ctx.service.session.openid2uid(result.data.openid, result.data)
  //     ctx.body = user
  //   }

  // }
  
  /**openid2uid */
  async openid2uid(openid, data) {
    // 查询wechat、user数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    const {ctx} = this
    const {type} = ctx.request.body
    const {session_key, refresh_token, access_token, unionid} = data
    let tempObj = {session_key, refresh_token, access_token, unionid}
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    console.log(tempObj)

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
      let userRes = await ctx.model.User.create({
        name: ctx.service.user.createNickName(),
        user_id: ctx.service.user.createUid()   // 生成唯一id
      })
      user = userRes

      await ctx.model.Wechat.create({
        openid: openid,
        user_id: userRes.user_id,
        type,
        ...tempObj
      })
    }
    return user
  }
  /** 初始化token */
  async uid2Token(uid) {
    const data = {
      uid: uid
    }
    const token = await this.ctx.helper.initToken(data, 60 * 60 * 24 * 7)
    return token
  }

  /**获取当前登录用户的信息 */
  async getUser() {
    const ctx = this.ctx 
    let token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    let uid = token.uid

    let res = await ctx.model.User.findOne({
      // attributes: [],
      where: {user_id: uid}
    })
    return res
  }
}
module.exports = SessionService;