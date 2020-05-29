'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Adminblacklist = app.model.define('adminblacklist', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    token: STRING(),
    created_at: DATE,
    updated_at: DATE
  })

  // Adminblacklist.associate = function() {

  // }
  return Adminblacklist
}