const { Router } = require("express");
const router = Router();

//routes
router.use("/tasks", require("./taskRoutes"));

module.exports = router;
