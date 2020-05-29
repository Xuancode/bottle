const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class AdminService extends Service {
  async createAdmin(data, roleArr, item_id) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op

    let transaction = null
    try {
      transaction = await this.ctx.model.transaction();
      let admin = await ctx.model.Admin.create({ ...data }, { transaction })
      // 创建admin_role联系
      if (roleArr && roleArr.length != 0) {
        const roles = await ctx.model.Role.findAll({ where: { id: { [Op.in]: roleArr } }, transaction })
        await admin.setRoles(roles, { transaction })
      }
      // 创建admin_item联系
      if (item_id && item_id.length != 0) {
        const items = await ctx.model.Item.findAll({ where: { item_id: { [Op.in]: item_id } }, transaction })
        await admin.setItems(items, { transaction: transaction })
      }      

      await transaction.commit()
      return admin
    } catch (error) {
      await transaction.rollback()
      return {msg: '新建失败'}
    }
  }
  async getAdmin(page, size) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const whereSql = [
      { is_delete: 0 }
    ]
    const resData = await ctx.model.Admin.findAndCountAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: whereSql[0],
      include: [
        {
          model: ctx.model.Role,
          attributes: ['id']
        },
        {
          model: ctx.model.Item,
          attributes: ['item_id']
        }
      ],
      order: [['created_at']],
      limit: size,
      distinct: true, // 重要！加该选项避免查出错误的count值
      offset: size * (page - 1)
    })

    let arr = JSON.parse(JSON.stringify(resData)).rows
    // 只返回id的数组
    arr.map((item) => {
      item.role_id = []
      item.item_id = []
      for (let i = 0; i < item.roles.length; i++) {
        const ele = item.roles[i]
        item.role_id.push(ele.id)
      }
      delete item['roles']
      for (let i = 0; i < item.items.length; i++) {
        const ele = item.items[i]
        item.item_id.push(ele.item_id)
      }
      delete item['items']
    })
    let pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size - 1) / size)
    }
    return { data: arr, meta: { pagination: pagination } }
  }
  /** 通过user_name查找用户 */
  async getAdminByUserName(user_name) {
    let ctx = this.ctx
    const resData = await ctx.model.Admin.findOne({
      where: { user_name: user_name }
    })
    return resData
  }

  /** 通过token查找用户 */
  async getAdminByToken(uid) {
    let ctx = this.ctx
    const resData = await ctx.model.Admin.findOne({
      where: { admin_id: uid },
      include: [
        {
          model: ctx.model.Role,
          through: { attributes: [] }
        },
        {
          model: ctx.model.Item,
          through: { attributes: [] }
        },
      ]
    })
    // 把权限加上
    const permissionInfo = await ctx.service.permission.getRouterByAdminID(uid, ctx)
    let data = JSON.parse(JSON.stringify(resData))
    data = Object.assign(data, { permissions: permissionInfo })
    return { data }
  }

  /** 修改用户信息 */
  async updateAdmin(obj, id, role_id, item_id) {
    // 使用事务修改角色信息后，修改关联的权限
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    // 查出admin实例化
    let admin = await ctx.model.Admin.findOne({
      where: { id },
      include: ctx.model.Role
    })
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        admin[key] = obj[key]
      }
    }
    // 使用事务修改信息
    let transaction = null
    try {
      transaction = await this.ctx.model.transaction()
      await admin.save({transaction})
      // 修改admin_role联系
      const roles = await ctx.model.Role.findAll({ where: { id: { [Op.in]: role_id } }, transaction })
      await admin.setRoles(roles, { transaction })
      // 修改admin_item联系
      const items = await ctx.model.Item.findAll({ where: { item_id: { [Op.in]: item_id } }, transaction })
      await admin.setItems(items, { transaction: transaction })

      await transaction.commit()
      return admin
    } catch (error) {
      await transaction.rollback()
      return {msg: '修改失败'}
    }
  }

  async destroyAdmin(idArr) {
    // 1、删除role的关系 2、删除role
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op

    const admin = await ctx.model.Admin.findOne({ where: { id: idArr[0] } })
    return ctx.model.transaction(t => {
      return admin.setRoles([], { transaction: t }).then(async () => {
        return admin.destroy()
      })
    }).then(res => {
      return res
    }).catch(err => {
      throw new Error(err)
    })
  }
}
module.exports = AdminService;