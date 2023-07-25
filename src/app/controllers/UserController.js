const { Op, Sequelize } = require("sequelize");
const { User } = require("../models");

class UserController {
  async getAllUsers(req, res) {
    try {
      let isPagination = true;
      if (!req.query.page || !req.query.perPage) {
        isPagination = false;
      }

      const search = String(req.query.search || "")
        .toLowerCase()
        .trim();
      const page = parseInt(req.query.page || 1);
      const perPage = req.query.perPage || 10;
      const offset = (page - 1) * perPage;

      const { rows, count } = await User.findAndCountAll({
        include: ["tasks"],
        where: search && {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("username")), {
              [Op.like]: `%${search}%`,
            }),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("email")), {
              [Op.like]: `%${search}%`,
            }),
          ],
        },
        order: [["id", "DESC"]],
        limit: isPagination ? perPage : null,
        offset: isPagination ? offset : null,
      });

      const totalRegisters = count;
      const totalPages = Math.ceil(count / perPage);
      const firstRegister = (page - 1) * perPage + 1;
      const lastRegister = Math.min(page * perPage, totalRegisters);

      let users = {};

      if (isPagination) {
        users = {
          page,
          totalRegisters,
          totalPages,
          firstRegister,
          lastRegister,
          data: rows,
        };
      } else {
        users = {
          data: rows,
        };
      }

      res.status(200).json({
        users,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw `Model not found for id ${id}`;
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async saveUser(req, res) {
    try {
      const { body } = req;
      const user = await User.create(body);
      res
        .status(201)
        .json({ message: "Usuario registrado satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;

      const user = await User.findByPk(id);
      if (!user) {
        throw `Model not found for id ${id}`;
      }
      await user.update(body);

      res
        .status(200)
        .json({ message: "Usuario modificado satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw `Model not found for id ${id}`;
      }
      await user.destroy();

      res.status(204).json(null);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
}

module.exports = new UserController();
