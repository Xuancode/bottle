'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Wechat = app.model.define('wechat', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    session_key: STRING(100),
    openid: STRING(100),
    created_at: DATE,
    updated_at: DATE,
    user_id: {
      type: STRING(30), 
      allowNull: false, 
      references: {
        model: "user",
        key: "user_id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  });

  Wechat.associate = function() {
    app.model.Wechat.belongsTo(app.model.User, {foreignKey: 'user_id' , targetKey: 'user_id', as: 'user'})
    // app.model.Wechat.belongsTo(app.model.User, {as: 'user'})
    // app.model.Wechat.belongsTo(app.model.User)
  }

  return Wechat;
};