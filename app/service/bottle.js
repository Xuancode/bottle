/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 18:16:36
 * @Description: file content
 * @FilePath: /bottle/app/service/bottle.js
 */
const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class BottleService extends Service {
  async getBottle(page, size) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    // const Op = this.app.Sequelize.Op
    const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    const uid = token.uid

    const whereSql = [
      { is_delete: 0, wechat_id: uid }
    ]
    const resData = await ctx.model.Bottle.findAndCountAll({
      attributes: ['id', 'text', 'number', 'created_at'],
      where: whereSql[0],
      order: [['created_at']],
      limit: size,
      offset: size * (page - 1)
    })
    let pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size - 1) / size),
    }

    return { data: resData.rows, meta: { pagination: pagination } }
  }
}
module.exports = BottleService;