'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Comment = app.model.define('comment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    content: STRING(200),
    is_delete: {
      type: INTEGER(1), 
      defaultValue: 0
    }, // 是否已删除，默认0，1为删除
    // 判断是否存在回复关系
    parents_id: {
      type: INTEGER, 
      allowNull: false,
      defaultValue: 0
    },
    list_id: {
      type: INTEGER, 
      allowNull: false,
      references: {
          model: "list",
          key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
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
    imgs: {
      type: STRING,
      defaultValue: ''
    },
    hots: {
      type: INTEGER,
      defaultValue: 100
    },
    is_editor: {
      type: INTEGER(1),
      defaultValue: 0,
    },
    created_at: DATE,
    updated_at: DATE
  });

  Comment.associate = function() {
    // app.model.Comment.belongsTo(app.model.User, {foreignKey: 'user_id' , targetKey: 'id'})
    // app.model.Comment.belongsTo(app.model.List, {foreignKey: 'list_id' , targetKey: 'id', constraints: false})
  }

  return Comment;
};