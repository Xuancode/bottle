/*
 * @Author: xuanpl
 * @Date: 2020-06-07 16:57:08
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-09 17:07:28
 * @Description: file content
 * @FilePath: /bottle/app/service/autoReply.js
 */
const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class AutoReplyService extends Service {
  // async saveMovies(movieArr) {
  //   const { ctx } = this
  //   const res = ctx.model.Movie.bulkCreate(movieArr, {validate: true, updateOnDuplicate:["link", "pass_code", "editor_id", "introduction", "updated_at", "state"]})
  //   return res
  // }

  /**
   * 
   * @param {int/string} page 页码
   * @param {int} size 每页数量
   * @param {string} question 名字，模糊搜索
   * @param {object} sql 其他搜索条件
   * @param {string} sort 排序，形如 'id,DESC'
   * @param {boolean} is_fuzzy question是否使用模糊搜索
   */
  async getReply(page = 1, size = 20, question, sql, sort = 'id,DESC', is_fuzzy = true) {
    page = toInt(page)
    size = toInt(size)
    const ctx = this.ctx

    const Op = this.app.Sequelize.Op
    const questionSql = (is_fuzzy && question) ? { [Op.like]: '%' + question + '%' } : question
    if (questionSql) {
      sql.question = questionSql
    }
    const order = sort.split(',')

    const resData = await ctx.model.Reply.findAndCountAll({
      where: sql,
      // attributes: ['id', 'question', 'link', 'pass_code', 'is_delete', 'hot', 'state', 'introduction', 'created_at', 'updated_at'],
      include: { model: ctx.model.Admin, attributes: ['name', 'user_name'] },
      order: [order],
      limit: size,
      offset: size * (page - 1)
    })

    // console.log(resData.rows[0].movie)
    const pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size - 1) / size)
    }

    return { data: resData.rows, meta: { pagination: pagination } }
  }
  /**
   * 
   * @param {array} replyArr 批量改动/新增的数组
   */
  async saveReplys(replyArr) {
    const { ctx } = this
    console.log(replyArr)
    const res = ctx.model.Reply.bulkCreate(replyArr, { validate: true, updateOnDuplicate: ['question', 'content', 'item_id', 'hot', 'state', "updated_at"] })
    return res
  }
}

module.exports = AutoReplyService