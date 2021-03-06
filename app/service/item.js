/*
 * @Author: xuanpl
 * @Date: 2020-05-12 20:47:41
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-11 18:39:49
 * @Description: file content
 * @FilePath: /bottle/app/service/item.js
 */
const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class ItemService extends Service {
  async createItem(item_name, item_info, admin_id) {
    const ctx = this.ctx
    const item_id = ctx.helper.createItemID()
    const res = await ctx.model.Item.create({ item_name, item_info, admin_id, item_id })
    return res
  }
  async getItem(page, size, item_name) {
    if (page && size && !item_name) {
      let ctx = this.ctx
      page = toInt(page)
      size = toInt(size)
      const whereSql = [
        { is_delete: 0 }
      ]
      const resData = await ctx.model.Item.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: whereSql[0],
        order: [['created_at']],
        limit: size,
        // 重要！加该选项避免查出错误的count值;但是正式环境的语句是 SELECT count(DISTINCT(*)) AS `count` FROM `item` AS `item` WHERE `item`.`is_delete` = 0; 导致出错；测试环境为SELECT count(DISTINCT(`id`)) AS `count` FROM `item` AS `item` WHERE `item`.`is_delete` = 0; 不会出错，无解，先关掉
        // distinct: true, 
        offset: size * (page - 1)
      })

      let pagination = {
        total: resData.count,
        count: resData.rows.length,
        size: size,
        page: page,
        total_pages: parseInt((resData.count + size - 1) / size)
      }
      return { data: resData.rows, meta: { pagination: pagination } }
    } else {
      let ctx = this.ctx
      const resData = await ctx.model.Item.findOne({ where: { item_name: item_name }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
      return { data: resData }
    }
  }

  /** 修改item信息 */
  async updateItem(obj, item_id) {
    const ctx = this.ctx
    let item = await ctx.model.Item.findOne({
      where: { item_id }
    })
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        item[key] = obj[key]
      }
    }
    item.save()
    return item
  }

  async destroyItem(idArr) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const items = await ctx.model.Item.destroy({ where: { item_id: { [Op.in]: idArr } } })
    return items
  }
}
module.exports = ItemService;