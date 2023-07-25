const { Op, Sequelize } = require("sequelize");
const { Task, Tag } = require("../models");

class TaskController {
  async getAllTasks(req, res) {
    try {
      const search = String(req.query.search || "")
        .toLowerCase()
        .trim();
      const page = parseInt(req.query.page || 1);
      const perPage = req.query.perPage || 10;
      const offset = (page - 1) * perPage;

      const { rows, count } = await Task.findAndCountAll({
        include: ["category", "user", "tags"],
        where: search && {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
              [Op.like]: `%${search}%`,
            }),
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("description")),
              {
                [Op.like]: `%${search}%`,
              }
            ),
          ],
        },
        order: [["id", "DESC"]],
        limit: perPage,
        offset,
      });

      const totalRegisters = rows.length;
      const totalPages = Math.ceil(count / perPage);
      const firstRegister = (page - 1) * perPage + 1;
      const lastRegister = Math.min(page * perPage, totalRegisters);

      const tasks = {
        page,
        totalRegisters,
        totalPages,
        firstRegister,
        lastRegister,
        data: rows,
      };

      res.status(200).json({
        tasks,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id, {
        include: ["tags"],
      });
      if (!task) {
        throw `Model not found for id ${id}`;
      }
      res.status(200).json({ task });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async saveTask(req, res) {
    try {
      const { body } = req;
      const task = await Task.create(body);
      const tagsIds = body.tags;
      await task.addTags(tagsIds);

      res.status(201).json({ message: "Tarea registrada satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;

      const task = await Task.findByPk(id);
      if (!task) {
        throw `Model not found for id ${id}`;
      }
      await task.update(body);
      const tagsIds = body.tags;
      const tags = await Tag.findAll({
        where: {
          id: tagsIds,
        },
      });
      await task.setTags(tags);

      res.status(200).json({ message: "Tarea modificada satisfactoriamente" });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) {
        throw `Model not found for id ${id}`;
      }
      await task.destroy();

      res.status(204).json(null);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
}

module.exports = new TaskController();
