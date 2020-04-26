'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize

  const Role = app.model.define('role', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    label: {
      type: STRING(20),
      allowNull: false,
      unique: true
    },
    desc: {
      type: STRING(500),
      allowNull: true,
      defaultValue: ''
    },
    // 状态有， 启用， 禁用;修改列表时会自动置为启用
    state: {
      type: INTEGER(1),
      defaultValue: 1
    },
    created_at: DATE,
    updated_at: DATE,
  })

  Role.associate = function() {
    app.model.Role.belongsToMany(app.model.Permission, { through: 'role_permission', foreignKey: 'role_id'}),
    app.model.Role.belongsToMany(app.model.Admin, { through: 'admin_role', foreignKey: 'role_id'})
  }

  return Role;
}