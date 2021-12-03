const {
  Company, Squad, Employee, Project,
} = require('../models');

class SquadController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const rowsSquads = await Squad.rightJoin({
      related: ['employee'],
      select: ['employee.name as manager', 'squad.*'],
      on: ['employee.id = squad.id_manager_employee'],
    });

    const squads = await Promise.all(rowsSquads.map(async (squad) => {
      const employees = await Employee.findAll({ select: ['COUNT(*)'], where: { id_squad: squad.id } }) || {};
      const projects = await Project.findAll({ select: ['COUNT(*)'], where: { id_squad: squad.id } }) || {};

      return {
        ...squad,
        employees: employees[0].count,
        projects: projects[0].count,
      };
    }));

    return res.render('company/squads', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async updateView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    if (req.user.type !== 0) {
      return res.redirect('/empresa/squads');
    }

    const { id: idSquad } = req.params;
    const { id: idCompany } = req.user;

    const squad = await Squad.find(idSquad);
    const employees = await Employee.findAll({ where: { id_company: idCompany } });

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

    const { id: idSquad } = req.params;
    const { id: idCompany } = req.user;
    const { name, manager } = req.body;

    const errors = [];

    if (!name) {
      errors.push({ message: 'Insira um nome para o squad' });
    } else {
      if (name.length < 3) {
        errors.push({ message: 'O nome deve ter mais de 3 caracteres' });
      }

      const squad = await Squad.findOne({ where: { name, id_company: idCompany } });

      if (squad && squad.id !== Number(idSquad)) {
        errors.push({ message: 'Já existe um squad com esse nome' });
      }

      if (errors.length === 0) {
        try {
          await Squad.update(idSquad, {
            name,
            id_manager_employee: manager !== '' ? manager : null,
          });

          req.flash('success_msg', 'Squad atualizado com sucesso');
          return res.redirect(`/empresa/squads/${idSquad}`);
        } catch (error) {
          req.flash('error_msg', 'Erro ao atualizar squad');
          return res.redirect(`/empresa/squads/${idSquad}`);
        }
      }
    }

    const squad = await Squad.find(idSquad);
    const employees = await Employee.findAll({ where: { id_company: idCompany } });

    return res.render('company/squads-edit', {
      errors,
      squad,
      employees,
      ...Company.getCompanyProps(req),
    });
  }

  static async createView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    if (req.user.type !== 0) {
      return res.redirect('/empresa/squads');
    }

    const { id: idCompany } = req.user;

    const employees = await Employee.findAll({ where: { id_company: idCompany } });

    return res.render('company/squads-create', {
      employees,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async create(req, res) {
    const { id: idCompany } = req.user;
    const { name, manager } = req.body;

    const errors = [];

    if (!name) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
    } else {
      const squads = await Squad.findOne({ where: { name, id_company: idCompany } });

      if (squads) {
        errors.push({ message: 'Este squad já existe' });
      }

      if (name.length < 3) {
        errors.push({ message: 'O nome deve ter mais de 3 caracteres' });
      }

      if (errors.length === 0) {
        try {
          const project = await Squad.create({
            name,
            id_company: idCompany,
            id_manager_employee: manager !== '' ? manager : null,
          });

          req.flash('success_msg', 'Squad criado com sucesso');
          return res.redirect(`/empresa/squads/${project.id}`);
        } catch (error) {
          req.flash('error_msg', 'Erro ao criar o squad');
          return res.redirect('/empresa/squads/registrar');
        }
      }
    }

    if (errors.length === 0) {
      req.flash('success_msg', 'Squad criado com sucesso');
      res.redirect('/empresa/squads');
    }

    const employees = await Employee.findAll({ where: { id_company: idCompany } });

    return res.render('company/squads-create', {
      employees,
      errors,
      ...Company.getCompanyProps(req),
    });
  }

  static async delete(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: idSquad } = req.params;

    try {
      await Squad.delete(idSquad);

      req.flash('success_msg', 'Squad deletado com sucesso');
      return res.redirect('/empresa/squads');
    } catch (error) {
      req.flash('error_msg', 'Erro ao deletar squad');
      return res.redirect(`/empresa/squads/${idSquad}`);
    }
  }
}

module.exports = SquadController;
