'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize

  const Admin_item = app.model.define('admin_item', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: {
      type: STRING(30),
      allowNull: false,
      onDelete: "CASCADE"
    },
    item_id: {
      type: BIGINT(15),
      allowNull: false,
      onDelete: "CASCADE"
    },
    is_delete: {
      type: INTEGER(1),
      defaultValue: 0
    },
    created_at: DATE,
    updated_at: DATE,
  })

  return Admin_item;
}