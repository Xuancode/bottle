'use strict'

const Controller = require('egg').Controller

class permissionController extends Controller {
  async create() {
    const { ctx } = this
    // ctx.validate(loginRule)
    // link", "pass_code", "admin_id", "introduction
    const {label, router, url, parent_id} = ctx.request.body
    let tempObj = {label, router, url, parent_id}
    let obj = ctx.helper.fliterFalseParams(tempObj)
    
    const res = await ctx.model.Permission.create(obj)
    
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async index() {
    const { ctx } = this
    const { admin_id } = ctx.query
    
    const res = await ctx.service.permission.getMenu(admin_id)
    ctx.status = 200
    ctx.body = {msg: 'success!', code: 20000, ...res}
  }

  async update() {
    const { ctx } = this
    let {id, label, router, url, parent_id} = ctx.request.body
    let tempObj = {label, url, router}
    parent_id = parent_id ? parent_id : null
    let obj = ctx.helper.fliterUndefinedParams(tempObj)
    const res = await ctx.model.Permission.update(
      {...obj, parent_id},
      {where: {id: id}}
    )
    
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async destroy() {
    const { ctx } = this
    const {idArr} = ctx.request.body
    const Op = this.app.Sequelize.Op
    const res = await ctx.model.Permission.destroy(
      {where: {id: {[Op.in]: idArr}}}
    )
    ctx.status = 200
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }
}

module.exports = permissionController