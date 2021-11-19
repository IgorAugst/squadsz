const { employees } = require('../mocks/Employees');
const { squads } = require('../mocks/Squads');

class CompanyController {
  static renderLogin(req, res) {
    return res.render('company/login');
  }

  static renderRegister(req, res) {
    return res.render('company/register');
  }

  static renderDashboard(req, res) {
    return res.render('company/dashboard');
  }

  static renderSquads(req, res) {
    return res.render('company/squads');
  }

  static renderEmployees(req, res) {
    return res.render('company/employees', {
      employees,
    });
  }

  static renderEmployeesRegister(req, res) {
    return res.render('company/employees-create', {
      squads,
    });
  }

  static renderProjects(req, res) {
    return res.render('company/projects');
  }
}

module.exports = CompanyController;
