/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-18 13:33:58
 * @Description: file content
 * @FilePath: /bottle/app/controller/qiniu.js
 */
'use strict'

const Controller = require('egg').Controller

class QiniuController extends Controller {
  async index() {
    const { ctx } = this
    const token = ctx.helper.initQiniuToken()
    ctx.body = {
      ...this.app.resCode['SUCCESS'],
      uptoken: token,
    }
  }
}

module.exports = QiniuController
