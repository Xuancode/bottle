'use strict'

const sha1 = require('js-sha1')

const Controller = require('egg').Controller

// 登录校验规则
const loginRule = {
  wxcode: {
    type: 'string',
  }
};

class YouxinController extends Controller {
  async create() {
    // const { ctx } = this;
    // // ctx.validate(loginRule)

    // // 请求微信的session,维护wechat、user表的数据
    // const userInfo = await ctx.service.session.getSession(ctx.request.body.wxcode)
    
    // ctx.body = {...userInfo}
  }

  async index() {
    const { ctx } = this
    const {signature, timestamp, nonce, echostr} = ctx.query
    ctx.logger.info('request_query: %j', ctx.query)
    const token = this.config.youxin.token;
    let Arr = [token, timestamp, nonce]
    Arr.sort()
    let str = '' + Arr[0] + Arr[1] + Arr[2]
    let mysignature = sha1(str)
    if (mysignature == signature) {
        ctx.body = echostr
    } else {
        ctx.body = '错误'
    }
  }
};

module.exports = YouxinController;