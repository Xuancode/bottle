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

const getRule = {
  size: {
    type: 'string',
  },
  page: {
    type: 'string',
  },
  type: {
    type: 'string'
  }
};
 
// post
exports.create = async ctx => {
// 如果校验报错，会抛出异常
  console.log(ctx.request.body)
  // app.model.User

  const { title, src_img, side_imgs, is_delete, user_id, editor_id} = ctx.request.body;
  const list = await ctx.model.List.create({ title, src_img, side_imgs, is_delete, user_id, editor_id });

  // const { session_key, openid, user_id } = ctx.request.body;
  // const user = await ctx.model.Wechat.create({ session_key, openid, user_id });

  ctx.status = 201;
  ctx.body = list;
};

// get
exports.index = async ctx => {
  // console.log(type, page, size)
  // ctx.validate(getRule, ctx.query)
  const {type, page, size} = ctx.query
  
  console.log(type, page, size)
  
  const list = await ctx.service.list.getList(type, page, size)


  ctx.body = list
};

// new