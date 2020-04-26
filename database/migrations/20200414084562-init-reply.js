'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 reply 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, BIGINT } = Sequelize
    await queryInterface.createTable('reply', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      question: {
        type: STRING(40),
        allowNull: false,
        unique: true,
      },
      content: {
        type: STRING(1000),
        allowNull: true
      },
      item_id: {
        type: BIGINT(15), // 13位时间戳+2位随机数
        allowNull: true,
        references: {
          model: "item",
          key: "item_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
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
      hot: {
        type: INTEGER(10),
        defaultValue: 0
      },
      // 状态有， 启用， 禁用;修改列表时会自动置为启用
      state: {
        type: STRING(10),
        defaultValue: '启用'
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 reply 表
  down: async queryInterface => {
    await queryInterface.dropTable('reply')
  },
}