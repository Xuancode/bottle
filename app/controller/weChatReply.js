'use strict'

const sha1 = require('js-sha1')

const Controller = require('egg').Controller

// 登录校验规则
const loginRule = {
  wxcode: {
    type: 'string',
  }
};

class weChatReplyController extends Controller {
  async create() {

  }

  async index() {
    const { ctx } = this
    const {signature, timestamp, nonce, echostr} = ctx.query
    ctx.logger.info('request_query: %j', ctx.query)
    const token = this.config.youxin.token
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

module.exports = weChatReplyController