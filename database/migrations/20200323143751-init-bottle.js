/*
 * @Author: xuanpl
 * @Date: 2020-03-23 22:37:51
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 18:12:10
 * @Description: file content
 * @FilePath: /bottle/database/migrations/20200323143751-init-bottle.js
 */
'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('bottle', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      text: STRING(200),
      number: INTEGER(10),
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
      },
      wechat_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: "wechat",
          key: "openid"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('bottle')
  },
};