const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const TasksHasTag = sequelize.define(
  "TasksHasTag",
  {},
  {
    timestamps: false,
    underscored: true,
    tableName: "tasks_has_tag",
  }
);

module.exports = TasksHasTag;
