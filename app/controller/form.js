const Controller = require('egg').Controller;

exports.post = async ctx => {
    ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
};