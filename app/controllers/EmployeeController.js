const { generateHash } = require('../utils');
const {
  Company, Employee, Squad,
} = require('../models');

class EmployeeController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    let { id } = req.user;
    if (req.user.type !== 0) {
      id = req.user.id_company;
    }

    const squads = await Squad.findAll({ where: { id_company: id } });
    const employees = await Employee.findAll({ where: { id_company: id } });

    const employeesMap = employees.map((employee) => {
      const { name: squad } = squads.find(
        ({ id: idSquad }) => idSquad === Number(employee.id_squad),
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

    if (req.user.type !== 0) {
      return res.redirect('/empresa/funcionarios');
    }

    const { id: idCompany } = req.user;
    const { id: idEmployee } = req.params;

    const employee = await Employee.find(idEmployee);
    const squads = await Squad.findAll({ where: { id_company: idCompany } });

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

    const { id: idEmployee } = req.params;
    const { id: idCompany } = req.user;
    const {
      name, email, gender, office, social_name: socialName, squad,
    } = req.body;

    if (req.user.type === 1) {
      req.flash('error_msg', 'operação não permitida');
      return res.redirect(`/empresa/funcionarios/${idEmployee}`);
    }

    const errors = [];

    if (!name || !email || !gender || !office) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
    } else {
      const employee = await Employee.findOne({ where: { email, id_company: idCompany } });

      if (employee && employee.id !== Number(idEmployee)) {
        errors.push({ message: 'E-mail já cadastrado' });
      }

      if (errors.length === 0) {
        try {
          await Employee.update(idEmployee, {
            email,
            gender,
            id_company: idCompany,
            name,
            office,
            social_name: socialName,
            id_squad: squad === '' ? null : squad,
          });

          req.flash('success_msg', 'Funcionario editado com sucesso');
          return res.redirect(`/empresa/funcionarios/${idEmployee}`);
        } catch (error) {
          req.flash('error_msg', 'Erro ao editar funcionario');
          return res.redirect('/empresa/funcionarios/editar');
        }
      }
    }

    const squads = await Squad.findAll({ where: { id_company: idCompany } });
    const employee = await Employee.find(idEmployee);

    return res.render('company/employee-edit', {
      errors,
      employee,
      squads,
      ...Company.getCompanyProps(req),
    });
  }

  static async createView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }

    if (req.user.type !== 0) {
      return res.redirect('/empresa/funcionarios');
    }

    const squads = await Squad.findAll({ where: { id_company: req.user.id } });

    return res.render('company/employees-create', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async create(req, res) {
    const {
      name, birth_date:
      birthDate,
      squad,
      email,
      gender,
      office,
      social_name: socialName,
      password,
      confirm_password: confirmPassword,
    } = req.body;
    const { id: idCompany } = req.user;

    if (req.user.type === 1) {
      req.flash('error_msg', 'Operação não permitida');
      return res.redirect('/empresa/funcionarios/registrar');
    }

    const errors = [];

    if (!name || !birthDate || !email || !gender || !office || !password || !confirmPassword) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
    } else {
      if (password !== confirmPassword) {
        errors.push({ message: 'As senhas não são iguais' });
      }

      if (password.length < 6) {
        errors.push({ message: 'A senha deve ter no mínimo 6 caracteres' });
      }

      const employee = await Employee.findOne({ where: { email, id_company: idCompany } });

      if (employee) {
        errors.push({ message: 'E-mail já cadastrado' });
      }

      if (errors.length === 0) {
        try {
          const hash = generateHash(password);

          await Employee.create({
            name,
            birth_date: birthDate,
            id_company: idCompany,
            id_squad: squad === '' ? null : squad,
            email,
            gender,
            office,
            social_name: socialName,
            password: hash,
          });

          req.flash('success_msg', 'Funcionário criado com sucesso');
          return res.redirect('/empresa/funcionarios');
        } catch (error) {
          req.flash('error_msg', 'Erro ao criar funcionario');
          return res.redirect('/empresa/funcionarios/registrar');
        }
      }
    }

    const squads = await Squad.findAll({ where: { id_company: idCompany } });

    return res.render('company/employees-create', {
      squads,
      errors,
      ...Company.getCompanyProps(req),
    });
  }

  static async delete(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: idEmployee } = req.params;

    try {
      await Employee.delete(idEmployee);

      req.flash('success_msg', 'Funcionário deletado com sucesso');
      return res.redirect('/empresa/funcionarios');
    } catch (error) {
      req.flash('error_msg', 'Erro ao deletar funcionário');
      return res.redirect(`/empresa/funcionarios/${idEmployee}`);
    }
  }
}

module.exports = EmployeeController;
