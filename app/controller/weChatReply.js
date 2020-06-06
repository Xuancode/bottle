'use strict'

const sha1 = require('js-sha1')
const crypto = require('crypto')
var Parser = require('fast-xml-parser')
var JSON2XML = require("fast-xml-parser").j2xParser
const WxCrypt = require('../util/crypt')
const Controller = require('egg').Controller

class weChatReplyController extends Controller {
  async create() {
    const { ctx } = this
    var jsonObj = Parser.parse(ctx.request.body)

    const wxConfig = {
      // 传入配置信息
      token: ctx.app.config.weChat[ctx.query.project].token,
      appid: ctx.app.config.weChat[ctx.query.project].appid,
      msg_signature: 'xxx', // 微信发来的签名，后边补上验证
      encodingAESKey: ctx.app.config.weChat['210'].aesKey
    }

    var wxCrypt = new WxCrypt(wxConfig)
    const xml = wxCrypt.decrypt(jsonObj.xml.Encrypt)
    let msgJS = Parser.parse(xml) // 获得obj数据
    let replyText = ''

    if (!msgJS || !msgJS.xml) {
      ctx.body = "you bad!"
      return
    }
    if (msgJS.xml.MsgType === 'event') {
      replyText = await ctx.service.weChatReply.eventType(msgJS.xml)
    } else if (msgJS.xml.MsgType === 'text') {
      // 转到文字处理自动回复
      replyText = '您好，部分服务功能正在升级中，敬请期待横县万事通为您展现互联网+智能生态圈'
    }
    ctx.logger.info('replyText: %j', replyText)
    // 回复信息
    ctx.logger.info('传来的: %j', msgJS)
    let replyMsg = {
      xml: {
        ToUserName: `<![CDATA[${msgJS.xml.FromUserName}]]>`,
        FromUserName: `<![CDATA[${msgJS.xml.ToUserName}]]>`,
        CreateTime: new Date().getTime(),
        MsgType: `<![CDATA[${'text'}]]>`,
        Content: `<![CDATA[${replyText}]]>`
      }
    }
    let builder = new JSON2XML()
    replyMsg = builder.parse(replyMsg)
    replyMsg = wxCrypt.encrypt(replyMsg)

    // 生成 MsgSignature
    let Arr = [ctx.app.config.weChat['210'].token, ctx.query.timestamp, ctx.query.nonce, replyMsg] // 密文
    Arr.sort()
    let str = '' + Arr[0] + Arr[1] + Arr[2] + Arr[3]
    let mysignature = sha1(str)

    let finalXml = {
      xml: {
        Encrypt: `<![CDATA[${replyMsg}]]>`,
        MsgSignature: `<![CDATA[${mysignature}]]>`,
        TimeStamp: ctx.query.timestamp,
        Nonce: `<![CDATA[${ctx.query.nonce}]]>`
      }
    }

    builder = new JSON2XML()
    finalXml = builder.parse(finalXml)

    ctx.body = finalXml
  }

  async index() {
    const { ctx } = this
    const { signature, timestamp, nonce, echostr } = ctx.query
    ctx.logger.info('request_query: %j', ctx.query)

    const token = ctx.app.config.weChat['210'].token
    let Arr = [token, timestamp, nonce]
    Arr.sort()
    let str = '' + Arr[0] + Arr[1] + Arr[2]
    let mysignature = sha1(str)

    if (mysignature == signature) {
      ctx.body = echostr
    } else {
      ctx.body = '错误'
    }
  }
}

module.exports = weChatReplyController