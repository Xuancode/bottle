const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number')  return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class YouxinMovieService extends Service {
  async saveMovies(movieArr) {
    const { ctx } = this
    const res = ctx.model.Movie.bulkCreate(movieArr, {validate: true, updateOnDuplicate:["link", "pass_code", "editor_id", "introduction", "updated_at", "state"]})
    return res
  }
  async getMovie(page, size, name, obj, sort) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const Op = this.app.Sequelize.Op
    // let sql = name ? { ...obj, name: { [Op.like]:'%' + name + '%'} } : {...obj}
    let nameSql = name ? { name: { [Op.like]:'%' + name + '%'}} : {}
    let objSql = obj ? {...obj} : {}
    let sql = {...nameSql, ...objSql}
    let order = sort.split(',')

    const resData = await ctx.model.Movie.findAndCountAll({
      where: sql,
      attributes: ['id', 'name','link','pass_code','is_delete','hot','state','introduction','created_at','updated_at'],
      // attributes: ['id', 'name'],
      include: {model: ctx.model.Admin, attributes: ['name', 'user_name']},
      order: [order],
      limit: size,
      offset: size * (page -1)
    })

    // console.log(resData.rows[0].movie)
    let pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size -1 ) / size)
    }
    
    return {data: resData.rows, meta: {pagination: pagination}}
  }
  
}

module.exports = YouxinMovieService