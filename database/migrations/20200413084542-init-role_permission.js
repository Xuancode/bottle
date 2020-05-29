'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 role_permission 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize
    await queryInterface.createTable('role_permission', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      role_id: {
        type: INTEGER,
        allowNull: false,
        onDelete: "CASCADE"
      },
      permission_id: {
        type: INTEGER, 
        allowNull: false,
        onDelete: "CASCADE"
      },
      status: {
        type: INTEGER(1),
        defaultValue: 0
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 role_permission 表
  down: async queryInterface => {
    await queryInterface.dropTable('role_permission')
  },
}