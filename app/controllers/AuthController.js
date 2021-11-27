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

  static async registerCompany(req, res) {
    const {
      name, email, cnpj, password, repeat_password: repeatPassword,
    } = req.body;

    const { errors } = await Company.create({
      name,
      email,
      cnpj,
      password,
      repeatPassword,
    });

    if (errors.length === 0) {
      req.flash('success_msg', 'Cadastro realizado com sucesso, por favor, faça o login.');
      res.redirect('/');
    }

    res.render('company/register', { errors });
  }
}

module.exports = AuthController;
