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
    const {ctx} = this
    var jsonObj = Parser.parse(ctx.request.body)
    let myself = jsonObj.xml.ToUserName
    let user = jsonObj.xml.FromUserName
    let msgType = jsonObj.xml.MsgType
    let content = jsonObj.xml.Content

    console.log(ctx.request.body)
    ctx.logger.info('XML_request_body: %j', ctx.request.body)

    let replyData = {
      xml: {
        ToUserName: `<![CDATA[${user}]]>`,
        FromUserName: `<![CDATA[${myself}]]>`,
        CreateTime: new Date().getTime(),
        MsgType: `<![CDATA[${'text'}]]>`,
        Content: `<![CDATA[${'你好，我回复你了哦'}]]>`
      }
    }
    var J2X = new JSON2XML()
    var xml = J2X.parse(replyData)
    ctx.body = xml
    // ctx.body = ctx.request.body
  }

  async index() {
    const {ctx} = this
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