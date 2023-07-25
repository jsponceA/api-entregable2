const { Op, Sequelize } = require("sequelize");
const { Category } = require("../models");

class CategoryController {
  async getAllCategories(req, res) {
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

      const { rows, count } = await Category.findAndCountAll({
        where: search && {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
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

      let categories = {};

      if (isPagination) {
        categories = {
          page,
          totalRegisters,
          totalPages,
          firstRegister,
          lastRegister,
          data: rows,
        };
      } else {
        categories = {
          data: rows,
        };
      }

      res.status(200).json({
        categories,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        throw `Model not found for id ${id}`;
      }
      res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async saveCategory(req, res) {
    try {
      const { body } = req;
      const category = await Category.create(body);
      res
        .status(201)
        .json({ message: "Categoria registrada satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;

      const category = await Category.findByPk(id);
      if (!category) {
        throw `Model not found for id ${id}`;
      }
      await category.update(body);

      res
        .status(200)
        .json({ message: "Categoria modificada satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        throw `Model not found for id ${id}`;
      }
      await category.destroy();

      res.status(204).json(null);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
}

module.exports = new CategoryController();
