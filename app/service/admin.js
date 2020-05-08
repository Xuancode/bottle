const Service = require('egg').Service;
function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class AdminService extends Service {
  async createAdmin(data, roleArr) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    return ctx.model.transaction(t => {
      return ctx.model.Admin.create({...data}, {transaction: t}).then(async admin => {
        if (roleArr && roleArr.length !=0) {
          const roles = await ctx.model.Role.findAll({where: {id: {[Op.in]: roleArr}}})
          admin.setRoles(roles)
        }
        return admin
      })
    }).then(result => {
      return result
    }).catch(err => {
      throw new Error(err)
    })
  }
  async getAdmin(page, size) {
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    const whereSql = [
      { is_delete: 0}
    ]
    const resData = await ctx.model.Admin.findAndCountAll({
      attributes: { exclude: ['createdAt', 'updatedAt']},
      where: whereSql[0],
      include: [
        {
          model: ctx.model.Role, 
          attributes: ['id']
        }
      ],
      order: [['created_at']],
      limit: size,
      distinct: true, // 重要！加该选项避免查出错误的count值
      offset: size * (page -1)
    })
    // console.log(resData)

    let arr = JSON.parse(JSON.stringify(resData)).rows
    // 只返回id数组
    arr.map((item) => {
      item.role_id = []
      for (let i = 0; i < item.roles.length; i++) {
        const ele = item.roles[i]
        item.role_id.push(ele.id)
      }
      delete item['roles']
    })

    let pagination = {
      total: resData.count,
      count: resData.rows.length,
      size: size,
      page: page,
      total_pages: parseInt((resData.count + size -1 ) / size)
    }
    
    return {data: arr, meta: {pagination: pagination}}
  }
  /** 通过token查找用户 */
  async getAdminByToken(token) {
    let ctx = this.ctx
    const name = 'admin' // 后都改为token的方式
    const admin_id = 40
    const resData = await ctx.model.Admin.findOne({
      where: {user_name: name},
      include: {
        model: ctx.model.Role
      }
    })
    const permissionInfo = await ctx.service.permission.getRouterByAdminID(admin_id, ctx)
    console.log(permissionInfo)
    // resData.permissions = permissionInfo
    let data = JSON.parse(JSON.stringify(resData))
    data = Object.assign(data, {permissions: permissionInfo})
    return {data}
  }

  /** 修改用户信息 */
  async updateAdmin(obj, id, role_id) {
    // 使用事务修改角色信息后，修改关联的权限
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    // 查出admin实例化
    let admin = await ctx.model.Admin.findOne({
      where: {id},
      include: ctx.model.Role
    })
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        admin[key] = obj[key]
      }
    }
    // 使用事务修改信息
    return ctx.model.transaction(t => {
      return admin.save({transaction: t}).then(async (res) => {
        const roles = await ctx.model.Role.findAll({where: {id: {[Op.in]: role_id}}})
        res.setRoles(roles)
        return 123
      })
    }).then(result => {
      return result
    }).catch(err => {
      throw new Error(err)
    })
  }

  async destroyAdmin(idArr) {
    // 1、删除role的关系 2、删除role
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    
    const admin = await ctx.model.Admin.findOne({where: {id: idArr[0]}})
    return ctx.model.transaction(t => {
      return admin.setRoles([], {transaction: t}).then(async () => {
        return admin.destroy()
      })
    }).then(res=> {
      return res
    }).catch(err=> {
      throw new Error(err)
    })
  }
}
module.exports = AdminService;