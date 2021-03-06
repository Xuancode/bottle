'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Wechat = app.model.define('wechat', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    session_key: {
      type: STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    openid: {
      type: STRING(100),
      allowNull: false,
      unique: true
    },
    type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at: DATE,
    updated_at: DATE,
    access_token: {
      type: STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    refresh_token: {
      type: STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    is_focus: {
      type: INTEGER(2),
      allowNull: true
    }
  })

  Wechat.associate = function() {
    app.model.Wechat.belongsToMany(app.model.Union, { through: app.model.WechatUnion, foreignKey: 'wechat_id' })
    // app.model.Admin.belongsToMany(app.model.Item, {through: 'admin_item', foreignKey: 'admin_id' })
  }
  return Wechat
};