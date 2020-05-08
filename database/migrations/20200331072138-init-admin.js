'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 admin 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TINYINT } = Sequelize;
    await queryInterface.createTable('admin', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      user_name: {
        type: STRING(20),
        allowNull: false,
        unique: true,
      },
      pass_word: {
        type: STRING(20),
        allowNull: false
      },
      avatar: {
        type: STRING(300),
        defaultValue: ''
      },
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
      },
      phone: {
        type: STRING(15),
        defaultValue: 0
      },
      admin_id: {
        type: STRING(30),
        unique: true,
        allowNull: false
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数，删除 admin 表
  down: async queryInterface => {
    await queryInterface.dropTable('admin');
  },
};