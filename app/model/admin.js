'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Admin = app.model.define('admin', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    user_name: {
      type: STRING(20),
      allowNull: false
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
    },
    permission: {
      type: STRING,
      allowNull: true
    }
  });

  Admin.associate = function() {
    app.model.Admin.hasMany(app.model.Movie, {constraints: false, foreignKey: 'admin_id' , targetKey: 'admin_id'}),
    app.model.Admin.belongsToMany(app.model.Item, { through: 'admin_item', foreignKey: 'admin_id' }),
    app.model.Admin.belongsToMany(app.model.Role, { through: 'admin_role', foreignKey: 'admin_id' })
  }
  return Admin
}