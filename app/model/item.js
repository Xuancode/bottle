'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, BIGINT } = app.Sequelize

  const Item = app.model.define('item', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    item_name: {
      type: STRING(20),
      allowNull: false,
      unique: true,
    },
    item_id: {
      type: BIGINT(15), 
      allowNull: true,
      unique: true,
    },
    // 项目的管理员
    admin_id: {
      type: STRING(30),
      allowNull: false,
      references: {
        model: "admin",
        key: "admin_id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    item_info: {
      type: STRING(100),
      defaultValue: ''
    },
    // 状态有， 启用， 禁用;修改列表时会自动置为启用
    state: {
      type: INTEGER(1),
      defaultValue: 1
    },
    is_delete: {
      type: INTEGER(1),
      defaultValue: 0
    },
    created_at: DATE,
    updated_at: DATE,
  })

  Item.associate = function() {
    app.model.Item.belongsToMany(app.model.Admin, { as: 'items', through: 'admin_item', foreignKey: 'item_id' })
  }

  return Item;
}