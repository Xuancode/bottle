'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, BIGINT } = app.Sequelize

  const Reply = app.model.define('reply', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    question: {
      type: STRING(40),
      allowNull: false,
      unique: true,
    },
    content: {
      type: STRING(1000),
      allowNull: true
    },
    item_id: {
      type: BIGINT(15), // 13位时间戳+2位随机数
      allowNull: true,
      references: {
        model: "item",
        key: "item_id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
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
    hot: {
      type: INTEGER(10),
      defaultValue: 0
    },
    // 状态有， 启用， 禁用;修改列表时会自动置为启用
    state: {
      type: STRING(10),
      defaultValue: '启用'
    },
    created_at: DATE,
    updated_at: DATE,
  })

  Reply.associate = function() {
    app.model.Reply.belongsTo(app.model.Admin, {foreignKey: 'admin_id' , targetKey: 'admin_id'})
    app.model.Reply.belongsTo(app.model.Item, {foreignKey: 'item_id' , targetKey: 'item_id'})
  }

  return Reply;
}