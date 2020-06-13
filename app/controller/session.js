/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 17:31:06
 * @Description: file content
 * @FilePath: /bottle/app/controller/session.js
 */
'use strict';

const Controller = require('egg').Controller;

// 登录校验规则
const loginRule = {
  wxcode: {
    type: 'string',
    required: true
  },
  type: {
    type: 'number',
    required: true
  },
  deviceType: {
    type: 'number',
    required: true
  }
}

class SessionController extends Controller {
  async create() {
    const { ctx } = this;
    // console.log(ctx.request.header)
    ctx.validate(loginRule)
    const { wxcode, type } = ctx.request.body
    // 请求微信的session,维护wechat、user表的数据
    const userInfo = await ctx.service.session.miniPlogin(wxcode, type)
    console.log(userInfo)
    ctx.body = userInfo
  }

  async index() {
    const { ctx } = this;
    // 请求微信的session,维护wechat、user表的数据
    const userInfo = await ctx.service.session.getUser()



    ctx.body = userInfo
  }
};

module.exports = SessionController;