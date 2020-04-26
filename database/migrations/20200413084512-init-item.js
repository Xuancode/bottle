'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 item 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, BIGINT } = Sequelize
    await queryInterface.createTable('item', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      item_name: {
        type: STRING(20),
        allowNull: false,
        unique: true,
      },
      item_id: {
        type: BIGINT(15), // 13位时间戳+2位随机数
        allowNull: true,
        unique: true,
      },
      // 项目的管理员
      admin_id: {
        type: STRING(30),
        allowNull: false,
        references: {
          model: "admin",
          key: "admin_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      item_info: {
        type: STRING(100),
        defaultValue: ''
      },
      // 状态有， 启用， 禁用;修改列表时会自动置为启用
      state: {
        type: INTEGER(1),
        defaultValue: 1
      },
      is_delete: {
        type: INTEGER(1),
        defaultValue: 0
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 item 表
  down: async queryInterface => {
    await queryInterface.dropTable('item')
  },
};