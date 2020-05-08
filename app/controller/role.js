'use strict'

const Controller = require('egg').Controller

// 校验规则
const createRule = {
  label: {
    type: 'string',
    required: true
  },
  idArr: {
    type: 'array',
    required: false
  },
  desc: {
    type: 'string',
    required: false
  },
  state: {
    type: 'number',
    required: false
  }
}
const deleteRule = {
  idArr: {
    type: 'array',
    required: true
  }
}
const updateRule = {
  id: {
    type: 'number',
    required: true
  },
  idArr: {
    type: 'array',
    required: false
  },
  desc: {
    type: 'string',
    required: false
  },
  state: {
    type: 'number',
    required: false
  }
}

class roleController extends Controller {
  async create() {
    const { ctx } = this
    ctx.validate(createRule)
    let {label, idArr, desc} = ctx.request.body
    desc = desc ? desc : ''
    const res = await ctx.service.role.createRole(label, idArr, desc)
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async index() {
    const { ctx } = this
    const { labelStr } = ctx.query
    var res = await ctx.service.role.getPermissionByRole(labelStr)
    ctx.status = 200
    ctx.body = {msg: 'success!', code: 20000, data: res}
  }

  async update() {
    const { ctx } = this
    ctx.validate(updateRule)
    let {label, state, desc, id, idArr} = ctx.request.body

    let tempObj = {label, desc ,state}
    let obj = ctx.helper.fliterUndefinedParams(tempObj)

    const res = await ctx.service.role.updateRolePerminssion(obj, id, idArr)
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async destroy() {
    const { ctx } = this
    ctx.validate(deleteRule)
    const {idArr} = ctx.request.body
    const res = await ctx.service.role.destroyRole(idArr)
    ctx.status = 200
    ctx.body = {msg: 'success!', data: {delete_length: res.length}, code: 20000}
  }
}

module.exports = roleController