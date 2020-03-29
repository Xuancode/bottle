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
  const { content, parents_id, list_id, imgs, is_editor} = ctx.request.body;
  const list = await ctx.model.Comment.create({ content, parents_id, list_id, user_id: uid, imgs, is_editor });
  // 不是给自己评论的视为别人的回答，此时该问题回答数+1
  if (!is_editor) {
    ctx.model.List.findOne({where: {id: list_id}}).then( list => {
      list.increment('answer_times').then(res=> {
        console.log('增加评论次数成功')
      })
    })
  }
  

  ctx.status = 201;
  ctx.body = {...{list}, ...ctx.helper.jsonSuccess()}
};

// get
exports.index = async ctx => {
  const {page, size, list_id} = ctx.query
  let comments = {}
  if (list_id) {
    comments = await ctx.service.comment.getCommentByListID(page, size, list_id)
  } else {
    comments = await ctx.service.comment.getCommentByUID(page, size)
  }
  ctx.body = comments
};

// new