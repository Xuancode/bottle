'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('userlogin', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: STRING(30), 
        allowNull: false, 
        references: {
          model: "user",
          key: "user_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      // 应用项目, 瓶子小程序： 110, 万事通订阅号： 210, 生活服务号： 310
      type: {
        type: STRING(5),
        allowNull: false, 
      },
      // 平台类型，0为小程序，1为H5
      app_type: {
        type: INTEGER,
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数
  down: async queryInterface => {
    await queryInterface.dropTable('userlogin')
  },
}