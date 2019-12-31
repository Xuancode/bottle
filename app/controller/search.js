const Controller = require('egg').Controller;

exports.index = async ctx => {
    ctx.body = `search: ${ctx.query.name}`;
};

exports.redirect = async ctx => {
    const type = ctx.query.type;
    const q = ctx.query.q || 'nodejs';

    if (type === 'bing') {
        ctx.redirect(`http://cn.bing.com.search?q=${q}`);
    } else {
        ctx.redirect(`https://baidu.com/search?q=${q}`);
    }
}