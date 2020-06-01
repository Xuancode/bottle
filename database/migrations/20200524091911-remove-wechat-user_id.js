'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('wechat', 'user_id')
  },
  // 在执行数据库降级时调用的函数, 此处大概率失败，因为外键约束存在，user_id又无值
  down: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    await queryInterface.addColumn('wechat', 'user_id', {
      type: STRING(30), 
      allowNull: false, 
      references: {
        model: "user",
        key: "user_id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    })
  }
}