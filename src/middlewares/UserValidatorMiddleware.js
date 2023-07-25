const { body } = require("express-validator");
const { User } = require("../app/models");
const { Op } = require("sequelize");

const rulesPost = [
  body("username")
    .notEmpty()
    .withMessage("El usuario es obligatorio")
    .bail()
    .isLength({ max: 255 })
    .withMessage("El usuario tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value) => {
      const existUser = await User.findOne({ where: { username: value } });
      if (existUser) throw new Error("Este usuario ya se registro");
    }),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isLength({ max: 255 })
    .withMessage("La contraseña tiene permitido maximo 255 caracteres")
    .bail(),
  body("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isLength({ max: 255 })
    .bail()
    .withMessage("El correo tiene permitido maximo 255 caracteres")
    .bail()
    .isEmail()
    .withMessage("Ingrese un correo valido")
    .bail(),
];

const rulesPut = [
  body("username")
    .notEmpty()
    .withMessage("El usuario es obligatorio")
    .bail()
    .isLength({ max: 255 })
    .withMessage("El usuario tiene permitido maximo 255 caracteres")
    .bail()
    .custom(async (value, { req }) => {
      const existUser = await User.findOne({
        where: {
          username: value,
          id: {
            [Op.ne]: req.params.id,
          },
        },
      });
      if (existUser) throw new Error("Este usuario ya se registro");
    }),
  body("password")
    .optional()
    .isLength({ max: 255 })
    .withMessage("La contraseña tiene permitido maximo 255 caracteres")
    .bail(),
  body("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isLength({ max: 255 })
    .bail()
    .withMessage("El correo tiene permitido maximo 255 caracteres")
    .bail()
    .isEmail()
    .withMessage("Ingrese un correo valido")
    .bail(),
];

module.exports = { rulesPost, rulesPut };
