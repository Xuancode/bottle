'use strict'

const sha1 = require('js-sha1')
const crypto = require('crypto')
var Parser = require('fast-xml-parser')
var JSON2XML = require("fast-xml-parser").j2xParser
const WxCrypt = require('../util/crypt')
const Controller = require('egg').Controller

class weChatReplyController extends Controller {
  async create() {
    const {ctx} = this
    var jsonObj = Parser.parse(ctx.request.body)

    const wxConfig = {
      // 传入配置信息
      token: ctx.app.config.weChat['210'].token,
      appid: ctx.app.config.weChat['210'].appid,
      msg_signature: 'xxx', // 微信发来的签名，后边补上验证
      encodingAESKey: ctx.app.config.weChat['210'].aesKey
    }

    var wxCrypt = new WxCrypt(wxConfig)
    const xml = wxCrypt.decrypt(jsonObj.xml.Encrypt)

    // 回复信息
    let msgJS = Parser.parse(xml)
    console.log(msgJS)
    ctx.logger.info('传来的: %j', msgJS)
    let replyMsg = {
      xml: {
        ToUserName: `<![CDATA[${msgJS.xml.FromUserName}]]>`,
        FromUserName: `<![CDATA[${msgJS.xml.ToUserName}]]>`,
        CreateTime: new Date().getTime(),
        MsgType: `<![CDATA[${'text'}]]>`,
        Content: `<![CDATA[${'你好，我回复你了哦'}]]>`
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
    const {signature, timestamp, nonce, echostr} = ctx.query
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