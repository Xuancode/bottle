'use strict';

module.exports = app => {
  const { STRING,TINYINT, INTEGER, DATE } = app.Sequelize;

  const List = app.model.define('list', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING(200),
    src_img: STRING(200),
    side_imgs: STRING(1000),
    is_delete: {
      type: TINYINT(1),
      defaultValue: false
    },
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
    answer_times: {
      type: INTEGER, 
      allowNull: false, 
      defaultValue: 0
    },
    hots: {
      type: INTEGER, 
      allowNull: false, 
      defaultValue: 100
    },
    created_at: DATE,
    updated_at: DATE
  });

  List.associate = function() {
    app.model.List.belongsTo(app.model.User, {foreignKey: 'user_id' , targetKey: 'id'});
    app.model.List.hasMany(app.model.Comment, {constraints: false});
  }

  return List;
};