const { Company } = require('../models');

class CompanyController {
  static login(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/empresa');
    }
    return res.render('company/login');
  }

  static create(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/empresa');
    }
    return res.render('company/register');
  }

  static dashboard(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }
    console.log(req.user);
    return res.render('company/dashboard', {
      ...Company.getCompanyProps(req, res),
    });
  }
}

module.exports = CompanyController;
