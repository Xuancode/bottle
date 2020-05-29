'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize

  const Role_permission = app.model.define('role_permission', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    role_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: "CASCADE"
    },
    permission_id: {
      type: INTEGER, // 13位时间戳+2位随机数
      allowNull: false,
      onDelete: "CASCADE"
    },
    status: {
      type: INTEGER(1),
      defaultValue: 0
    },
    created_at: DATE,
    updated_at: DATE,
  })

  return Role_permission;
}