'use strict';

const Controller = require('egg').Controller

class WebAuthController extends Controller {
  async create() {
    const {ctx} = this
    const res = await ctx.service.webAuth.getUserByCode(ctx.request.body.code)
    if (!res.user || !res.union) {
      return
    }
    const data = {user_id: res.user.user_id, unionid: res.union.unionid}
    // 记录本次登录服务号，视作用户登录
    await ctx.service.loginRecord.createRecord(data)
    // 记录下本次未登录访问. 1、视作通过H5，未登录而访问了订阅号万事通的扫码看房： 211
    await ctx.service.loginRecord.createUnauthRecord(data)

    const token = await ctx.service.session.uid2Token(res.user.user_id)
    ctx.body = {...this.app.resCode['SUCCESS'], data: {token}}
  }

  async index() {
    const {ctx} = this
    // let wechatRes = await ctx.model.Admin.findAll({include: [{model: ctx.model.Role}]})
    // let wechatRes = await ctx.model.Wechat.findAll({include: [{ model: ctx.model.Union}]})
    // let wechatRes = await ctx.model.Union.findAll({include: [{model: ctx.model.User}]})
    // let wechatRes = await ctx.model.Union.findAll({include: [{ model: ctx.model.User}]})
    let wechatRes = await ctx.model.Union.findOne({ include: [{model: ctx.model.Wechat, where: {openid: 'o5YPb0faazTBCFOzf6weDBD-ZM8U'}}]})
    ctx.body = wechatRes
  }
};

module.exports = WebAuthController