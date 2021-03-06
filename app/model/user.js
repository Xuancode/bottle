'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    phone: {
      type: STRING(15),
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
    app.model.User.belongsToMany(app.model.Union, {through: app.model.UserUnion, foreignKey: 'user_id'}),
    app.model.User.hasMany(app.model.Bottle, {constraints: false, foreignKey: 'user_id' , targetKey: 'user_id'})
  }
  return User;
};