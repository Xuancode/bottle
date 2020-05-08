'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 permission 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TINYINT } = Sequelize
    await queryInterface.createTable('permission', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      label: {
        type: STRING(20),
        allowNull: false
      },
      router: {
        type: STRING(20),
        allowNull: true
      },
      url: {
        type: STRING(30),
        allowNull: true,
        defaultValue: ''
      },
      parent_id: {
        type: INTEGER(30),
        allowNull: true,
        references: {
          model: "permission",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
  // 在执行数据库降级时调用的函数，删除 permission 表
  down: async queryInterface => {
    await queryInterface.dropTable('permission')
  },
}