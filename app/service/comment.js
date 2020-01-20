const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CommentService extends Service {
  async getComment(type, page, size, list_id) {
    // type=0不包含自己的评论， type=1包含自己的评论
    type = toInt(type) 
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    const uid = token.uid

    const whereSql = [
      { list_id: list_id, user_id: {[Op.not]: uid}},
      { list_id: list_id},
    ]
    const resData = await ctx.model.Comment.findAndCountAll({
      // attributes: ['id', 'title', 'src_img', 'side_imgs', 'updated_at', 'user_id', 'answer_times'],
      where: whereSql[type],
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
    return {data: resData.rows, meta: {pagination: pagination, type: type}}
    // return {data: a, meta: {pagination: pagination, type: type}}
  }
}
module.exports = CommentService;