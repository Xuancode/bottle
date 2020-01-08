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
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    phone: INTEGER(11),
    created_at: DATE,
    updated_at: DATE,
  });
  // console.log(app.Sequelize.User)
  // console.log(User)
  // console.log(User)
  // User.hasOne(app.model.Wechat)
  User.associate = function() {
    app.model.User.hasOne(app.model.Wechat)
    app.model.User.hasMany(app.model.List)
    // app.model.Wechat.belongsTo(app.model.User, {as: 'user'})
    // app.model.Wechat.belongsTo(app.model.User)
  }
  return User;
};