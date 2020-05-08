'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 role 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize
    await queryInterface.createTable('role', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      label: {
        type: STRING(20),
        allowNull: false,
        unique: true
      },
      desc: {
        type: STRING(500),
        allowNull: true,
        defaultValue: ''
      },
      // 状态有， 启用， 禁用;修改列表时会自动置为启用
      state: {
        type: INTEGER(1),
        defaultValue: 1
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 role 表
  down: async queryInterface => {
    await queryInterface.dropTable('role')
  },
}