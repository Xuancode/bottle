'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    phone: {
      type: INTEGER(11),
      defaultValue: ''
    },
    avatar: {
      type: STRING,
      defaultValue: ''
    },
    introduce: {
      type: STRING,
      defaultValue: '这家伙很懒，没有添加自我介绍哦'
    },
    is_delete: {
      type: TINYINT(1),
      defaultValue: false
    },
    user_id: {
      type: STRING(30),
      unique: true,
      allowNull: false
    },
    created_at: DATE,
    updated_at: DATE,
  });

  User.associate = function() {
    app.model.User.hasOne(app.model.Wechat, {constraints: false, foreignKey: 'user_id' , targetKey: 'user_id'})
    app.model.User.hasMany(app.model.Bottle, {constraints: false, foreignKey: 'user_id' , targetKey: 'user_id'})
    // app.model.User.hasMany(app.model.Comment, {constraints: false})
    // app.model.Wechat.belongsTo(app.model.User, {as: 'user'})
    // app.model.Wechat.belongsTo(app.model.User)
  }
  return User;
};