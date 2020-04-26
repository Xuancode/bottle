const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class AdminService extends Service {
  async getAdmin(page, size) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const whereSql = [
      { is_delete: 0}
    ]
    const resData = await ctx.model.Admin.findAndCountAll({
      // attributes: ['id', 'text', 'number', 'created_at'],
      where: whereSql[0],
      order: [['created_at']],
      limit: size,
      offset: size * (page -1)
    })
    let pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size -1 ) / size) ,
    }
    
    return {data: resData.rows, meta: {pagination: pagination}}
  }
}
module.exports = AdminService;