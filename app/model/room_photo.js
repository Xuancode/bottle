/*
 * @Author: xuanpl
 * @Date: 2020-06-13 12:02:17
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:03:54
 * @Description: 关系表
 * @FilePath: /bottle/app/model/room_photo.js
 */
'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize

  const Room_photo = app.model.define('room_photo', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    room_id: {
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

  return Room_photo
}