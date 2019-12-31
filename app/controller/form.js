const Controller = require('egg').Controller;

exports.post = async ctx => {
    ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
};


// 'use strict';

// const Controller = require('egg').Controller;

// class FormController extends Controller {
//   async index() {
//     const { ctx } = this;
//     ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
//   }
// }

// module.exports = FormController;
