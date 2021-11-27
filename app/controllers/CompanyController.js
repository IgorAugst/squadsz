const { employees } = require('../mocks/Employees');
const { squads } = require('../mocks/Squads');
const { projects } = require('../mocks/Projects');
const Company = require('../models/Company');

class CompanyController {
  static login(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/empresa');
    }
    return res.render('company/login');
  }

  static register(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/empresa');
    }
    return res.render('company/register');
  }

  static dashboard(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }
    return res.render('company/dashboard', {
      ...Company.getCompanyProps(req, res),
    });
  }

  static squads(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const renderSquads = squads.map((squad) => {
      const lenEmployees = employees.filter(
        ({ id_squad: idSquad }) => idSquad === Number(squad.id),
      ).length;
      const lenProjects = projects.filter(
        ({ id_squad: idSquad }) => idSquad === Number(squad.id),
      ).length;
      const { name: manager } = employees.find(({ id }) => id === Number(squad.id_manager));
      return {
        ...squad,
        manager,
        lenEmployees,
        lenProjects,
      };
    });

    return res.render('company/squads', {
      squads: renderSquads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderSquadsEdit(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: squadId } = req.params;
    const squad = squads.find(({ id }) => id === Number(squadId));
    return res.render('company/squads-edit', {
      squad,
      employees,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderEmployees(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const renderEmployees = employees.map((employee) => {
      const { name: squad } = squads.find(({ id }) => id === Number(employee.id_squad));
      return {
        ...employee,
        squad,
      };
    });
    return res.render('company/employees', {
      employees: renderEmployees,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderEmployeesRegister(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    return res.render('company/employees-create', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderEmployeesEdit(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: employeeId } = req.params;
    const employee = employees.find(({ id }) => id === Number(employeeId));
    return res.render('company/employee-edit', {
      employee,
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderProjects(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const renderProjects = projects.map((project) => {
      const { name: squad } = squads.find(({ id }) => id === Number(project.id_squad));
      return {
        ...project,
        squad,
      };
    });
    return res.render('company/projects', {
      projects: renderProjects,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderProjectsRegister(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    return res.render('company/projects-create', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderProjectsEdit(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: projectId } = req.params;
    const project = projects.find(({ id }) => id === Number(projectId));
    return res.render('company/projects-edit', {
      project,
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }
}

module.exports = CompanyController;
