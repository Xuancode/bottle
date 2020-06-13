/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:08:09
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 16:01:59
 * @Description: file content
 * @FilePath: /bottle/app/model/photo.js
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Photo = app.model.define('photo', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    label: {
      type: STRING(30),
      allowNull: true,
      defaultValue: ''
    },
    urls: {
      type: STRING,
      allowNull: false
    },
    // 210: 楼栋照片， 211：房间照片
    photo_type: {
      type: INTEGER(3),
      allowNull: false
    },
    created_at: DATE,
    updated_at: DATE,
    is_delete: {
      type: TINYINT(1),
      defaultValue: 0
    }
  })

  Photo.associate = function () {
    app.model.Photo.belongsToMany(app.model.Room, { through: app.model.RoomPhoto, foreignKey: 'photo_id' }),
      app.model.Photo.belongsToMany(app.model.Building, { through: app.model.BuildingPhoto, foreignKey: 'photo_id' })
  }
  return Photo
}