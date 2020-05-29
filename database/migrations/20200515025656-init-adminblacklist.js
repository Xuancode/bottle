'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 adminblacklist 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('adminblacklist', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      token: STRING(),
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数，删除 adminblacklist 表
  down: async queryInterface => {
    await queryInterface.dropTable('adminblacklist');
  },
}