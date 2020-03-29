
module.exports = options => {
  return async function(ctx, next) {
    ctx.logger.info('request_body: %j', ctx.request.body)
    await next()
  };
};