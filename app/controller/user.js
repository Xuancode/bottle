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
 
// post
exports.create = async ctx => {
// 如果校验报错，会抛出异常
  ctx.validate(createRule);
  ctx.body = ctx.request.body;
};

// get
exports.index = async ctx => {
  console.log(ctx.query.id)
  ctx.body = {
    name: `hello ${ctx.query.id}`,
  };
};

// new