'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('list', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING(200),
      src_img: STRING(200),
      side_imgs: STRING(400),
      is_delete: INTEGER(1),
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
        allowNull: true, 
        // references: {
        //   model: "user",
        //   key: "id"
        // },
        // onUpdate: "CASCADE",
        // // onDelete: "SET_NULL"
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