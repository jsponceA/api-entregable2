const { body } = require("express-validator");
const { Tag } = require("../app/models");
const { Op } = require("sequelize");

const rulesPost = [
  body("name")
    .notEmpty()
    .withMessage("La etiqueta es obligatoria")
    .isLength({ max: 255 })
    .withMessage("La etiqueta tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value) => {
      const existTag = await Tag.findOne({ where: { name: value } });
      if (existTag) throw new Error("Esta etiqueta ya se registro");
    }),
  body("bg_color")
    .notEmpty()
    .withMessage("El color es obligatorio")
    .isLength({ max: 20 })
    .withMessage("El color tiene permitido maximo 20 caracteres")
    .bail(),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción tiene permitido maximo 500 caracteres")
    .bail(),
];

const rulesPut = [
  body("name")
    .notEmpty()
    .withMessage("La etiqueta es obligatoria")
    .isLength({ max: 255 })
    .withMessage("La etiqueta tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value, { req }) => {
      const existTag = await Tag.findOne({
        where: {
          name: value,
          id: {
            [Op.ne]: req.params.id,
          },
        },
      });
      if (existTag) throw new Error("Esta etiqueta ya se registro");
    }),
  body("bg_color")
    .notEmpty()
    .withMessage("El color es obligatorio")
    .isLength({ max: 20 })
    .withMessage("El color tiene permitido maximo 20 caracteres")
    .bail(),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción tiene permitido maximo 500 caracteres")
    .bail(),
];

module.exports = { rulesPost, rulesPut };
