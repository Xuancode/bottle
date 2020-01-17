'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, TINYINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('list', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING(200),
      src_img: STRING(200),
      side_imgs: STRING(1000),
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
      },
      user_id: {
        type: INTEGER, 
        allowNull: false, 
        references: {
          model: "user",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      editor_id: {
        type: INTEGER, 
        allowNull: false, 
        defaultValue: 0
      },
      created_at: DATE,
      updated_at: DATE
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('list');
  },
};