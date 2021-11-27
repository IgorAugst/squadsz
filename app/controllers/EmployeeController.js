const { Squad, Company, Employee } = require('../models');

class EmployeeController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id } = req.user;

    const squads = await Squad.getAllByCompanyId(id);
    const employees = await Employee.getAllByCompanyId(id);

    const employeesMap = employees.map((employee) => {
      const { name: squad } = squads.find(
        ({ id: squadId }) => squadId === Number(employee.id_squad),
      ) || {};
      return {
        ...employee,
        squad,
      };
    });
    return res.render('company/employees', {
      employees: employeesMap,
      ...Company.getCompanyProps(req, res),
    });
  }

  static renderLogin(req, res) {
    return res.render('employee/login');
  }

  static async updateView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const { id: companyId } = req.user;
    const { id: employeeId } = req.params;

    const employee = await Employee.getById(employeeId);
    const squads = await Squad.getAllByCompanyId(companyId);

    return res.render('company/employee-edit', {
      employee,
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async update(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: employeeId } = req.params;
    const { id: companyId } = req.user;
    const {
      name, email, gender, office, social_name: socialName, squad,
    } = req.body;

    const errors = await Employee.update({
      id: employeeId,
      email,
      gender,
      company: companyId,
      name,
      office,
      socialName,
      squad,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Funcionário atualizado com sucesso');
      return res.redirect('/empresa/funcionarios');
    }

    const squads = await Squad.getAllByCompanyId(companyId);
    const employee = await Employee.getById(employeeId);

    return res.render('company/employee-edit', {
      errors,
      employee,
      squads,
      ...Company.getCompanyProps(req),
    });
  }

  static async registerView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    const squads = await Squad.getAllByCompanyId(req.user.id);

    return res.render('company/employees-create', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async register(req, res) {
    const {
      name, birth_date:
      birthDate,
      squad,
      email,
      gender,
      office,
      social_name: socialName,
      password,
      repeat_password: repeatPassword,
    } = req.body;
    const { id: company } = req.user;

    const errors = await Employee.create({
      name,
      birthDate,
      company,
      squad,
      email,
      gender,
      office,
      socialName,
      password,
      repeatPassword,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Funcionário criado com sucesso');
      res.redirect('/empresa/funcionarios');
    }

    const squads = await Squad.getAllByCompanyId(req.user.id);

    res.render('company/employees-create', {
      squads,
      errors,
      ...Company.getCompanyProps(req),
    });
  }
}

module.exports = EmployeeController;
