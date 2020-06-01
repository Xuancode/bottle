'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const WxUserinfo = app.model.define('wxUserinfo', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    nickname: STRING(30),
    sex: INTEGER(1),
    language: STRING(10),
    city: STRING(20),
    province: STRING(100),
    country: STRING(50),
    headimgurl: STRING(),
    privilege: STRING(100),
    unionid: {
      type: STRING(100),
      allowNull: true,
      unique: true
    },
    created_at: DATE,
    updated_at: DATE
  });

  WxUserinfo.associate = function () {
    // app.model.WxUserinfo.hasMany(app.model.Comment, {constraints: false})
    app.model.WxUserinfo.belongsTo(app.model.User, {constraints: false, as: 'wxUserinfo', foreignKey: 'user_id'})
    // app.model.Wechat.belongsTo(app.model.User)
  }
  return WxUserinfo;
};