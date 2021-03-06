/*
 * @Author: xuanpl
 * @Date: 2020-03-31 15:19:25
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:11:52
 * @Description: file content
 * @FilePath: /bottle/app/model/admin.js
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Admin = app.model.define('admin', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    user_name: {
      type: STRING(20),
      allowNull: false,
      unique: true
    },
    pass_word: {
      type: STRING(20),
      allowNull: false
    },
    created_at: DATE,
    updated_at: DATE,
    avatar: {
      type: STRING,
      defaultValue: ''
    },
    is_delete: {
      type: TINYINT(1),
      defaultValue: false
    },
    phone: {
      type: STRING(15),
      defaultValue: 0
    },
    admin_id: {
      type: STRING(30),
      unique: true,
      allowNull: false
    }
  });

  Admin.associate = function () {
    app.model.Admin.hasMany(app.model.Movie, { constraints: false, foreignKey: 'admin_id', targetKey: 'admin_id' }),
      app.model.Admin.belongsToMany(app.model.Role, { through: 'admin_role', foreignKey: 'admin_id' }), // 此处一直加不上别名，加上后多对多关系就失效，未知原因
      app.model.Admin.belongsToMany(app.model.Item, { through: 'admin_item', foreignKey: 'admin_id' })
  }
  return Admin
}