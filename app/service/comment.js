const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CommentService extends Service {
  /**
   * 通过list_id筛选
   */
  async getCommentByListID(page, size, list_id) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const whereSql = { list_id: list_id}
    const resData = await ctx.model.Comment.findAndCountAll({
      // attributes: ['id', 'title', 'src_img', 'side_imgs', 'updated_at', 'user_id', 'answer_times'],
      where: whereSql,
      include: [
        {model: ctx.model.User, attributes: ['id', 'name', 'avatar', 'introduce']},
        // {model: ctx.model.Comment,where: {is_editor: 0, is_delete: 0,}, order: [['updated_at', 'DESC']], limit: 1,
        //  include: {
        //   model: ctx.model.User},
        // }
      ],
      order: [['updated_at', 'DESC']],
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
    console.log(pagination)
    return {data: resData.rows, meta: {pagination: pagination}}
  }

  /**
   * 通过UID筛选
   */
  async getCommentByUID(page, size) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    const uid = token.uid
    const whereSql = {user_id: uid}
    const resData = await ctx.model.Comment.findAndCountAll({
      // attributes: ['id', 'title', 'src_img', 'side_imgs', 'updated_at', 'user_id', 'answer_times'],
      where: whereSql,
      include: [
        {model: ctx.model.List, attributes: ['id', 'title']}
      ],
      order: [['updated_at', 'DESC']],
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
module.exports = CommentService;