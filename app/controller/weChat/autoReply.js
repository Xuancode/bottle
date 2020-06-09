/*
 * @Author: xuanpl
 * @Date: 2020-06-07 10:40:20
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-09 15:51:23
 * @Description: 微信自动回复的路由
 * @FilePath: /bottle/app/controller/weChat/autoReply.js
 */

'use strict'

const Controller = require('egg').Controller

const createRule = {
  question: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  hot: {
    required: false,
    type: 'number'
  },
  state: {
    required: false,
    type: 'string'
  }
}
const searchRule = {
  item_id: {
    required: true,
    type: 'string'
  }
}

class autoReplyController extends Controller {
  async create() {
    const { ctx } = this
    ctx.validate(createRule, ctx.request.body)
    const { question, content, item_id, hot, state } = ctx.request.body
    let tempObj = { question, content, item_id, hot, state }
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    let res = await ctx.model.Reply.create({ ...tempObj, admin_id: ctx.uid })
    res.created_at = res.createdAt
    res.updated_at = res.updatedAt
    ctx.body = { ...this.app.resCode['SUCCESS'], data: res }
  }

  async update() {
    const { ctx } = this
    const { question, content, hot, state, id } = ctx.request.body

    let tempObj = { question, content, hot, state }
    let obj = ctx.helper.fliterUndefinedParams(tempObj)

    const res = await ctx.model.Reply.update(
      obj,
      { where: { id: id } }
    )

    ctx.body = { ...this.app.resCode['SUCCESS'], data: res }
  }

  async destroy() {
    const { ctx } = this
    const { idArr } = ctx.request.body
    const Op = this.app.Sequelize.Op
    const res = await ctx.model.Reply.destroy(
      { where: { id: { [Op.in]: idArr } } }
    )
    ctx.body = { ...this.app.resCode['SUCCESS'], data: res }
  }

  async uploadExcle() {
    const { ctx } = this
    const { replyArr } = ctx.request.body
    const saveInfo = await ctx.service.autoReply.saveReplys(replyArr)

    ctx.body = { ...this.app.resCode['SUCCESS'], data: { length: saveInfo ? saveInfo.length : 0 } }
  }

  async index() {
    const { ctx } = this
    ctx.validate(searchRule, ctx.query)
    const { page, size, question, content, admin_id, hot, state, id, sort, is_fuzzy } = ctx.query
    const item_id = parseInt(ctx.query.item_id)
    let tempObj = { question, content, item_id, admin_id, hot, state, id }

    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    const res = await ctx.service.autoReply.getReply(page, size, question, tempObj, sort, is_fuzzy)
    ctx.status = 201
    ctx.body = { ...this.app.resCode['SUCCESS'], ...res }
  }

  async checkName() {
    const { ctx } = this
    const { question } = ctx.query

    // 查询是否存在该问题，不存在才创建
    let res = await ctx.model.Movie.findOne({
      where: { question }
    })

    ctx.status = 201
    ctx.body = { msg: 'success!', code: 20000, data: res }
  }
}

module.exports = autoReplyController