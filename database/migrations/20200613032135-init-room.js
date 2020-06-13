/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:21:15
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 11:50:13
 * @Description: room表，房间信息
 * @FilePath: /bottle/database/migrations/20200613032135-init-room.js
 */
'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('room', {
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
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('room')
  },
}