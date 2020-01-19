'use strict';

// const Controller = require('egg').Controller;

// class User extends Model {}
// const { STRING, INTEGER, DATE } = app.Sequelize;
// User.init({
//   id: { type: INTEGER, primaryKey: true, autoIncrement: true },
//   name: app.Sequelize.STRING(30),
//   phone: app.Sequelize.INTEGER(11),
//   created_at: app.Sequelize.DATE,
//   updated_at: app.Sequelize.DATE,
// }, { app.Sequelize, modelName: 'user' });






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
      defaultValue: '我有个朋友，求我p个图'
    },
    is_editor: {
      type: TINYINT(1),
      defaultValue: false
    },
    is_delete: {
      type: TINYINT(1),
      defaultValue: false
    },
    created_at: DATE,
    updated_at: DATE,
  });
  // console.log(app.Sequelize.User)
  // console.log(User)
  // console.log(User)
  // User.hasOne(app.model.Wechat)
  User.associate = function() {
    app.model.User.hasOne(app.model.Wechat, {constraints: false})
    app.model.User.hasMany(app.model.List, {constraints: false})
    app.model.User.hasMany(app.model.Comment, {constraints: false})
    // app.model.Wechat.belongsTo(app.model.User, {as: 'user'})
    // app.model.Wechat.belongsTo(app.model.User)
  }
  return User;
};