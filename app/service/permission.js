/*
 * @Author: xuanpl
 * @Date: 2020-04-17 10:12:25
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-11 16:57:12
 * @Description: file content
 * @FilePath: /bottle/app/service/permission.js
 */
const Service = require('egg').Service

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class PermissionService extends Service {
  async getMenu(admin_id) {
    let ctx = this.ctx
    const Op = this.app.Sequelize.Op
    // 包含admin_id就返回，不然则返回所有
    if (admin_id) {
      const resData = await this.getRouterByAdminID(admin_id, ctx)
      return { data: resData }
    }
    let sql = { state: 1, parent_id: null }
    // 返回所有权限，最多嵌套4层，有没有不那么挫的写法呢。
    const resData = await ctx.model.Permission.findAndCountAll({
      where: sql,
      attributes: ['id', 'label', 'router', 'url', 'parent_id'],
      include: [
        {
          model: ctx.model.Permission,
          as: 'children',
          attributes: ['id', 'label', 'router', 'url', 'parent_id'],
          include: [
            {
              model: ctx.model.Permission,
              as: 'children',
              attributes: ['id', 'label', 'router', 'url', 'parent_id'],
              include: [
                {
                  model: ctx.model.Permission,
                  as: 'children',
                  attributes: ['id', 'label', 'router', 'url', 'parent_id'],
                }
              ]
            }
          ]
        }
      ]
    })
    return { data: resData.rows }
  }
  async getRouterByAdminID(admin_id, ctx) {
    ctx = ctx ? ctx : this.ctx
    const resData = await ctx.model.Admin.findOne({
      where: { admin_id: admin_id },
      include: [{
        model: ctx.model.Role,
        include: [{
          model: ctx.model.Permission,
        }]
      }]
    })
    const roles = resData.dataValues.roles
    let permissions = []
    roles.map(role => {
      permissions = permissions.concat(role.permissions)
    })
    permissions = ctx.helper.removeRepeat(permissions, 'id')
    return permissions
  }
}

module.exports = PermissionService