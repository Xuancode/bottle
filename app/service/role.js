const Service = require('egg').Service

class RoleService extends Service {
  async getPermissionByRole(labelStr) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const sql = labelStr ? { label: {[Op.in]: labelStr.split(',')} } : {label: {[Op.ne] : null}}

    const permission = await ctx.model.Role.findAll({
      // raw: true,  // 数据形式不包装
      where: sql,
      attributes: ['id', 'label','state', 'desc'],
      include: [
        {
          model: ctx.model.Permission, 
          attributes: ['id']
        }
      ]
    })
    const arr = JSON.parse(JSON.stringify(permission))
    // 只返回id数组
    arr.map((item) => {
      item.permissionId = []
      for (let i = 0; i < item.permissions.length; i++) {
        const ele = item.permissions[i]
        item.permissionId.push(ele.id)
      }
      delete item['permissions']
    })
    return arr
  }
  async createRole(label, idArr, desc) {
    const ctx = this.ctx
    // 如果带权限表就使用事务创建关系，不带则只创建角色
    const Op = this.app.Sequelize.Op
    if (idArr && idArr.length) {
      const permission = await ctx.model.Permission.findAll({where: {id: {[Op.in]: idArr}}})
      return ctx.model.transaction(t => {
        return ctx.model.Role.create({label, desc}, {transaction: t}).then(role => {
          role.addPermissions(permission, {through: {status: 1}})
          return role
        })
      }).then(result => {
        return result
      }).catch(err => {
        throw new Error(err)
      })
    } else {
      return ctx.model.Role.create({label, desc})
    }
  }
  async updateRolePerminssion(obj, id, idArr) {
    // 使用事务修改角色信息后，修改关联的权限
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const role = await ctx.model.Role.findOne({where: {id: id}})
    const permission = await ctx.model.Permission.findAll({where: {id: {[Op.in]: idArr}}})
    if (!role || !permission) {
      throw new Error('角色或权限不存在')
    }

    return ctx.model.transaction(t => {
      return role.setPermissions(permission, {through: {status: 1}}, {transaction: t}).then(() => {
        return role.update(obj, {where: {id: id}})
      })
    })
  }
  async destroyRole(idArr) {
    // 1、删除各个role的关系 2、删除role
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    
    const roles = await ctx.model.Role.findAll({where: {id: {[Op.in]: idArr}}})

    return roles.map( item => {
      return ctx.model.transaction(t => {
        return item.setPermissions([], {transaction: t}).then(() => {
          return item.destroy()
        })
      })
    })
  }
}

module.exports = RoleService