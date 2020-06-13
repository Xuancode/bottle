/*
 * @Author: xuanpl
 * @Date: 2020-06-13 11:21:15
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:01:43
 * @Description: 关系表
 * @FilePath: /bottle/database/migrations/20200613032229-init-building_union.js
 */
'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('building_union', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      building_id: {
        type: INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      union_id: {
        type: INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('building_union')
  },
}