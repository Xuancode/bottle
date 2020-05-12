'use strict'

const Controller = require('egg').Controller

// 校验规则
const createRule = {
  item_name: {
    type: 'string',
    required: true
  },
  item_info: {
    type: 'string',
    required: true
  }
}
const deleteRule = {
  idArr: {
    type: 'array',
    required: true
  }
}
const updateRule = {
  item_id: {
    type: 'number',
    required: true
  },
  item_name: {
    type: 'string',
    required: false
  },
  admin_id: {
    type: 'string',
    required: false
  },
  item_info: {
    type: 'string',
    required: false
  },
  state: {
    type: 'number',
    required: false
  },
  is_delete: {
    type: 'number',
    required: false
  }
}

class itemController extends Controller {
  async create() {
    const { ctx } = this
    ctx.validate(createRule, ctx.request.body)
    const {item_name, item_info, admin_id} = ctx.request.body
    var res = await ctx.service.item.createItem(item_name, item_info, admin_id)

    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async index() {
    const { ctx } = this
    const { page, size, id } = ctx.query
    var res = await ctx.service.item.getItem(page, size, id)

    ctx.status = 200
    ctx.body = {msg: 'success!', code: 20000, ...res}
  }

  async update() {
    const { ctx } = this
    ctx.validate(updateRule, ctx.request.body)
    let {item_id, item_name, admin_id, item_info, state, is_delete} = ctx.request.body

    let tempObj = {item_name, admin_id, item_info, state, is_delete}
    let obj = ctx.helper.fliterUndefinedParams(tempObj)

    const res = await ctx.service.item.updateItem(obj, item_id)
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async destroy() {
    const { ctx } = this
    ctx.validate(deleteRule, ctx.request.body)
    const {idArr} = ctx.request.body
    const res = await ctx.service.role.destroyRole(idArr)
    ctx.status = 200
    ctx.body = {msg: 'success!', data: {delete_length: res.length}, code: 20000}
  }
}

module.exports = itemController