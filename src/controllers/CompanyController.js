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
}

module.exports = CompanyController;
