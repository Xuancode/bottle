const Controller = require('egg').Controller;

const createRule = {
  content: { type: 'string'}, imgs: { type: 'string'} 
};
 
// post
exports.create = async ctx => {
// 如果校验报错，会抛出异常
  // console.log(ctx.request.body)
  // app.model.User
  const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
  const uid = token.uid
  ctx.validate(createRule, ctx.request.body);
  const { content, parents_id, list_id, imgs} = ctx.request.body;
  const list = await ctx.model.Comment.create({ content, parents_id, list_id, user_id: uid, imgs, is_editor });
  ctx.model.List.findOne({where: {id: list_id}}).then( list => {
    list.increment('answer_times').then(res=> {
      console.log('增加评论次数成功')
    })
  })

  ctx.status = 201;
  ctx.body = {...{list}, ...ctx.helper.jsonSuccess()}
};

// get
exports.index = async ctx => {
  const {type, page, size} = ctx.query
  
  const list = await ctx.service.Comment.getList(type, page, size)

  ctx.body = list
};

// new