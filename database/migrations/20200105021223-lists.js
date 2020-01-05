'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('lists', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING(200),
      src_img: STRING(200),
      side_imgs: Array,
      userId: {
        type: INTEGER, 
        allowNull: false, 
        references: {
          modle: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      editorId: {
        type: INTEGER, 
        allowNull: false, 
        references: {
          modle: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      openid: STRING(100),
      created_at: DATE,
      updated_at: DATE,
      userId: {
        type: INTEGER, 
        allowNull: false, 
        references: {
          modle: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('lists');
  },
};