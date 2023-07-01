const { body } = require("express-validator");
const Task = require("../app/models/Task");
const { Op } = require("sequelize");

const rulesPost = [
  body("title")
    .notEmpty()
    .isLength({ max: 255 })
    .bail()
    .custom(async (value) => {
      const existTitle = await Task.findOne({ where: { title: value } });
      if (existTitle) throw new Error("Title exists");
    }),
  body("description").optional().isLength({ max: 500 }),
  body("completed").notEmpty().bail().isBoolean(),
];

const rulesPut = [
  body("title")
    .notEmpty()
    .isLength({ max: 255 })
    .bail()
    .custom(async (value, { req }) => {
      const existTitle = await Task.findOne({
        where: {
          title: value,
          id: {
            [Op.ne]: req.params.id,
          },
        },
      });
      if (existTitle) throw new Error("Title exists");
    }),
  body("description").optional().isLength({ max: 500 }),
  body("completed").notEmpty().bail().isBoolean(),
];

module.exports = { rulesPost, rulesPut };
