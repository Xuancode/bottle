/*
 * @Author: xuanpl
 * @Date: 2020-05-12 15:56:20
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-11 18:02:52
 * @Description: file content
 * @FilePath: /bottle/app/controller/item.js
 */
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
    const { item_name, item_info } = ctx.request.body
    const admin_id = ctx.uid
    ctx.logger.info('admin_id是: %j', ctx.uid)
    var res = await ctx.service.item.createItem(item_name, item_info, admin_id)

    ctx.status = 201
    ctx.body = { msg: 'success!', data: res, code: 20000 }
  }

  async index() {
    const { ctx } = this
    const { page, size, item_name } = ctx.query
    var res = await ctx.service.item.getItem(page, size, item_name)

    ctx.status = 200
    ctx.body = { msg: 'success!', code: 20000, ...res }
  }

  async update() {
    const { ctx } = this
    ctx.validate(updateRule, ctx.request.body)
    let { item_id, item_name, admin_id, item_info, state, is_delete } = ctx.request.body

    let tempObj = { item_name, admin_id, item_info, state, is_delete }
    let obj = ctx.helper.fliterUndefinedParams(tempObj)
    const res = await ctx.service.item.updateItem(obj, item_id)
    ctx.status = 201
    ctx.body = { msg: 'success!', data: res, code: 20000 }
  }

  async destroy() {
    const { ctx } = this
    ctx.validate(deleteRule, ctx.request.body)
    const { idArr } = ctx.request.body
    const res = await ctx.service.item.destroyItem(idArr)
    ctx.status = 200
    ctx.body = { msg: 'success!', data: { delete_length: res }, code: 20000 }
  }
}

module.exports = itemController