const { body } = require("express-validator");
const { Category } = require("../app/models");
const { Op } = require("sequelize");

const rulesPost = [
  body("name")
    .notEmpty()
    .withMessage("La categoria es obligatoria")
    .isLength({ max: 255 })
    .withMessage("La categoria tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value) => {
      const existCategory = await Category.findOne({ where: { name: value } });
      if (existCategory) throw new Error("Esta categoria ya se registro");
    }),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción tiene permitido maximo 500 caracteres")
    .bail(),
];

const rulesPut = [
  body("name")
    .notEmpty()
    .withMessage("La categoria es obligatoria")
    .isLength({ max: 255 })
    .withMessage("La categoria tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value, { req }) => {
      const existCategory = await Category.findOne({
        where: {
          name: value,
          id: {
            [Op.ne]: req.params.id,
          },
        },
      });
      if (existCategory) throw new Error("Esta categoria ya se registro");
    }),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción tiene permitido maximo 500 caracteres")
    .bail(),
];

module.exports = { rulesPost, rulesPut };
