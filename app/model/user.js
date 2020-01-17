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
    avatar: {
      type: STRING,
      defaultValue: 'http://q3zie9bz3.bkt.clouddn.com/http://tmp/wx27d8d47c69b319c9.o6zAJs6qwYjcD2peZNWp1gl52NO0.TA4nkxQbZf2597eff96b8dcb35a2f032b04e5043f3d3.png'
    },
    introduce: {
      type: STRING,
      defaultValue: '我有个朋友，求我p个图'
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