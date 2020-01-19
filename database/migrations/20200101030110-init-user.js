'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TINYINT } = Sequelize;
    await queryInterface.createTable('user', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      created_at: DATE,
      updated_at: DATE,
      avatar: {
        type: STRING,
        defaultValue: ''
      },
      introduce: {
        type: STRING,
        defaultValue: '我有个朋友，求我p个图'
      },
      is_editor: {
        type: TINYINT(1),
        defaultValue: false
      },
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
      },
      phone: {
        type: INTEGER(11),
        defaultValue: ''
      },
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('user');
  },
};