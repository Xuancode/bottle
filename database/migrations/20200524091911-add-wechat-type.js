'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize
    await queryInterface.addColumn('wechat', 'type', {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },
  // 在执行数据库降级时调用的函数
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('wechat', 'type')
  }
}