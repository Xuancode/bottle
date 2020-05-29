'use strict'

const Controller = require('egg').Controller

class YouxinMovieController extends Controller {
  async create() {
    const { ctx } = this
    // ctx.validate(loginRule)
    // link", "pass_code", "admin_id", "introduction
    const {name, link, pass_code, admin_id, introduction} = ctx.request.body

    const res = await ctx.model.Movie.create({name, link, pass_code, admin_id, introduction})
    res.created_at = res.createdAt
    res.updated_at = res.updatedAt
    
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async update() {
    const { ctx } = this
    const {name, link, pass_code, admin_id, introduction, id, state} = ctx.request.body

    let tempObj = {name, link, pass_code, admin_id, introduction, id, state}
    let obj = ctx.helper.fliterUndefinedParams(tempObj)

    const res = await ctx.model.Movie.update(
      obj,
      {where: {id: id}}
    )
    
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async destroy() {
    const { ctx } = this
    const {idArr} = ctx.request.body
    const Op = this.app.Sequelize.Op
    const res = await ctx.model.Movie.destroy(
      {where: {id: {[Op.in]: idArr}}}
    )
    ctx.status = 201
    ctx.body = {msg: 'success!', data: res, code: 20000}
  }

  async uploadExcle() {
    const { ctx } = this
    // ctx.validate(loginRule)
    const {movieArr} = ctx.request.body
    const saveInfo = await ctx.service.youxinMovie.saveMovies(movieArr)
    ctx.status = 201
    ctx.body = {msg: 'success!', code: 20000, data: {length: saveInfo.length}}
    // ctx.body = '123'
  }

  async index() {
    const { ctx } = this
    const {page, size, name, link, pass_code, admin_id, introduction, id, state, sort} = ctx.query
    let tempObj = {link, pass_code, admin_id, introduction, id, state}

    let obj = ctx.helper.fliterFalseParams(tempObj)
    const res = await ctx.service.youxinMovie.getMovie(page, size, name, obj, sort)
    ctx.status = 201
    ctx.body = {msg: 'success!', code: 20000, ...res}
  }

  async checkName() {
    const { ctx } = this
    const { name } = ctx.query
    
    // 查询是否存在该用户，不存在才创建
    let res = await ctx.model.Movie.findOne({
      where: { name }
    })

    ctx.status = 201
    ctx.body = {msg: 'success!', code: 20000, data: res}
  }
}

module.exports = YouxinMovieController;