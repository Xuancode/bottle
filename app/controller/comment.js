const Controller = require('egg').Controller;

const createRule = {
  content: {
    type: 'string',
  },
  parents_id: {
    type: 'number',
  },
  list_id: {
    type: 'number',
  },
  completed_img: {
    type: 'string',
    allowNull: true
  }
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
  const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
  const uid = token.uid
  ctx.validate(createRule, ctx.request.body);
  const { content, parents_id, list_id, completed_img} = ctx.request.body;
  
  const comment = await ctx.model.Comment.create({ content, parents_id, list_id, completed_img, user_id: uid});
  console.log(comment)
  // const { session_key, openid, user_id } = ctx.request.body;
  // const user = await ctx.model.Wechat.create({ session_key, openid, user_id });

  ctx.status = 201;
  ctx.body = comment;
};

// get
exports.index = async ctx => {
  const {type, page, size} = ctx.query
  
  // const list = await ctx.service.Comment.getList(type, page, size)

  ctx.body = list
};

// new