'use strict';

const Controller = require('egg').Controller

class RoomController extends Controller {
  async create() {
    const { ctx } = this
  }
  async index() {
    const { ctx } = this
  }
  async canSee() {
    const { ctx } = this
    const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    const uid = token.uid
    const { type, countType } = ctx.request.query
    let userRes = await ctx.model.User.findOne({ where: { user_id: uid } })
    const isFocus = await ctx.service.askWechat.getFocusStatusByUser(userRes, type)
    if (isFocus) {
      ctx.body = { ...this.app.resCode['SUCCESS'], data: isFocus }
    } else {
      // 查询访问该页面多少次了（按所有210类型算，目前仅有211）
      const typeArr = ['211']
      const readTimes = await ctx.service.loginRecord.unauthTimes(userRes, typeArr)
      if (readTimes > 2) {
        ctx.body = { ...this.app.resCode['SUCCESS&NOT'], data: { times: readTimes } }
      } else {
        ctx.body = { ...this.app.resCode['SUCCESS'], data: { times: readTimes } }
      }
    }
  }
}

module.exports = RoomController