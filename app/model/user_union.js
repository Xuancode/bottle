'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize

  const User_union = app.model.define('user_union', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    union_id: {
      type: STRING(100),
      allowNull: false,
      unique: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    user_id: {
      type: STRING(30),
      unique: true,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    created_at: DATE,
    updated_at: DATE
  })
  return User_union
}