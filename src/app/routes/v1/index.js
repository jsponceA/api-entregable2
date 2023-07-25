const { Router } = require("express");
const router = Router();

//routes

router.use("/tags", require("./tagRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/tasks", require("./taskRoutes"));

module.exports = router;
