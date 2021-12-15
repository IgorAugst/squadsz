const { Sprint, Task, Stage, Squad } = require('../models');

class SprintController {
  static async index(req, res) {
    const { id: idCompany } = req.headers;

    try {
      const sprints = await Sprint.rightJoin({
        related: ['squad'],
        select: ['squad.name as squad', 'sprint.*'],
        on: ['squad.id = sprint.id_squad'],
        where: { 'sprint.id_company': idCompany },
      });
      return res.status(200).json(sprints);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao carregar as sprints' });
    }
  }

  static async create(req, res) {
    const { id: idCompany } = req.headers;
    const { goal, squad } = req.body;

    try {
      const { id_sprint: idSprint } = await Squad.findOne({
        where: { id: squad },
      });

      if (idSprint) {
        return res
          .status(400)
          .json({ message: 'Squad já possui uma sprint ativa' });
      }

      const sprint = await Sprint.create({
        goal,
        id_squad: squad,
        id_company: idCompany,
      });

      await Squad.update(squad, {
        id_sprint: sprint.id,
      });

      return res.status(201).json(sprint);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar a sprint' });
    }
  }

  static async get(req, res) {
    const { id } = req.params;

    try {
      const sprint = await Sprint.rightJoin({
        related: ['squad'],
        select: ['squad.name as squad', 'sprint.*'],
        on: ['squad.id = sprint.id_squad'],
        where: { 'sprint.id': id },
      });

      const tasks = await Task.rightJoin({
        related: ['employee'],
        select: ['employee.name as employee', 'task.*'],
        on: ['employee.id = task.id_employee'],
        where: { 'task.id_sprint': id },
      });

      const lists = await Stage.all();
      const formattedLists = lists.map(list => {
        const cards = tasks.filter(task => task.id_stage === list.id);
        return {
          ...list,
          cards,
        };
      });

      return res
        .status(200)
        .json({ sprint: sprint[0], tasks, lists: formattedLists });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao carregar a sprint' });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await Sprint.delete(id);
      return res.status(200).json({ message: 'Sprint deletada com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar a sprint' });
    }
  }
}

module.exports = SprintController;
