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
        if (xmlMsg.EventKey == V1001_JOB) {
          return '为更好地为您服务，请将您的资源或需求发送至横县万事通公众号，谢谢！'
        } else if (xmlMsg.EventKey == V1002_BUSINESS) {
          return '为更好地为您服务，请将您的资源或需求发送至横县万事通公众号，谢谢！'
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
  async getMovie(page, size, name, obj, sort) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const Op = this.app.Sequelize.Op
    // let sql = name ? { ...obj, name: { [Op.like]:'%' + name + '%'} } : {...obj}
    let nameSql = name ? { name: { [Op.like]: '%' + name + '%' } } : {}
    let objSql = obj ? { ...obj } : {}
    let sql = { ...nameSql, ...objSql }
    let order = sort.split(',')

    const resData = await ctx.model.Movie.findAndCountAll({
      where: sql,
      attributes: ['id', 'name', 'link', 'pass_code', 'is_delete', 'hot', 'state', 'introduction', 'created_at', 'updated_at'],
      // attributes: ['id', 'name'],
      include: { model: ctx.model.Admin, attributes: ['name', 'user_name'] },
      order: [order],
      limit: size,
      offset: size * (page - 1)
    })

    // console.log(resData.rows[0].movie)
    let pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size - 1) / size)
    }

    return { data: resData.rows, meta: { pagination: pagination } }
  }

}

module.exports = weChatReplyService