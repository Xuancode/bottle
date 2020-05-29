'use strict';

const Controller = require('egg').Controller

class RoomController extends Controller {
  async create() {
    const {ctx} = this
  }
  async index() {
    const {ctx} = this
  }
  async canSee() {
    const {ctx} = this
    const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    const uid = token.uid
    const {type} = ctx.request.query
    const isFocus = await ctx.service.askWechat.getFocusStatusByUid(uid, type)
    if (isFocus) {
      ctx.body = { ...this.app.resCode['SUCCESS'], data: isFocus}
    } else {
      // 查询访问该页面多少次了（按210类型算）
      const typeArr = [type]
      const readTimes = await ctx.service.loginRecord.countTimes(uid, typeArr)
      if (readTimes > 2) {
        ctx.body = { ...this.app.resCode['SUCCESS&NOT'], data: {times: readTimes}}
      } else {
        ctx.body = { ...this.app.resCode['SUCCESS'],data: {times: readTimes}}
      }
    }
  }
}

module.exports = RoomController