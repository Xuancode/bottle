/*
 * @Author: xuanpl
 * @Date: 2020-06-06 16:33:54
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-12 15:00:56
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
  async getReplyText(content) {
    const { ctx } = this
    const resReply = await ctx.model.Reply.findOne({ where: { question: content, state: '启用' } })
    if (resReply) {
      return resReply.content
    } else {
      const Op = this.app.Sequelize.Op
      const resReplys = await ctx.model.Reply.findAll({ where: { question: { [Op.like]: '%' + content + '%' }, state: '启用' } })
      let temp = '为您找到以下相关内容：\n'
      for (let i = 0; i < resReplys.length; i++) {
        let content = resReplys[i].content
        content = `${i + 1}、<a href="weixin://bizmsgmenu?msgmenucontent=${content}&msgmenuid=${i + 1}">${content}</a>\n`
        temp = temp + content
      }
      return temp
    }
  }

}

module.exports = weChatReplyService