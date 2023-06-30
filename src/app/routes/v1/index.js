const express = require("express");
const router = express.Router();

//routes
const taskRoutes = require("./taskRoutes");

router.use("/tasks", taskRoutes);

module.exports = router;
