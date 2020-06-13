/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 16:42:17
 * @Description: file content
 * @FilePath: /bottle/app/controller/qiniu.js
 */
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