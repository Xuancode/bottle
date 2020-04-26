'use strict'

const short = require('short-uuid')

const Controller = require('egg').Controller

// 创建管理员校验规则
const loginRule = {
  name: {
    type: 'string',
  },
  phone: {
    type: 'string',
  },
  permission: {
    type: 'string',
  },
  user_name: {
    type: 'string',
  },
  pass_word: {
    type: 'string',
  }
};

class AdminController extends Controller {
  async create() {
    const { ctx } = this;
    ctx.validate(loginRule, ctx.request.body)
    const {user_name, pass_word, name, avatar, phone, permission} = ctx.request.body
    const admin_id = short.generate()

    // 查询是否存在该用户，不存在才创建
    const Op = this.app.Sequelize.Op
    let adminRes = await ctx.model.Admin.findOne({
      where: {[Op.or]: [{user_name: user_name}, {name: name}]}
    })
    if (adminRes) {
      ctx.status = 409
      ctx.body = {...ctx.helper.jsonError()}
      return
    }
    const res = await ctx.model.Admin.create({ user_name, pass_word, name, avatar, phone, permission, admin_id})
    ctx.status = 201
    ctx.body = {...{data: res.dataValues}, ...ctx.helper.jsonSuccess()}
  }

  async index() {
    const { ctx } = this
    const {page, size} = ctx.query
    const admins = await ctx.service.admin.getAdmin(page, size)
    ctx.status = 201
    ctx.body = {...admins, ...ctx.helper.jsonSuccess()}
  }
};

module.exports = AdminController