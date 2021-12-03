const { cnpj: cnpjValidator } = require('cpf-cnpj-validator');
const { generateHash } = require('../utils');
const { Company, CompanyORM } = require('../models');

class CompanyController {
  static login(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/empresa');
    }
    return res.render('company/login');
  }

  static createView(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/empresa');
    }
    return res.render('company/register');
  }

  static async create(req, res) {
    const {
      name, email, cnpj, password, confirm_password: confirmPassword,
    } = req.body;

    const errors = [];

    if (!cnpj || !name || !email || !password || !confirmPassword) {
      errors.push({ message: 'Preencha todos os campos' });
    }

    if (!cnpjValidator.isValid(cnpj)) {
      errors.push({ message: 'CNPJ inválido' });
    }

    if (password !== confirmPassword) {
      errors.push({ message: 'As senhas não são iguais' });
    }

    if (password.length < 6) {
      errors.push({ message: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const companyCnpj = await CompanyORM.findOne({ where: { cnpj } });

    if (companyCnpj) {
      errors.push({ message: 'CNPJ já cadastrado' });
    }

    const companyEmail = await CompanyORM.findOne({ where: { email } });

    if (companyEmail) {
      errors.push({ message: 'Email já cadastrado' });
    }

    if (errors.length === 0) {
      try {
        const hash = generateHash(password);
        await CompanyORM.create({
          name,
          email,
          cnpj,
          password: hash,
        });
        req.flash('success_msg', 'Cadastro realizado com sucesso. Por favor, faça o login');  // eslint-disable-line
        return res.redirect('/empresa/entrar');
      } catch (error) {
        req.flash('error_msg', 'Erro ao cadastrar empresa');
        return res.redirect('/empresa/cadastrar');
      }
    }
    return res.render('company/register', { errors });
  }

  static index(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/empresa/entrar');
    }
    return res.render('company/dashboard', {
      ...Company.getCompanyProps(req, res),
    });
  }

  static async update(req, res) {
    const { id: idCompany } = req.user;

    const {
      name, email, cnpj,
    } = req.body;

    const errors = [];

    if (!cnpj || !name || !email) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
    } else {
      if (!cnpjValidator.isValid(cnpj)) {
        errors.push({ message: 'CNPJ inválido' });
      }

      const companyCnpj = await CompanyORM.findOne(
        { where: { cnpj } },
      );

      const companyEmail = await CompanyORM.findOne(
        { where: { email } },
      );

      if (companyCnpj && companyCnpj.id !== idCompany) {
        errors.push({ message: 'CNPJ já cadastrado' });
      }

      if (companyEmail && companyEmail.id !== idCompany) {
        errors.push({ message: 'Email já cadastrado' });
      }

      if (errors.length === 0) {
        try {
          await CompanyORM.update(idCompany, {
            name,
            email,
            cnpj,
          });
          req.flash('success_msg', 'Dados atualizados com sucesso.');
          return res.redirect('/empresa');
        } catch (error) {
          req.flash('error_msg', 'Erro ao atualizar empresa');
          return res.redirect('/empresa');
        }
      }
    }
    console.log(errors);
    return res.render('company/dashboard', { ...Company.getCompanyProps(req, res), errors });
  }
}

module.exports = CompanyController;
