'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('wechat', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      session_key: STRING(100),
      openid: STRING(100),
      created_at: DATE,
      updated_at: DATE,
      user_id: {
        type: STRING(30), 
        allowNull: false, 
        references: {
          model: "user",
          key: "user_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('wechat');
  },
};