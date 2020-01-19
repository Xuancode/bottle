'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('comment', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      content: STRING(200),
      is_delete: {
        type: INTEGER(1), 
        defaultValue: 0
      }, // 是否已删除，默认0，1为删除
      // 判断是否存在回复关系
      parents_id: {
        type: INTEGER, 
        allowNull: true
      },
      list_id: {
        type: INTEGER, 
        allowNull: false,
        references: {
          model: "list",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      user_id: {
        type: INTEGER, 
        allowNull: true, 
        references: {
          model: "user",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      imgs: {
        type: STRING,
        defaultValue: ''
      },
      hots: {
        type: INTEGER,
        defaultValue: 100
      },
      is_editor: {
        type: INTEGER(1),
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('comment');
  },
};