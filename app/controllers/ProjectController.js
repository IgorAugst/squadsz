const { getFormattedProjectsByCompanyId } = require('../utils');
const { Company, Project, Squad } = require('../models');

class ProjectController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: companyId } = req.user;

    const projects = await getFormattedProjectsByCompanyId(companyId);

    return res.render('company/projects', {
      projects,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async register(req, res) {
    const {
      name,
      description,
      squad,
    } = req.body;

    const { id: companyId } = req.user;

    const errors = await Project.create({
      name,
      company: companyId,
      description,
      squad,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Projeto criado com sucesso');
      res.redirect('/empresa/projetos');
    }

    const squads = await Squad.getAllByCompanyId(companyId);

    return res.render('company/projects-create', {
      squads,
      errors,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async registerView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: companyId } = req.user;

    const squads = await Squad.getAllByCompanyId(companyId);

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
    const { id: companyId } = req.user;
    const {
      name, description, squad, status,
    } = req.body;

    const errors = await Project.update({
      id: projectId,
      name,
      description,
      squad,
      status,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Projeto atualizado com sucesso');
      return res.redirect('/empresa/projetos');
    }

    const project = await Project.getById(projectId);
    const squads = await Squad.getAllByCompanyId(companyId);

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
    const { id: companyId } = req.user;

    const project = await Project.getById(projectId);
    const squads = await Squad.getAllByCompanyId(companyId);

    return res.render('company/projects-edit', {
      project,
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }
}

module.exports = ProjectController;
