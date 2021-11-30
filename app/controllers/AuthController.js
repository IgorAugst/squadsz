const passport = require('passport');
const Company = require('../models/Company');

class AuthController {
  static async loginCompany() {
    await passport.authenticate('local', {
      successRedirect: '/empresa',
      failureRedirect: '/',
      failureFlash: true,
    });
  }

  static async createCompany(req, res) {
    const {
      name, email, cnpj, password, confirm_password: confirmPassword,
    } = req.body;

    const errors = await Company.create({
      name,
      email,
      cnpj,
      password,
      confirmPassword,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Cadastro realizado com sucesso, por favor, faça o login.');
      res.redirect('/');
    }

    res.render('company/register', { errors });
  }
}

module.exports = AuthController;
