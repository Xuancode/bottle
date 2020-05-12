'use strict'

const sha1 = require('js-sha1')
var CryptoJS = require("crypto-js")
const crypto = require('crypto')
var Parser = require('fast-xml-parser')
var JSON2XML = require("fast-xml-parser").j2xParser
const xml2js = require('xml2js')
const WxCrypt = require('../util/crypt')


const Controller = require('egg').Controller


function decryptXML(obj){
  let aesKey = Buffer.from(obj.AESKey + '=', 'base64')
  const cipherEncoding = 'base64';
  const clearEncoding = 'utf8';
    
  // console.log(aesKey)
  // console.log(aesKey.slice(0, 16))
  const cipher = crypto.createDecipheriv('aes-256-cbc',aesKey,aesKey.slice(0, 16))
  cipher.setAutoPadding(false); // 是否取消自动填充 不取消
  let this_text = cipher.update(obj.text, cipherEncoding, clearEncoding) + cipher.final(clearEncoding)
  let xmlText = ''
  xml2js.parseString(this_text.substring(20,this_text.lastIndexOf(">")+1), function(err, result){
    if(err) throw err;
    xmlText = result;
  })
  return {
    noncestr:this_text.substring(0,16),
    msg_len:this_text.substring(16,20),
    msg:xmlText,
    corpid: this_text.substring(this_text.lastIndexOf(">")+1)
  }
}

/**
 * @description
 * 根据信息拼装回复内容，加密返回Xml
 */
function getReplyXml(jsonObj, ctx) {
  let replyMsg = {
    xml: {
      ToUserName: `<![CDATA[${jsonObj.FromUserName}]]>`,
      FromUserName: `<![CDATA[${jsonObj.ToUserName}]]>`,
      CreateTime: new Date().getTime(),
      MsgType: `<![CDATA[${'text'}]]>`,
      Content: `<![CDATA[${'你好，我回复你了哦'}]]>`
    }
  }

  var builder = new JSON2XML()
  replyMsg = builder.parse(replyMsg)


  const msgBuf = new Buffer(replyMsg, 'utf-8')
  const preBuf = randomPrefix(16)
  const netBuf = htonl(msgBuf.length)
  // 
  const finalMsg = Buffer.concat([preBuf, netBuf, msgBuf, Buffer.from(ctx.app.config.youxin.appid)]) // 应该还要加appid在最后
  // text = self.get_random_str() + struct.pack("I",socket.htonl(len(text))) + text + appid
  
  // AES加密 finalMsg
  const AESKey = ctx.app.config.youxin.aesKey
  let Key = Buffer.from(AESKey + '=', 'base64')
  var cipher = crypto.createCipheriv('aes-256-cbc', Key, Key.slice(0, 16))
  // cipher.setAutoPadding(false); // 取消自动填充
  let finalCipher = cipher.update(finalMsg, "binary", 'base64') + cipher.final('base64')

  // finalCipher = Buffer.from(finalCipher).toString('base64')

  // 尝试解密自己，验证
  console.log('失败的长这样: ', finalCipher)
  let data = decryptXML({
    AESKey: AESKey,
    text: finalCipher
  })

  console.log(data)



  // 生成 MsgSignature
  let Arr = [ctx.app.config.youxin.token, ctx.query.timestamp, ctx.query.nonce, finalCipher] // 密文
  Arr.sort()
  let str = '' + Arr[0] + Arr[1] + Arr[2] + Arr[3]
  let mysignature = sha1(str)

  let finalXml = {
    xml: {
      Encrypt: `<![CDATA[${finalCipher}]]>`,
      MsgSignature: `<![CDATA[${mysignature}]]>`,
      TimeStamp: ctx.query.timestamp,
      Nonce: `<![CDATA[${ctx.query.nonce}]]>`
    }
  }

  var xmlBuilder = new JSON2XML()
  finalXml = xmlBuilder.parse(finalXml)
	return data
}

/**
 * @description
 * 对称加密
 */
// 生成随机字符串
var randomPrefix = function(n) {
	var _str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	var buf = new Buffer(n)
	for (var i = 0; i < n; i++) {
		buf[i] = _str.charCodeAt(Math.floor(Math.random() * _str.length))
	}
	return buf
}

// 网络子节序
var htonl = function(n) {
	var buf = new Buffer(4);
	buf[0] = (n & 0xFF000000) >> 24;
	buf[1] = (n & 0x00FF0000) >> 16;
	buf[2] = (n & 0x0000FF00) >> 8;
	buf[3] = (n & 0x000000FF) >> 0;
	return buf;
}

function encrypt(msg, key) {
  let aesKey = Buffer.from(key + '=', 'base64')

	var msgBuf = new Buffer(msg, "utf-8")
  var msgBufLength = msgBuf.length
  var preBuf = randomPrefix(16)
  var netBuf = htonl(msgBufLength)

	var cipheriv = crypto.createCipheriv('aes-256-cbc', aesKey, aesKey.slice(0, 16))
  let encrypted = cipheriv.update(Buffer.concat([preBuf, netBuf, msgBuf]), 'utf8', 'base64')
  encrypted = encrypted + cipheriv.final('base64')
	return encrypted
}

function encryptXML(key, js){
  var J2X = new JSON2XML()
  var xml = J2X.parse(js)
  let aesKey = Buffer.from(key + '=', 'base64')
  let vi = aesKey.slice(0, 16)

  const cipheriv = crypto.createCipheriv('aes-256-cbc', aesKey, vi)
  // cipheriv.setAutoPadding(false); // 取消自动填充

  let encrypted = cipheriv.update(xml, 'utf8', 'base64')
  encrypted += cipheriv.final('base64')

  return encrypted
}

class weChatReplyController extends Controller {
  async create() {
    const {ctx} = this
    var jsonObj = Parser.parse(ctx.request.body)

    const wxConfig = {
      // 传入配置信息
      token: ctx.app.config.youxin.token,
      appid: ctx.app.config.youxin.appid,
      msg_signature: 'xxx',
      encodingAESKey: ctx.app.config.youxin.aesKey
    }

    var wxCrypt = new WxCrypt(wxConfig)
    const xml = wxCrypt.decrypt(jsonObj.xml.Encrypt)

    let msgJS = Parser.parse(xml)
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
    let Arr = [ctx.app.config.youxin.token, ctx.query.timestamp, ctx.query.nonce, replyMsg] // 密文
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
    
    
    // let data = decryptXML({
    //   AESKey: AESKey,
    //   text: jsonObj.xml.Encrypt
    // })

    // console.log('合法的长这样: ', jsonObj.xml.Encrypt)

    // const replyMsg = getReplyXml(data.msg.xml, ctx)
  }

  async index() {
    const { ctx } = this
    const {signature, timestamp, nonce, echostr} = ctx.query
    ctx.logger.info('request_query: %j', ctx.query)

    const token = this.config.youxin.token
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