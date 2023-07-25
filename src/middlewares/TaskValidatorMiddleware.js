const { body } = require("express-validator");
const Task = require("../app/models/Task");
const { Op } = require("sequelize");

const rulesPost = [
  body("user_id").notEmpty().withMessage("El usuario es obligatorio").bail(),
  body("category_id")
    .notEmpty()
    .withMessage("La categoria es obligatoria")
    .bail(),
  body("title")
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .isLength({ max: 255 })
    .withMessage("El titulo tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value) => {
      const existTitle = await Task.findOne({ where: { title: value } });
      if (existTitle) throw new Error("Este titulo ya se registro");
    }),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción tiene permitido maximo 500 caracteres"),
  body("completed").notEmpty().bail().isBoolean(),
];

const rulesPut = [
  body("user_id").notEmpty().withMessage("El usuario es obligatorio").bail(),
  body("category_id")
    .notEmpty()
    .withMessage("La categoria es obligatoria")
    .bail(),
  body("title")
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .isLength({ max: 255 })
    .withMessage("El titulo tiene permitido maximo 255 caracteres")
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
      if (existTitle) throw new Error("Este titulo ya se registro");
    }),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción tiene permitido maximo 500 caracteres"),
  body("completed").notEmpty().bail().isBoolean(),
];

module.exports = { rulesPost, rulesPut };
