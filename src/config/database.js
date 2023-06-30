const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_academlo_tarea_2", "postgres", "root", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

const validateConection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

//validateConection();

module.exports = sequelize;
