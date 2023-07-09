const { Router } = require("express");
const router = Router();
const TaskController = require("../../controllers/TaskController");
const handleValidationErrors = require("../../../middlewares/ValidatorErrorsMiddleware");
const {
  rulesPost,
  rulesPut,
} = require("../../../middlewares/TaskValidatorMiddleware");

router.get("/", TaskController.getAllTasks);
router.get("/:id", TaskController.getTaskById);
router.post("/", rulesPost, handleValidationErrors, TaskController.saveTask);
router.put("/:id", rulesPut, handleValidationErrors, TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
