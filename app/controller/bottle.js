const Controller = require('egg').Controller;

const createRule = {
  text: { type: 'string'}, number: { type: 'number'}
};
 
// post
exports.create = async ctx => {
// 如果校验报错，会抛出异常
  const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
  const uid = token.uid
  ctx.validate(createRule, ctx.request.body)
  const { text, number, id} = ctx.request.body
  console.log(text, number, uid)
  var data = await ctx.model.Bottle.create({ text, number, user_id: uid})

  // 返回所有数据
  data = await ctx.service.bottle.getBottle(1, 999)

  ctx.status = 201
  ctx.body = {...{data}, ...ctx.helper.jsonSuccess()}
}

// get
exports.index = async ctx => {
  const {page, size} = ctx.query
  const data = await ctx.service.bottle.getBottle(page, size)
  ctx.status = 201
  ctx.body = {data, ...ctx.helper.jsonSuccess()}
}

// put
exports.update = async ctx => {
  // 如果校验报错，会抛出异常
  ctx.validate(createRule, ctx.request.body)
  const { text, number, id} = ctx.request.body
  var data = await ctx.model.Bottle.update(
    { text: text, number: number},
    {where: {id: id}}
  )
  // 返回所有数据
  data = await ctx.service.bottle.getBottle(1, 999)

  ctx.status = 201
  ctx.body = {...{data}, ...ctx.helper.jsonSuccess()}
}

// delete
// put
exports.destroy = async ctx => {
  const {id} = ctx.request.body
  var data = await ctx.model.Bottle.update(
    { is_delete: 1},
    {where: {id: id}}
  )
  // 返回所有数据
  data = await ctx.service.bottle.getBottle(1, 999)
  ctx.status = 201
  ctx.body = {data, ...ctx.helper.jsonSuccess()}
}