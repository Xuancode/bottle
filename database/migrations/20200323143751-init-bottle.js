'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('bottle', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      text: STRING(200),
      number: INTEGER(10),
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
      },
      user_id: {
        type: STRING(30), 
        allowNull: false, 
        references: {
          model: "user",
          key: "user_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      created_at: DATE,
      updated_at: DATE
      })
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('bottle');
  },
};