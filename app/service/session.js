const Service = require('egg').Service;

const short = require('short-uuid');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class SessionService extends Service {
  async getSession(wxcode) {
    // 请求小程序服务器拿到session
    const appid = this.config.wechat.appid;
    const secretid = this.config.wechat.secretid;
    const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretid}&js_code=${wxcode}&grant_type=authorization_code
    `, { dataType: 'json' });
    // 报错处理
    if (!result.data.session_key) {
      console.log("现在懒，交给error_handle处理")
    }
    // console.log(result)
    var {session_key, openid} = result.data;
    var name = '', phone = ''
    var uid = ''
    var user = {}

    // 查询wechat、user数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    // openid = '7777777'
    let res = await this.ctx.model.Wechat.findOne({
      where: {openid}
    })
    if (res) {
      // 已存在，更新wecaht表
      // console.log(new Date())
      const wechatRes = await this.ctx.model.Wechat.update({session_key: session_key}, {where: {openid: openid}})
      user = await this.ctx.model.User.findOne({where: {user_id: res.user_id}})
    } else {
      // 不存在，新建用户、wechat信息
      let nickName = 'ID' + Math.round(Math.random()*1000000)
      let userRes = await this.ctx.model.User.create({
        name: name ? name : nickName,
        phone: phone ? phone : 0,
        user_id: short.generate(),   // 生成唯一id
        avatar: 'http://tmp/wx27d8d47c69b319c9.o6zAJs6qwYjcD2peZNWp1gl52NO0.TA4nkxQbZf2597eff96b8dcb35a2f032b04e5043f3d3.png'
      })
      user = userRes

      await this.ctx.model.Wechat.create({
        session_key: session_key,
        openid: openid,
        user_id: userRes.user_id
      })
    }
    uid = user.user_id
    // 后进行自定义用户体系的登录
    const token = await this.ctx.service.session.login(uid)
    // console
    let data = {token: token,user_info: user}
    return data;
  }

  /** 初始化token */
  async login(uid) {
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