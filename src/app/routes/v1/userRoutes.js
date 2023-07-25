const { Router } = require("express");
const router = Router();
const UserController = require("../../controllers/UserController");
const handleValidationErrors = require("../../../middlewares/ValidatorErrorsMiddleware");
const {
  rulesPost,
  rulesPut,
} = require("../../../middlewares/UserValidatorMiddleware");

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", rulesPost, handleValidationErrors, UserController.saveUser);
router.put("/:id", rulesPut, handleValidationErrors, UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
