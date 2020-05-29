'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Userlogin = app.model.define('userlogin', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: STRING(30), 
      allowNull: false, 
      references: {
        model: "user",
        key: "user_id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    // 应用项目, 瓶子小程序： 110, 万事通订阅号： 210, 生活服务号： 310
    type: {
      type: STRING(5),
      allowNull: false, 
    },
    // 平台类型，0为小程序，1为H5
    app_type: {
      type: INTEGER,
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE
  })

  Userlogin.associate = function() {
    app.model.Userlogin.belongsTo(app.model.User, {as: 'loginRecord', foreignKey: 'user_id'})
  }
  return Userlogin;
};