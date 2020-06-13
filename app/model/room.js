/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:08:09
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:18:24
 * @Description: file content
 * @FilePath: /bottle/app/model/room.js
 */
'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Room = app.model.define('room', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    label: {
      type: STRING(30),
      allowNull: false
    },
    beadroom: {
      type: INTEGER(1),
      allowNull: false
    },
    hall: {
      type: INTEGER(1),
      allowNull: false
    },
    furniture: {
      type: STRING(500),
      allowNull: true
    },
    size: {
      type: INTEGER(3),
      allowNull: true
    },
    pay_type: {
      type: STRING(50),
      allowNull: true
    },
    price: {
      type: INTEGER(5),
      allowNull: false
    },
    floor: {
      type: INTEGER(3),
      allowNull: false
    },
    net: {
      type: INTEGER(1),
      allowNull: true
    },
    building_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: "building",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    remark: {
      type: STRING(200),
      allowNull: true
    },
    created_at: DATE,
    updated_at: DATE,
    is_delete: {
      type: TINYINT(1),
      defaultValue: 0
    }
  })

  Room.associate = function () {
    app.model.Room.belongsTo(app.model.Building, { foreignKey: 'building_id' }),
      app.model.Room.belongsToMany(app.model.Photo, { through: app.model.RoomPhoto, foreignKey: 'room_id' })
  }
  return Room
}