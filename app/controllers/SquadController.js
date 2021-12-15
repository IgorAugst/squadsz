const { Squad, Employee, Project } = require('../models');

class SquadController {
  static async index(req, res) {
    const rowsSquads = await Squad.rightJoin({
      related: ['employee'],
      select: ['employee.name as manager', 'squad.*'],
      on: ['employee.id = squad.id_manager_employee'],
      where: { 'squad.id_company': req.headers.id },
    });

    const squads = await Promise.all(
      rowsSquads.map(async squad => {
        const employees =
          (await Employee.findAll({
            select: ['COUNT(*)'],
            where: { id_squad: squad.id },
          })) || {};
        const projects =
          (await Project.findAll({
            select: ['COUNT(*)'],
            where: { id_squad: squad.id },
          })) || {};

        return {
          ...squad,
          employees: employees[0].count,
          projects: projects[0].count,
        };
      })
    );

    return res.status(200).json(squads);
  }

  static async updateView(req, res) {
    const { id: idSquad } = req.params;

    try {
      const squad = await Squad.find(idSquad);
      const employees = await Employee.findAll({
        where: { id_squad: idSquad },
      });
      const projects = await Project.findAll({ where: { id_squad: idSquad } });
      return res.status(200).json({ employees, squad, projects });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar squad' });
    }
  }

  static async update(req, res) {
    const { id: idSquad } = req.params;
    const { id: idCompany } = req.headers;
    const { name, manager } = req.body;

    const squad = await Squad.findOne({
      where: { name, id_company: idCompany },
    });

    if (squad && squad.id !== Number(idSquad)) {
      res.status(400).json({ message: 'Já existe um squad com esse nome' });
    }

    try {
      await Squad.update(idSquad, {
        name,
        id_manager_employee: manager !== '' ? manager : null,
      });

      res.status(200).json({ message: 'Squad atualizado com sucesso' });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao atualizar squad' });
    }
  }

  static async create(req, res) {
    const { id: idCompany } = req.headers;
    const { name, manager } = req.body;

    const squads = await Squad.findOne({
      where: { name, id_company: idCompany },
    });

    if (squads) {
      return res
        .status(400)
        .json({ message: 'Já existe um squad com esse nome' });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: 'O nome deve ter mais de 3 caracteres' });
    }

    try {
      const project = await Squad.create({
        name,
        id_company: idCompany,
        id_manager_employee: manager !== '' ? manager : null,
      });

      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar squad' });
    }
  }

  static async delete(req, res) {
    const { id: idSquad } = req.params;

    try {
      await Squad.delete(idSquad);
      return res.status(200).json({ message: 'Squad deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar squad' });
    }
  }
}

module.exports = SquadController;
