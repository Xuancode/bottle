'use strict';

const Controller = require('egg').Controller

class WebAuthController extends Controller {
  async create() {
    const {ctx} = this
    const resUser = await ctx.service.webAuth.getUserByCode(ctx.request.body.code)
    if (!resUser) {
      return
    }
    // 记录下本次登录记录，视作通过H5，登录了订阅号万事通订阅号： 210
    const data = {user_id: resUser.user_id}
    const recordRes = await ctx.service.loginRecord.createRecord(data)

    const token = await ctx.service.session.uid2Token(resUser.user_id)
    ctx.body = {...this.app.resCode['SUCCESS'], data: {token}}
  }

  async index() {
    const {ctx} = this
    
  }
};

module.exports = WebAuthController