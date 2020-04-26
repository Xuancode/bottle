'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize

  const Movie = app.model.define('movie', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: {
        type: STRING(50),
        allowNull: false,
        unique: true,
      },
      link: {
        type: STRING(500),
        allowNull: false
      },
      pass_code: {
        type: STRING(20),
        allowNull: true
      },
      admin_id: {
        type: STRING(30),
        allowNull: false,
        references: {
          model: "admin",
          key: "admin_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      hot: {
        type: INTEGER(10),
        defaultValue: 0
      },
      is_delete: {
        type: TINYINT(1),
        defaultValue: false
      },
      // 状态有， 启用， 禁用，修改列表时会自动置为启用
      state: {
        type: STRING(10),
        defaultValue: '启用'
      },
      introduction: {
        type: STRING,
        allowNull: true
      },
      created_at: DATE,
      updated_at: DATE,
  })

  Movie.associate = function() {
    app.model.Movie.belongsTo(app.model.Admin, {foreignKey: 'admin_id' , targetKey: 'admin_id'})
  }

  return Movie;
}