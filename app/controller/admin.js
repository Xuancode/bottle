'use strict'

const short = require('short-uuid')

const Controller = require('egg').Controller

// 创建管理员校验规则
const adminRule = {
  name: {
    type: 'string',
  },
  phone: {
    type: 'string',
  },
  user_name: {
    type: 'string',
  },
  pass_word: {
    type: 'string',
  },
  role_id: {
    type: 'array',
    required: false
  },
  item_id: {
    type: 'array',
    required: false
  }
}
const updateRule = {
  name: {
    type: 'string',
  },
  phone: {
    type: 'string',
  },
  user_name: {
    type: 'string',
  },
  pass_word: {
    type: 'string',
  },
  role_id: {
    type: 'array',
    required: false
  },
  item_id: {
    type: 'array',
    required: false
  }
}
const deleteRule = {
  idArr: {
    type: 'array',
    required: true
  }
}

class AdminController extends Controller {
  async create() {
    const { ctx } = this;
    ctx.validate(adminRule, ctx.request.body)
    const {user_name, pass_word, name, avatar, phone, role_id, item_id} = ctx.request.body
    const admin_id = short.generate()

    // 查询是否存在该用户，不存在才创建
    const Op = this.app.Sequelize.Op
    let adminRes = await ctx.model.Admin.findOne({
      where: {[Op.or]: [{user_name: user_name}]}
    })
    if (adminRes) {
      ctx.status = 409
      ctx.body = {...ctx.helper.jsonError()}
      return
    }
    const res = await ctx.service.admin.createAdmin({ user_name, pass_word, name, avatar, phone, admin_id}, role_id, item_id)
    // const res = await ctx.model.Admin.create()
    ctx.status = 201
    ctx.body = { code: 20000, ...{data: res}, ...ctx.helper.jsonSuccess()}
  }

  async index() {
    const { ctx } = this
    const {page, size, user_name} = ctx.query
    let admin = null
    if (page && size) {
      admin = await ctx.service.admin.getAdmin(page, size)
      ctx.body = {...admin, code: 20000, ...ctx.helper.jsonSuccess()}
    } else if (user_name) {
      admin = await ctx.service.admin.getAdminByUserName(user_name)
      if (admin) {
        ctx.body = {data: admin, code: 20000, ...ctx.helper.jsonSuccess()}
      } else {
        ctx.body = {msg: '不存在用户', code: 20000}
      }
      
    } else {
      // 该方法把token中获取的uid传入
      admin = await ctx.service.admin.getAdminByToken(ctx.uid)
      ctx.body = {...admin, code: 20000, ...ctx.helper.jsonSuccess()}
    }
  }

  async update() {
    const { ctx } = this
    ctx.validate(updateRule)
    let {user_name, pass_word, name, avatar, phone, id, role_id, item_id} = ctx.request.body

    let tempObj = { user_name, pass_word, name, avatar, phone }
    let obj = ctx.helper.fliterUndefinedParams(tempObj)

    const res = await ctx.service.admin.updateAdmin(obj, id, role_id, item_id)
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async destroy() {
    const { ctx } = this
    ctx.validate(deleteRule)
    const {idArr} = ctx.request.body
    const res = await ctx.service.admin.destroyAdmin(idArr)
    ctx.status = 200
    ctx.body = {code: 20000, msg: 'success!', data: res}
  }
};

module.exports = AdminController