'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    await queryInterface.changeColumn('wechat', 'session_key', {
      type: STRING(100),
      allowNull: false,
      defaultValue: ''
    })
  },
  // 在执行数据库降级时调用的函数
  down: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    await queryInterface.changeColumn('wechat', 'session_key', {
      type: STRING(100)
    }, { transaction })
  }
}