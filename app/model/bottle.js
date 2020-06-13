/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 18:11:57
 * @Description: file content
 * @FilePath: /bottle/app/model/bottle.js
 */
'use strict';

module.exports = app => {
  const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;

  const Bottle = app.model.define('bottle', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    text: STRING(200),
    number: INTEGER(10),
    is_delete: {
      type: TINYINT(1),
      defaultValue: false
    },
    wechat_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: "wechat",
        key: "openid"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    created_at: DATE,
    updated_at: DATE
  });

  Bottle.associate = function () {
    app.model.Bottle.belongsTo(app.model.Wechat, { foreignKey: 'wechat_id' })
  }

  return Bottle;
};