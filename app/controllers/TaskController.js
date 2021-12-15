const { Task } = require('../models');

class TaskController {
  static async create(req, res) {
    try {
      const task = await Task.create(req.body);
      return res.status(201).json(task);
    } catch (err) {
      return res.status(400).json({ message: 'Erro ao criar tarefa' });
    }
  }

  static async update(req, res) {
    try {
      const task = await Task.update(req.params.id, { ...req.body });
      return res.status(200).json(task);
    } catch (err) {
      return res.status(400).json({ message: 'Erro ao atualizar tarefa' });
    }
  }

  static async delete(req, res) {
    try {
      const task = await Task.delete(req.params.id);
      return res.status(200).json(task);
    } catch (err) {
      return res.status(400).json({ message: 'Erro ao deletar tarefa' });
    }
  }
}

module.exports = TaskController;
