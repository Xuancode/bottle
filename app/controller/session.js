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
    // console.log(ctx.request.header)
    ctx.validate(loginRule)

    // 请求微信的session,维护wechat、user表的数据
    const userInfo = await ctx.service.session.getSession(ctx.request.body.wxcode)
    const qiNiuToken = ctx.helper.initQiniuToken()
    
    ctx.body = {...userInfo, qiNiuToken: qiNiuToken}
  }

  async index() {
    const { ctx } = this;
    // 请求微信的session,维护wechat、user表的数据
    // const userInfo = await ctx.service.session.getSession(ctx.request.body.wxcode)
    
    

    ctx.body = {
      yes: 'yes'
    }
  }
};

module.exports = SessionController;