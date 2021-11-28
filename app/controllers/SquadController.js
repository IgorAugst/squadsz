const { getFormattedSquadByCompanyId } = require('../utils');
const {
  Company, Squad, Employee,
} = require('../models');

class SquadController {
  static async index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id: idCompany } = req.user;

    const squads = await getFormattedSquadByCompanyId(idCompany);

    return res.render('company/squads', {
      squads,
      ...Company.getCompanyProps(req, res),
    });
  }

  static async updateView(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
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
}

module.exports = SquadController;
