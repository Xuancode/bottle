'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('wechat_union', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      union_id: {
        type: STRING(100),
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      wechat_id:{
        type: STRING(100),
        allowNull: false,
        unique: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('wechat_union')
  },
}