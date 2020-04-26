'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 admin 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TINYINT } = Sequelize;
    await queryInterface.createTable('movie', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: {
        type: STRING(50),
        allowNull: false,
        unique: true,
      },
      link: {
        type: STRING(500),
        allowNull: false
      },
      pass_code: {
        type: STRING(20),
        allowNull: true
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
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
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
      introduction: {
        type: STRING,
        allowNull: true
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 movie 表
  down: async queryInterface => {
    await queryInterface.dropTable('movie')
  },
};