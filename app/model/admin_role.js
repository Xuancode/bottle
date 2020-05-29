'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Admin_role = app.model.define('admin_role', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: {
      type: STRING(30),
      allowNull: false,
      onDelete: "CASCADE"
    },
    role_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: "CASCADE"
    },
    is_delete: {
      type: INTEGER(1),
      defaultValue: 0
    },
    created_at: DATE,
    updated_at: DATE
  })

  return Admin_role
}