'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Union = app.model.define('union', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    unionid: {
      type: STRING(100),
      allowNull: false,
      unique: true
    },
    created_at: DATE,
    updated_at: DATE
  });

  Union.associate = function() {
    app.model.Union.belongsToMany(app.model.User, { through: app.model.UserUnion, foreignKey: 'union_id' }),
    // app.model.Union.belongsToMany(app.model.Wechat, { through: app.model.WechatUnion, foreignKey: 'unionid' }) // 成功的版本
    app.model.Union.belongsToMany(app.model.Wechat, { through: app.model.WechatUnion, foreignKey: 'union_id' })
  }
  return Union
}