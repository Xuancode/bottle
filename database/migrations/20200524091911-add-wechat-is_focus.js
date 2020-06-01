'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize
    await queryInterface.addColumn('wechat', 'is_focus', {
      type: INTEGER(2),
      allowNull: true
    })
  },
  // 在执行数据库降级时调用的函数
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('wechat', 'is_focus')
  }
}