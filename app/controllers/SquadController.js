const { getFormattedSquadByCompanyId } = require('../utils');
const { Company, Squad, Employee } = require('../models');

class SquadController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: companyId } = req.user;

    const squads = await getFormattedSquadByCompanyId(companyId);

    return res.render('company/squads', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async updateView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: squadId } = req.params;
    const { id: companyId } = req.user;

    const squad = await Squad.getById(squadId);
    const employees = await Employee.getAllByCompanyId(companyId);

    if (!squad) {
      req.flash('error_msg', 'Squad não encontrado');
      return res.redirect('/empresa/squads');
    }

    return res.render('company/squads-edit', {
      squad,
      employees,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async update(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: squadId } = req.params;
    const { id: companyId } = req.user;
    const { name, manager } = req.body;

    const errors = await Squad.update({
      id: squadId,
      manager,
      name,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Squad atualizado com sucesso');
      return res.redirect('/empresa/squads');
    }

    const squad = await Squad.getById(squadId);
    const employees = await Employee.getAllByCompanyId(companyId);

    return res.render('company/squads-edit', {
      errors,
      squad,
      employees,
      ...Company.getCompanyProps(req),
    });
  }

  static async registerView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: companyId } = req.user;

    const employees = await Employee.getAllByCompanyId(companyId);

    return res.render('company/squads-create', {
      employees,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async register(req, res) {
    const { id: companyId } = req.user;
    const { name, manager } = req.body;

    const errors = await Squad.create({
      name,
      manager,
      company: companyId,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Squad criado com sucesso');
      res.redirect('/empresa/squads');
    }

    const employees = await Employee.getAllByCompanyId(companyId);

    res.render('company/squads-create', {
      employees,
      errors,
      ...Company.getCompanyProps(req),
    });
  }
}

module.exports = SquadController;
