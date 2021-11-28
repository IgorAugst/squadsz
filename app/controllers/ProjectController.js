const { getFormattedProjectsByCompanyId } = require('../utils');
const {
  Company, Project, Squad,
} = require('../models');

class ProjectController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: idCompany } = req.user;

    const projects = await getFormattedProjectsByCompanyId(idCompany);

    return res.render('company/projects', {
      projects,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async create(req, res) {
    const {
      name,
      description,
      squad,
    } = req.body;

    const { id: idCompany } = req.user;

    const errors = [];

    if (!name || !description) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
    } else {
      const project = await Project.findOne({ where: { name, id_company: idCompany } });

      if (project) {
        errors.push({ message: 'Este projeto já existe' });
      }

      if (errors.length === 0) {
        try {
          const { id } = await Project.create({
            name,
            id_company: idCompany,
            description,
            id_squad: squad === '' ? null : squad,
          });

          req.flash('success_msg', 'Projeto criado com sucesso');
          return res.redirect(`/empresa/projetos/${id}`);
        } catch (error) {
          req.flash('error_msg', 'Erro ao criar projeto');
          return res.redirect('/empresa/projetos/registrar');
        }
      }
    }

    const squads = await Squad.findAll({ where: { id_company: idCompany } });

    return res.render('company/projects-create', {
      squads,
      errors,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async createView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: idCompany } = req.user;

    const squads = await Squad.findAll({ where: { id_company: idCompany } });

    return res.render('company/projects-create', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async update(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: projectId } = req.params;
    const { id: idCompany } = req.user;
    const {
      name, description, squad, status,
    } = req.body;

    const errors = [];

    if (!name || !description || status === '') {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
    } else {
      const project = await Project.findOne({ where: { name, id_company: idCompany } });
      if (project && project.id !== Number(projectId)) {
        errors.push({ message: 'Este projeto já existe' });
      }

      if (errors.length === 0) {
        try {
          await Project.update(projectId, {
            name,
            description,
            id_squad: squad === '' ? null : squad,
            status,
          });

          req.flash('success_msg', 'Projeto atualizado com sucesso');
          return res.redirect(`/empresa/projetos/${projectId}`);
        } catch (error) {
          req.flash('error_msg', 'Erro ao atualizar projeto');
          return res.redirect(`/empresa/projetos/${projectId}`);
        }
      }
    }

    const project = await Project.find(projectId);
    const squads = await Squad.findAll({ where: { id_company: idCompany } });

    return res.render('company/projects-edit', {
      project,
      squads,
      errors,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async updateView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: projectId } = req.params;
    const { id: idCompany } = req.user;

    const project = await Project.find(projectId);
    const squads = await Squad.findAll({ where: { id_company: idCompany } });

    return res.render('company/projects-edit', {
      project,
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }
}

module.exports = ProjectController;
