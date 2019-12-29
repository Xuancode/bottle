const Controller = require('egg').Controller;

const createRule = {
  username: {
    type: 'email',
  },
  password: {
    type: 'password',
    compare: 're-password',
  },
};
  
exports.create = async ctx => {
// 如果校验报错，会抛出异常
  ctx.validate(createRule);
  ctx.body = ctx.request.body;
};

class UserController extends Controller {
  async info() {
    const { ctx } = this;
    ctx.body = {
      name: `hello ${ctx.params.id}`,
    };
  }
}

module.exports = UserController;
