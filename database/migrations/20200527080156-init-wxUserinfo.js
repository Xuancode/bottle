'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 wxUserinfo 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TINYINT } = Sequelize;
    await queryInterface.createTable('wxUserinfo', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      nickname: STRING(30),
      sex: INTEGER(1),
      language: STRING(10),
      city: STRING(20),
      province: STRING(100),
      country: STRING(50),
      headimgurl: STRING(),
      privilege: STRING(100),
      unionid: {
        type: STRING(100),
        unique: true,
        allowNull: true,
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数，删除 wxUserinfo 表
  down: async queryInterface => {
    await queryInterface.dropTable('wxUserinfo')
  },
};