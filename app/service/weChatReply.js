/*
 * @Author: xuanpl
 * @Date: 2020-06-06 16:33:54
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-11 19:05:12
 * @Description: file content
 * @FilePath: /bottle/app/service/weChatReply.js
 */
const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class weChatReplyService extends Service {
  /**
   * 
   * @param {object} xmlMsg 解密后的微信消息
   */
  async eventType(xmlMsg) {
    const { ctx } = this
    switch (xmlMsg.Event) {
      case 'CLICK':
        if (xmlMsg.EventKey == 'V1001_JOB') {
          return '为更好地为您服务，请将您的资源或需求发送至横县万事通公众号，谢谢！'
        } else if (xmlMsg.EventKey == 'V1002_BUSINESS') {
          return '为更好地为您服务，请将您的资源或需求发送至横县万事通公众号，谢谢！'
        } else if (xmlMsg.EventKey == 'V2001_CONTACT_US') {
          return '商务合作请联系：15007816216.'
        }
        return ''
      case 'unsubscribe':
        // 取消关注
        await ctx.service.wechat.setUnFocus(msgJS.xml.FromUserName, ctx.query.project, 0)
        return '感谢曾经的陪伴，我们会努力做得更好!'
      case 'subscribe':
        // 存关注
        await ctx.service.wechat.setFocus(msgJS.xml.FromUserName, ctx.query.project, 1)
        return '感谢关注，横县万事通竭诚为您服务!'
      default:
        return ''
    }
  }
  async getReplyText(xmlMsg) {
    const { ctx } = this
    if (xmlMsg.Content == '测试链接回复') {
      return '<a href="weixin://bizmsgmenu?msgmenucontent=测试自动发送&msgmenuid=1">点击</a>'
    }
    const resReply = await ctx.model.Reply.findOne({ where: { question: xmlMsg.Content, state: '启用' } })
    if (resReply) {
      return resReply.content
    } else {
      return '您好，部分服务功能正在升级中，敬请期待横县万事通为您展现互联网+智能生态圈'
    }

  }

}

module.exports = weChatReplyService