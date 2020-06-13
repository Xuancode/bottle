/*
 * @Author: xuanpl
 * @Date: 2020-06-01 22:02:38
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:13:30
 * @Description: file content
 * @FilePath: /bottle/app/model/union.js
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Union = app.model.define('union', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    unionid: {
      type: STRING(100),
      allowNull: false,
      unique: true
    },
    created_at: DATE,
    updated_at: DATE
  });

  Union.associate = function () {
    app.model.Union.belongsToMany(app.model.User, { through: app.model.UserUnion, foreignKey: 'union_id' }),
      app.model.Union.belongsToMany(app.model.Building, { through: app.model.BuildingUnion, foreignKey: 'union_id' }),
      app.model.Union.belongsToMany(app.model.Wechat, { through: app.model.WechatUnion, foreignKey: 'union_id' })
  }
  return Union
}