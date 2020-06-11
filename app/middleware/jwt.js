/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-11 18:05:35
 * @Description: jwt中间件
 * @FilePath: /bottle/app/middleware/jwt.js
 */
module.exports = options => {
  return async function (ctx, next) {
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
        const blackToken = await ctx.model.TokenBlacklist.findOne({ where: { token: token } })
        if (verifyData.uid && !blackToken) {
          // 注意，还需要补验证
          ctx.uid = verifyData.uid
          ctx.logger.info('jwt的admin_id是: %j', verifyData.uid)
          await next()
        } else {
          ctx.body = { msg: '登录状态已过期', code: '40100' }
        }
      } catch (e) {
        console.log('错误', e);
        ctx.body = { msg: '错误', code: '50000' }
      }
    }
  }
}