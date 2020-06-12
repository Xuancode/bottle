/*
 * @Author: xuanpl
 * @Date: 2020-06-06 16:33:54
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-12 17:24:22
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
  /**
   * @description: 根据对话框传来的信息返回回复内容；先精确匹配，若没有则进行模糊匹配，匹配到的内容返回供选择问题列表；
   * 若都没有则返回"啥都没有回什么"对应的内容，若还没有则返回默认回复；
   * 回复的content都需要检测是否采用了 "send这是最终发送的内容click这是点击的内容end"的格式，若有，则解析成问题列表
   * @param {string} content 关键词
   * @return: 对应的回复文字内容
   */
  async getReplyText(content) {
    const { ctx } = this
    // 精确匹配
    const resReply = await ctx.model.Reply.findOne({ where: { question: content, state: '启用' } })
    if (resReply) {
      let content = this.testContent2List(resReply.content)
      return content
    } else {
      // 模糊匹配返回问题列表
      const Op = this.app.Sequelize.Op
      const resReplys = await ctx.model.Reply.findAll({ where: { question: { [Op.like]: '%' + content + '%' }, state: '启用' } })
      if (!resReplys || resReplys.length === 0) {
        const nullReply = await ctx.model.Reply.findOne({ where: { question: '啥都没有回什么', state: '启用' } })
        return nullReply ? nullReply.content : '更多服务的完善，还请您提出宝贵意见！'
      }
      let temp = '为您找到以下相关内容：\n'
      for (let i = 0; i < resReplys.length; i++) {
        let question = resReplys[i].question
        question = `${i + 1}、<a href="weixin://bizmsgmenu?msgmenucontent=${question}&msgmenuid=${i + 1}">${question}</a>\n`
        temp = temp + question
      }
      return temp
    }
  }
  /**
   * @description: 如果内容形如：
   * 'send这是最终发送的内容click这是点击的内容end'，则替换解析出微信格式如：<a href="weixin://bizmsgmenu?msgmenucontent=测试自动发送&msgmenuid=1">点击</a> 
   * 若不是，则返回原值
   * @param {type} content 需要检测的内容
   * @return: 原字符串或者解析后的微信格式
   */
  async testContent2List(content) {
    const reg = 'send([\\s\\S]*?)click'
    const arr = content.match(reg)
    if (!arr) {
      return content
    } else {
      // 直接用替换的方式来做
      content = content.replace(/send/g, '<a href="weixin://bizmsgmenu?msgmenucontent=')
      content = content.replace(/click/g, '&msgmenuid=1">')
      content = content.replace(/end/g, '</a>')
      return content
    }
  }
}

module.exports = weChatReplyService