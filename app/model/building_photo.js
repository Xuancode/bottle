/*
 * @Author: xuanpl
 * @Date: 2020-06-13 12:02:18
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:04:52
 * @Description: file content
 * @FilePath: /bottle/app/model/building_photo.js
 */
'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize

  const Building_photo = app.model.define('building_photo', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    building_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    photo_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    created_at: DATE,
    updated_at: DATE
  })

  return Building_photo
}