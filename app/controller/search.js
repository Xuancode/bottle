const Controller = require('egg').Controller;

exports.index = async ctx => {
    ctx.body = `search: ${ctx.query.name}`;
};