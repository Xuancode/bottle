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
    const { ctx } = this;
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
        uid: res.user_id
      }
      const token = await this.ctx.helper.initToken(data, 60 * 60 * 24 * 7)
      ctx.status = 201;
      ctx.body = {code: 20000, msg: 'success!', ...{data: res}, ...{token}}
    } else {
      ctx.status = 401;
      ctx.body = ctx.helper.jsonError()
    }
  }
};

module.exports = LoginController;