'use strict';

const Controller = require('egg').Controller;

class QiniuController extends Controller {
  async index() {
    const { ctx } = this;
    const token = ctx.helper.initQiniuToken()
    ctx.body = {
      uptoken: token
    }
  }
};

module.exports = QiniuController;