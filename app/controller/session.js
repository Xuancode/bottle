'use strict';

const Controller = require('egg').Controller;

// 登录校验规则
const loginRule = {
  wxcode: {
    type: 'string',
  }
};


class SessionController extends Controller {
  async create() {
    const { ctx } = this;
    console.log(ctx.request.body)
    ctx.validate(loginRule)

    // 请求微信的session
    const userInfo = await ctx.service.login.getSession(ctx.request.body.wxcode)
    ctx.body = userInfo
  }
};

module.exports = SessionController;