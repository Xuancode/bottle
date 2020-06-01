'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize
    await queryInterface.addColumn('wechat', 'access_token', {
      type: STRING(100),
      allowNull: true,
      defaultValue: ''
    })
  },
  // 在执行数据库降级时调用的函数
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('wechat', 'access_token')
  }
}