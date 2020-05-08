'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize

  const Permission = app.model.define('permission', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    label: {
      type: STRING(20),
      allowNull: false
    },
    router: {
      type: STRING(20),
      allowNull: true
    },
    url: {
      type: STRING(30),
      allowNull: true,
      defaultValue: ''
    },
    parent_id: {
      type: INTEGER(30),
      allowNull: true,
      references: {
        model: "permission",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    // 状态有， 启用， 禁用;修改列表时会自动置为启用
    state: {
      type: INTEGER(1),
      defaultValue: 1
    },
    created_at: DATE,
    updated_at: DATE,
  })

  Permission.associate = function() {
    app.model.Permission.belongsToMany(app.model.Role, { as: 'Role', through: 'role_permission', foreignKey: 'permission_id' })
    app.model.Permission.hasMany(app.model.Permission, {as: 'children', foreignKey: 'parent_id'})
  }

  return Permission;
}