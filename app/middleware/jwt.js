module.exports = options => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = ctx.request.header.authorization ? ctx.request.header.authorization.split(' ')[1] : null
    
    // 不校验options请求，没想到更好的办法，先用这个
    const method = ctx.method.toLowerCase();
    if (!token) {
      // 待完善统一错误编码
      ctx.throw(401, '未登录， 请先登录')
    } else {
      try {
        const verifyData = await ctx.helper.resolveToken(token)
        const blackToken = await ctx.model.Adminblacklist.findOne({where: {token: token}})
        if (verifyData.uid && !blackToken) {
          // 注意，还需要补验证
          ctx.uid = verifyData.uid
          await next()
        } else {
          ctx.body = {msg: '登录状态已过期', code: '40100'}
        }
      } catch (e) {
        console.log( '错误',e);
        ctx.body = {msg: '错误', code: '50000'}
      }
    }
  }
}