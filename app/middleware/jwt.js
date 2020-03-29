module.exports = options => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = ctx.request.header.authorization;
    
    // 不校验options请求，没想到更好的办法，先用这个
    const method = ctx.method.toLowerCase();
    if (!token) {
      if (ctx.path === '/api/v1/session') {
        await next()
      } else {
        // 待完善统一错误编码
        ctx.throw(401, '未登录， 请先登录');
      }
    } else {
      try {
        const verifyData = await ctx.helper.resolveToken(token.split(' ')[1])
        if (verifyData.uid) {
          // 注意，还需要补验证
          await next()
        } else {
          ctx.body = {message: '登录状态已过期', error_code: '40100'}
          ctx.status = 401
          // ctx.assert('ctx.state.user', 401, '登录状态已过期!');
        }
      } catch (e) {
        console.log( '错误',e);
      }
    }
  };
};