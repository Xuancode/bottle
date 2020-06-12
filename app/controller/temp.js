/*
 * @Author: xuanpl
 * @Date: 2020-04-08 10:04:48
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-12 14:54:14
 * @Description: file content
 * @FilePath: /bottle/app/controller/temp.js
 */
'use strict'

const sha1 = require('js-sha1')
var Parser = require('fast-xml-parser')
var JSON2XML = require("fast-xml-parser").j2xParser;

const Controller = require('egg').Controller

// 登录校验规则
const loginRule = {
  wxcode: {
    type: 'string',
  }
};

class TempController extends Controller {
  async create() {
    const { ctx } = this
    const { content } = ctx.request.body
    const res = await ctx.service.weChatReply.getReplyText(content)
    ctx.body = res
  }

  async index() {
    const { ctx } = this
    ctx.body = {
      "code": 20000,
      "data": {
        "roles": [
          "admin"
        ],
        "introduction": "I am a super administrator",
        "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        "name": "Super Admin"
      }
    }
  }
};

module.exports = TempController;