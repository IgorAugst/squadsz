const { Company } = require('../models');
const bcrypt = require('bcrypt')

class CompanyController {
  static login(req, res) {
    req.flash('success_msg', null);
    return res.render('company/login');
  }

  static async entrar(req, res){
    const hash = await Company.login(req.body.email);

    console.log(hash + " " + req.body.password)
    if(hash == null || req.body.password == null){
      return res.render('company/login')
    }

    const match = bcrypt.compare(req.body.password, hash);

    if(match){
      return  res.redirect('/empresa');
    }

    console.log("cu");
  }

  static create(req, res) {
    if (req.session) {
      return res.redirect('/empresa');
    }
    return res.render('company/register');
  }

  static dashboard(req, res) {
    if (req.session) {
      return res.redirect('/empresa/entrar');
    }
    return res.render('company/dashboard', {
      ...Company.getCompanyProps(req, res),
    });
  }
}

module.exports = CompanyController;
