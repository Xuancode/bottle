'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const List = app.model.define('list', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING(200),
    src_img: STRING(200),
    side_imgs: STRING(400),
    is_delete: INTEGER(1),
    user_id: {
      type: INTEGER, 
      allowNull: false, 
      references: {
        model: "user",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    editor_id: {
      type: INTEGER, 
      allowNull: true, 
    },
    created_at: DATE,
    updated_at: DATE
  });

  List.associate = function() {
    app.model.List.belongsTo(app.model.User, {foreignKey: 'user_id' , targetKey: 'id'});
    app.model.List.hasMany(app.model.Comment);
  }

  return List;
};