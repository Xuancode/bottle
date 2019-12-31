// 基类，公用方法定义

const { Controller } = require('egg');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      success: true,
      data,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;

// 使用方式如
//app/controller/post.js 中
// const Controller = require('../core/base_controller');
// class PostController extends Controller {
//   async list() {
//     const posts = await this.service.listByUser(this.user);
//     this.success(posts);
//   }
// }