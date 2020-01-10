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

    // 查询wechat、user数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    // openid = '7777777'
    let res = await this.ctx.model.Wechat.findOne({
      where: {openid}
    })
    if (res) {
      // 已存在，更新wecaht表
      console.log(new Date())
      const wechatRes = await this.ctx.model.Wechat.update({session_key: session_key}, {where: {openid: openid}})
      uid = res.user_id
    } else {
      // 不存在，新建用户、wechat信息
      let userRes = await this.ctx.model.User.create({
        name: name ? name : null,
        phone: phone ? phone : null
      })
      uid = userRes.id

      await this.ctx.model.Wechat.create({
        session_key: session_key,
        openid: openid,
        user_id: userRes.id
      })
    }

    // 后进行自定义用户体系的登录
    const token = await this.ctx.service.session.login(uid)
    // console
    return token;
  }

  async login(uid) {
    const data = {
      uid: uid
    }
    const token = await this.ctx.helper.initToken(data, 7200)
    return token
  }
}
module.exports = SessionService;