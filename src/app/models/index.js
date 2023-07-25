const User = require("./User");
const Task = require("./Task");
const Category = require("./Category");
const Tag = require("./Tag");
const TaskHasTag = require("./TasksHasTag");

User.hasMany(Task, { foreignKey: "user_id", as: "tasks" });
Task.belongsTo(User, { foreignKey: "user_id", as: "user" });

Task.belongsToMany(Tag, { through: TaskHasTag, as: "tags" });
Tag.belongsToMany(Task, { through: TaskHasTag, as: "tasks" });

Category.hasMany(Task, { foreignKey: "category_id", as: "tasks" });
Task.belongsTo(Category, { foreignKey: "category_id", as: "category" });

module.exports = {
  User,
  Category,
  Task,
  Tag,
  TaskHasTag,
};
