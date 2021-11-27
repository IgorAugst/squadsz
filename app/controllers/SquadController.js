const Company = require('../models/Company');
const Squad = require('../models/Squad');
const { employees } = require('../mocks/Employees');

class SquadController {
  static renderRegister(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    return res.render('company/squads-create', {
      employees,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async register(req, res) {
    const { name, manager } = req.body;
    const errors = await Squad.create({
      name,
      manager,
      company: req.user.id,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Squad criado com sucesso');
      res.redirect('/empresa/squads');
    }

    res.render('company/squads-create', {
      employees,
      errors,
      ...Company.getCompanyProps(req),
    });
  }
}

module.exports = SquadController;
