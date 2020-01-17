const Controller = require('egg').Controller;

const createRule = {
  title: { type: 'string'}, src_img: { type: 'string'}, side_imgs: { type: 'string'} 
};
 
// post
exports.create = async ctx => {
// 如果校验报错，会抛出异常
  // console.log(ctx.request.body)
  // app.model.User
  const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
  const uid = token.uid
  ctx.validate(createRule, ctx.request.body);
  const { title, src_img, side_imgs} = ctx.request.body;
  const list = await ctx.model.List.create({ title, src_img, side_imgs, user_id: uid, editor_id: 0 });

  // const { session_key, openid, user_id } = ctx.request.body;
  // const user = await ctx.model.Wechat.create({ session_key, openid, user_id });

  ctx.status = 201;
  ctx.body = {...{list}, ...ctx.helper.jsonSuccess()}
};

// get
exports.index = async ctx => {
  const {type, page, size} = ctx.query
  
  const list = await ctx.service.list.getList(type, page, size)

  ctx.body = list
};

// new