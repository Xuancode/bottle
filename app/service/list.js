const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class ListService extends Service {
  async getList(type, page, size) {
    type = toInt(type) 
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
    const uid = token.uid
    // 0为未完成list，此时answer_times为0， 不限制user_id； 1为推荐、完成的列表，answer_times非0， 不限制user_id; 2为自我发起的列表，不限制answer_times,限制user_id
    const whereSql = [
      { is_delete: 0, answer_times: 0},
      { is_delete: {[Op.ne]: 1}, answer_times: { [Op.gt]: 0 }, user_id: type == 2 ? uid : { [Op.ne]: null }},
      { is_delete: {[Op.ne]: 1}, user_id: uid}
    ]
    const resData = await ctx.model.List.findAndCountAll({
      attributes: ['id', 'title', 'src_img', 'side_imgs', 'updated_at', 'user_id'],
      where: whereSql[type],
      include: [
        {model: ctx.model.User, attributes: ['id', 'name', 'avatar', 'introduce']},
        {model: ctx.model.Comment, attributes: ['id', 'content', 'user_id'],where: {is_editor: 0}, order: [['updated_at', 'DESC']], limit: 1,
         include: {
          model: ctx.model.User},
          // model: ctx.model.User, where: {id: 2}
        }
      ],
      order: [['updated_at', 'DESC']],
      limit: size,
      offset: size * (page -1)
    })


  //  const a = resData.findAndCountAll({
  //     where: {comment: {[Op.ne]: []}}
  //   })


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
module.exports = ListService;