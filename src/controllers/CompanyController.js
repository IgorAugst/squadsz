const { employees } = require('../mocks/Employees');
const { squads } = require('../mocks/Squads');
const { projects } = require('../mocks/Projects');

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
    const renderSquads = squads.map((squad) => {
      const lenEmployees = employees.filter(
        ({ id_squad: idSquad }) => idSquad === Number(squad.id),
      ).length;
      const lenProjects = projects.filter(
        ({ id_squad: idSquad }) => idSquad === Number(squad.id),
      ).length;
      return {
        ...squad,
        lenEmployees,
        lenProjects,
      };
    });

    return res.render('company/squads', {
      squads: renderSquads,
    });
  }

  static renderSquadsRegister(req, res) {
    return res.render('company/squads-create', {
      employees,
    });
  }

  static renderEmployees(req, res) {
    const renderEmployees = employees.map((employee) => {
      const { name: squad } = squads.find(({ id }) => id === Number(employee.id_squad));
      return {
        ...employee,
        squad,
      };
    });
    return res.render('company/employees', {
      employees: renderEmployees,
    });
  }

  static renderEmployeesRegister(req, res) {
    return res.render('company/employees-create', {
      squads,
    });
  }

  static renderEmployeesEdit(req, res) {
    const { id: employeeId } = req.params;
    const employee = employees.find(({ id }) => id === Number(employeeId));
    return res.render('company/employee-edit', {
      employee,
      squads,
    });
  }

  static renderProjects(req, res) {
    const renderProjects = projects.map((project) => {
      const { name: squad } = squads.find(({ id }) => id === Number(project.id_squad));
      return {
        ...project,
        squad,
      };
    });
    return res.render('company/projects', {
      projects: renderProjects,
    });
  }

  static renderProjectsRegister(req, res) {
    return res.render('company/projects-create', {
      squads,
    });
  }
}

module.exports = CompanyController;
