const Task = require("../models/Task");

class TaskController {
  async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll();

      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
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
      const task = new Task();
      task.title = req.body.title;
      task.description = req.body.description;
      task.completed = req.body.completed;
      await task.save();

      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) {
        throw `Model not found for id ${id}`;
      }

      task.title = req.body.title;
      task.description = req.body.description;
      task.completed = req.body.completed;
      await task.save();

      res.status(200).json({ message: "Task updated successfully", task });
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
