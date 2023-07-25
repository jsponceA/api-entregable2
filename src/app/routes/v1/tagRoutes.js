const { Router } = require("express");
const router = Router();
const TagController = require("../../controllers/TagController");
const handleValidationErrors = require("../../../middlewares/ValidatorErrorsMiddleware");
const {
  rulesPost,
  rulesPut,
} = require("../../../middlewares/TagValidatorMiddleware");

router.get("/", TagController.getAllTags);
router.get("/:id", TagController.getTagById);
router.post("/", rulesPost, handleValidationErrors, TagController.saveTag);
router.put("/:id", rulesPut, handleValidationErrors, TagController.updateTag);
router.delete("/:id", TagController.deleteTag);

module.exports = router;
