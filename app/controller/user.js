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
  console.log(ctx.request.body)
  // ctx.validate(createRule);
  // app.model.User

  const { name, age } = ctx.request.body;
  const user = await ctx.model.User.create({ name });

  // const { session_key, openid, user_id } = ctx.request.body;
  // const user = await ctx.model.Wechat.create({ session_key, openid, user_id });

  ctx.status = 201;
  ctx.body = user;
};

// // get
// exports.index = async ctx => {
//   // console.log(ctx.query.id)
//   const openid = await ctx.model.Wechat.findAll({
//     // attributes: [ 'id', 'user_id' ], // 指定属性
//     attributes: { exclude: ['updated_at'],  }, // 删除属性
//     include: {
//       model: ctx.model.User,
//       as: 'user'
//       // where: {name: "李宇春"}
//     },
//     // where: { status: 'publish' },
//     order: [['id', 'desc']],  // 排序方式，注意写法
//   })

// get
exports.index = async ctx => {
  // console.log(ctx.query.id)
  const openid = await ctx.model.User.findAll({
    // attributes: [ 'id', 'user_id' ], // 指定属性
    // attributes: { exclude: ['updated_at'],  }, // 删除属性
    include: [
      // {
      //   model: ctx.model.Wechat,
      //   // as: 'wechat'
      //   // where: {name: "李宇春"}
      //   // where: { name: { [Op.like]: '%9%' } }
      // },
      // {
      //   model: ctx.model.List,
      // }
      {
        all: true
      }
    ],
    // where: { status: 'publish' },
    order: [['id', 'desc']],  // 排序方式，注意写法
  })




  ctx.body = openid
};

// new