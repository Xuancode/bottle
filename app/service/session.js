const Service = require('egg').Service;

const appid = 'wx27d8d47c69b319c9';
const secretid = '3f27f2bb063daf2782fb754b5468c422';

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class SessionService extends Service {
  async getSession(wxcode) {
    // 请求小程序服务器拿到session
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
    console.log(res)
    if (res) {
      // 已存在，更新wecaht表
      // console.log(new Date())
      const wechatRes = await this.ctx.model.Wechat.update({session_key: session_key}, {where: {openid: openid}})
      user = await this.ctx.model.User.findOne({where: {id: res.user_id}})
    } else {
      // 不存在，新建用户、wechat信息
      let nickName = 'ID' + Math.round(Math.random()*1000000)
      let userRes = await this.ctx.model.User.create({
        name: name ? name : nickName,
        phone: phone ? phone : '',
        avatar: 'http://tmp/wx27d8d47c69b319c9.o6zAJs6qwYjcD2peZNWp1gl52NO0.TA4nkxQbZf2597eff96b8dcb35a2f032b04e5043f3d3.png'
      })
      user = userRes

      await this.ctx.model.Wechat.create({
        session_key: session_key,
        openid: openid,
        user_id: userRes.id
      })
    }
    uid = user.id
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
    const token = await this.ctx.helper.initToken(data, 7200)
    return token
  }

  /**获取当前登录用户的信息 */
  async getUser() {
    const ctx = this.ctx 
    let token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    let uid = token.uid

    let res = await ctx.model.User.findOne({
      // attributes: [],
      where: {id: uid}
    })
    console.log(res)
    return res
  }
}
module.exports = SessionService;