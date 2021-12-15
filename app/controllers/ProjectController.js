const { Project } = require('../models');

class ProjectController {
  static async index(req, res) {
    const projects = await Project.rightJoin({
      related: ['squad'],
      select: ['squad.name as squad', 'project.*'],
      on: ['squad.id = project.id_squad'],
      where: { 'project.id_company': req.headers.id },
    });

    return res.status(200).json(projects);
  }

  static async create(req, res) {
    const { name, description, squad } = req.body;

    const { id: idCompany } = req.headers;

    const project = await Project.findOne({
      where: { name, id_company: idCompany },
    });

    if (project) {
      return res.status(400).json({ message: 'Este projeto já existe' });
    }

    try {
      await Project.create({
        id_company: idCompany,
        id_squad: squad === '' ? null : squad,
        name,
        description,
        status: 'para fazer',
      });

      return res.status(200).json({ message: 'Projeto criado com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar projeto' });
    }
  }

  static async update(req, res) {
    const { id: idProject } = req.params;
    const { id: idCompany } = req.headers;
    const { name, description, squad, status } = req.body;

    const project = await Project.findOne({
      where: { name, id_company: idCompany },
    });
    if (project && project.id !== Number(idProject)) {
      return res.status(400).json({ message: 'Este projeto já existe' });
    }

    try {
      await Project.update(idProject, {
        name,
        description,
        id_squad: squad === '' ? null : squad,
        status,
      });

      return res
        .status(200)
        .json({ message: 'Projeto atualizado com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar projeto' });
    }
  }

  static async updateView(req, res) {
    const { id: idProject } = req.params;

    try {
      const project = await Project.find(idProject);
      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao carregar projeto' });
    }
  }

  static async delete(req, res) {
    const { id: idProject } = req.params;

    try {
      await Project.delete(idProject);
      return res.status(200).json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar projeto' });
    }
  }
}

module.exports = ProjectController;
