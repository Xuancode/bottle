'use strict';

const Controller = require('egg').Controller

class AskWechatController extends Controller {
  async focusStatus() {
    // const {ctx} = this
    // const resUser = await ctx.service.webAuth.getUidByCode(ctx.request.body.code)
    // if (!resUser) {
    //   return
    // }
    // const token = await ctx.service.session.uid2Token(resUser.user_id)
    // ctx.body = {...this.app.resCode['SUCCESS'], data: {token}}
  }
}

module.exports = AskWechatController