/*
 * @Author: xuanpl
 * @Date: 2020-06-13 12:02:19
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 12:05:37
 * @Description: file content
 * @FilePath: /bottle/app/model/building_union.js
 */
'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize

  const Building_union = app.model.define('building_union', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    building_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    union_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    created_at: DATE,
    updated_at: DATE
  })

  return Building_union
}