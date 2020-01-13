'use strict';

const Controller = require('egg').Controller;

class QiniuController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.request.headers)
    const token = ctx.helper.initQiniuToken()
    console.log(token)
    ctx.body = {
      uptoken: token
    }
  }
};

module.exports = QiniuController;