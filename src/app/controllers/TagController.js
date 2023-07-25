const { Op, Sequelize } = require("sequelize");
const { Tag } = require("../models");

class TagController {
  async getAllTags(req, res) {
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

      const { rows, count } = await Tag.findAndCountAll({
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

      let tags = {};
      if (isPagination) {
        tags = {
          page,
          totalRegisters,
          totalPages,
          firstRegister,
          lastRegister,
          data: rows,
        };
      } else {
        tags = {
          data: rows,
        };
      }

      res.status(200).json({
        tags,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async getTagById(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw `Model not found for id ${id}`;
      }
      res.status(200).json({ tag });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async saveTag(req, res) {
    try {
      const { body } = req;
      const tag = await Tag.create(body);
      res
        .status(201)
        .json({ message: "Etiqueta registrada satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async updateTag(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;

      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw `Model not found for id ${id}`;
      }
      await tag.update(body);

      res
        .status(200)
        .json({ message: "Etiqueta modificada satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async deleteTag(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw `Model not found for id ${id}`;
      }
      await tag.destroy();

      res.status(204).json(null);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
}

module.exports = new TagController();
