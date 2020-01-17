'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('user', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      created_at: DATE,
      updated_at: DATE,
      avatar: {
        type: STRING,
        defaultValue: 'http://q3zie9bz3.bkt.clouddn.com/http://tmp/wx27d8d47c69b319c9.o6zAJs6qwYjcD2peZNWp1gl52NO0.TA4nkxQbZf2597eff96b8dcb35a2f032b04e5043f3d3.png'
      },
      introduce: {
        type: STRING,
        defaultValue: '我有个朋友，求我p个图'
      },
      phone: STRING(100)
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('user');
  },
};