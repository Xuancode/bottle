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

  const { title, src_img, side_imgs, is_delete, user_id, editor_id} = ctx.request.body;
  const list = await ctx.model.List.create({ title, src_img, side_imgs, is_delete, user_id, editor_id });

  // const { session_key, openid, user_id } = ctx.request.body;
  // const user = await ctx.model.Wechat.create({ session_key, openid, user_id });

  ctx.status = 201;
  ctx.body = list;
};

// get
exports.index = async ctx => {
  // console.log(ctx.query.id)
  const openid = await ctx.model.List.findAll({
    // attributes: { exclude: ['updated_at'],  }, // 删除属性
    include: [{
        model: ctx.model.User,
        // as: 'user'
        // where: {name: "李宇春"}
      },
      {
        model: ctx.model.User,
        // as: 'user'
        // where: {name: "李宇春"}
      }
    ],
    where: { is_delete: 1},
    order: [['updated_at', 'desc']],  // 排序方式，注意写法
  })


  ctx.body = openid
};

// new