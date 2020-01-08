const JWT = require('jsonwebtoken');

module.exports = options => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = ctx.request.header.authorization;
    const method = ctx.method.toLowerCase();
    if (!token) {
      if (ctx.path === '/api/v1/session') {
        await next();
      } else {
        // 待完善统一错误编码
        ctx.throw(401, '未登录， 请先登录');
      }
    } else {
      let decode;
      try {
        // 验证当前token
        // decode = JWT.verify(token, options.secret);
        const verifyData = this.ctx.helper.resolveToken(token)
        if (verifyData.uid) {
          // 注意，还需要补验证
          console.log(`有uid ${uid}`)
          await next();
        } else {
          ctx.throw( 403, '登录状态已过期')
        }
        if (!decode || !decode.userName) {
          ctx.throw(401, '没有权限，请登录');
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
};