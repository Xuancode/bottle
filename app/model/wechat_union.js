'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize

  const Wechat_union = app.model.define('wechat_union', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    union_id: {
      type: STRING(100),
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    wechat_id:{
      type: STRING(100),
      allowNull: false,
      unique: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    created_at: DATE,
    updated_at: DATE
  })

  return Wechat_union
}