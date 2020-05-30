'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn('wechat', 'session_key', {
          type: STRING(100),
          allowNull: false,
          defaultValue: ''
        }, { transaction: t }),
        queryInterface.changeColumn('wechat', 'openid', {
          type: STRING(100),
          allowNull: false,
          unique: true
        }, { transaction: t }),
        queryInterface.addColumn('wechat', 'type', {
          type: INTEGER,
          allowNull: false,
          defaultValue: 0
        }, { transaction: t }),
        queryInterface.addColumn('wechat', 'unionid', {
          type: STRING(100),
          allowNull: true,
          defaultValue: ''
        }, { transaction: t }),
        queryInterface.addColumn('wechat', 'access_token', {
          type: STRING(100),
          allowNull: true,
          defaultValue: ''
        }, { transaction: t }),
        queryInterface.addColumn('wechat', 'refresh_token', {
          type: STRING(100),
          allowNull: true,
          defaultValue: ''
        }, { transaction: t }),
        queryInterface.addColumn('wechat', 'isFocus', {
          type: INTEGER(2),
          allowNull: true
        }, { transaction: t })
      ])
    })
  },
  // 在执行数据库降级时调用的函数
  down: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn('wechat', 'session_key', {
          type: STRING(100),
          allowNull: true,
          defaultValue: null
        }, { transaction: t }),
        queryInterface.changeColumn('wechat', 'openid', {
          type: STRING(100)
        }, { transaction: t }),
        queryInterface.removeColumn('wechat', 'type', { transaction: t }),
        queryInterface.removeColumn('wechat', 'unionid', { transaction: t }),
        queryInterface.removeColumn('wechat', 'access_token', { transaction: t }),
        queryInterface.removeColumn('wechat', 'refresh_token', { transaction: t }),
        queryInterface.removeColumn('wechat', 'isFocus', { transaction: t })
      ])
    })
  },
}