'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('comments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      content: STRING(200),
      has_delete: INTEGER,  // 是否已删除，默认0，1为删除
      // 判断是否存在回复关系
      parentsId: {
        type: INTEGER, 
        allowNull: true
      },
      listId: {
        type: INTEGER, 
        allowNull: false,
        references: {
          modle: "Lists",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      userId: {
        type: INTEGER, 
        allowNull: true, 
        references: {
          modle: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      created_at: DATE,
      updated_at: DATE
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('comments');
  },
};