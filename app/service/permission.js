const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number')  return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class PermissionService extends Service {
  async getMenu(type) {
    let ctx = this.ctx
    const Op = this.app.Sequelize.Op
    let sql = { state: 1, parent_id: null}
    // 最多嵌套4层，有没有不那么挫的写法呢。
    const resData = await ctx.model.Permission.findAndCountAll({
      where: sql,
      attributes: ['id', 'label','url','parent_id'],
      include: [
        {
          model: ctx.model.Permission, 
          as: 'children',
          attributes: ['id', 'label','url','parent_id'],
          include: [
            {
              model: ctx.model.Permission, 
              as: 'children',
              attributes: ['id', 'label','url','parent_id'],
              include: [
                {
                  model: ctx.model.Permission, 
                  as: 'children',
                  attributes: ['id', 'label','url','parent_id'],
                }
              ]
            }
          ]
        }
      ]
    })
    return {data: resData.rows}
  }
}

module.exports = PermissionService