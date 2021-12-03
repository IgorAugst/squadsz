class Company {
  static getCompanyProps(req, res) {
    return {
      profile: req.user,
      company: true,
    };
  }
}

module.exports = Company;
