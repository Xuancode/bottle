/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:21:15
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 11:24:48
 * @Description: building表，楼栋信息
 * @FilePath: /bottle/database/migrations/20200613032115-init-building.js
 */
'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('building', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      label: STRING(30),
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
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('building')
  },
}