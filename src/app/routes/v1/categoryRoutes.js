const { Router } = require("express");
const router = Router();
const CategoryController = require("../../controllers/CategoryController");
const handleValidationErrors = require("../../../middlewares/ValidatorErrorsMiddleware");
const {
  rulesPost,
  rulesPut,
} = require("../../../middlewares/CategoryValidatorMiddleware.js");

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.post(
  "/",
  rulesPost,
  handleValidationErrors,
  CategoryController.saveCategory
);
router.put(
  "/:id",
  rulesPut,
  handleValidationErrors,
  CategoryController.updateCategory
);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
