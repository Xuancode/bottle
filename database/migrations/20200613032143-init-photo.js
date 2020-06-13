/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:21:15
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 16:01:45
 * @Description: photo表，照片
 * @FilePath: /bottle/database/migrations/20200613032143-init-photo.js
 */
'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('photo', {
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
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('photo')
  },
}