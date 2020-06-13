/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:08:09
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:15:01
 * @Description: file content
 * @FilePath: /bottle/app/model/building.js
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Building = app.model.define('building', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    label: {
      type: STRING(30),
      allowNull: false
    },
    address: {
      type: STRING(100),
      allowNull: false
    },
    latitude: {
      type: STRING(20),
      allowNull: false
    },
    longitude: {
      type: STRING(20),
      allowNull: false
    },
    tel: {
      type: STRING(12),
      allowNull: false
    },
    remark: {
      type: STRING(100),
      allowNull: true
    },
    created_at: DATE,
    updated_at: DATE,
    is_delete: {
      type: TINYINT(1),
      defaultValue: 0
    }
  })

  Building.associate = function () {
    app.model.Building.hasMany(app.model.Room, { foreignKey: 'id', targetKey: 'building_id' }),
      app.model.Building.belongsToMany(app.model.Union, { through: app.model.BuildingUnion, foreignKey: 'building_id' }),
      app.model.Building.belongsToMany(app.model.Photo, { through: app.model.BuildingPhoto, foreignKey: 'building_id' })
  }
  return Building
}