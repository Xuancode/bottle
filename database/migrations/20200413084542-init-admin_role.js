'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 admin_role 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TINYINT } = Sequelize
    await queryInterface.createTable('admin_role', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      admin_id: {
        type: STRING(30),
        allowNull: false,
        onDelete: "CASCADE"
      },
      role_id: {
        type: INTEGER, // 13位时间戳+2位随机数
        allowNull: false,
        onDelete: "CASCADE"
      },
      is_delete: {
        type: INTEGER(1),
        defaultValue: 0
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 admin_role 表
  down: async queryInterface => {
    await queryInterface.dropTable('admin_role')
  },
}