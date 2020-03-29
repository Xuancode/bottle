'use strict';

module.exports = app => {
  const { STRING,TINYINT, INTEGER, DATE } = app.Sequelize;

  const Bottle = app.model.define('bottle', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    text: STRING(200),
    number: INTEGER(10),
    is_delete: {
      type: TINYINT(1),
      defaultValue: false
    },
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
    created_at: DATE,
    updated_at: DATE
  });

  Bottle.associate = function() {
    app.model.Bottle.belongsTo(app.model.User, {foreignKey: 'user_id' , targetKey: 'user_id'});
  }

  return Bottle;
};