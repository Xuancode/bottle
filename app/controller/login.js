'use strict';

const Controller = require('egg').Controller;

// 登录校验规则
const loginRule = {
  userName: {
    type: 'string',
  },
  passWord: {
    type: 'string',
  }
};

class LoginController extends Controller {
  async create() {
    const { ctx } = this
    const oldToken = ctx.request.header.authorization ? ctx.request.header.authorization.split(' ')[1] : null // 如果登陆之前存在token，则加入黑名单
    ctx.validate(loginRule)
    const {userName, passWord } = ctx.request.body
    let res = await this.ctx.model.Admin.findOne({
      where: {
        user_name: userName,
        pass_word: passWord
      }
    })

    if (res) {
      const data = {
        uid: res.admin_id
      }
      const token = await this.ctx.helper.initToken(data, 60 * 60 * 24 * 7)
      // 有旧token则加入黑名单
      if (oldToken) {
        ctx.model.TokenBlacklist.create({token: oldToken})
      }
      ctx.status = 201;
      ctx.body = {code: 20000, msg: 'success!', ...{data: res}, ...{token}}
    } else {
      ctx.status = 401;
      ctx.body = ctx.helper.jsonError()
    }
  }
  async logout() {
    const { ctx } = this
    const token = ctx.request.header.authorization.split(' ')[1]
    if (token) {
      ctx.model.TokenBlacklist.create({token: token})
      ctx.body = {code: 20000, msg: '注销成功'}
    } else {
      ctx.body = {code: 40100, msg: '未登录'} 
    }
  }
};

module.exports = LoginController;