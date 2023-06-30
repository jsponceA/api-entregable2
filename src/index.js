require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const routesV1 = require("./app/routes/v1");

/* GLOBAL VARIABLES */
const port = process.env.PORT || 3000;
const prefixRoutesV1 = "/api/v1";

/* MIDDLEWARES */
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json(
    `PRIVATE API - YOUR IP IS REGISTERED FOR FUTURE AUDITS => ${req.ip}`
  );
});
app.use(prefixRoutesV1, routesV1);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
