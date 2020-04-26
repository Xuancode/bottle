'use strict'

const sha1 = require('js-sha1')

const Controller = require('egg').Controller

// 登录校验规则
const loginRule = {
  wxcode: {
    type: 'string',
  }
};

class TempController extends Controller {
  async create() {
    const {ctx} = this
    ctx.body = {
      "code": 20000,
      "data": {
          "token": "admin-token"
      }
  }
  }

  async index() {
    const {ctx} = this
    ctx.body = {
      "code": 20000,
      "data": {
          "roles": [
              "admin"
          ],
          "introduction": "I am a super administrator",
          "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          "name": "Super Admin"
      }
  }
  }
};

module.exports = TempController;