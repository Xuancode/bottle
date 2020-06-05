'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('union', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      unionid: {
        type: STRING(100),
        allowNull: false,
        unique: true
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('union')
  },
}