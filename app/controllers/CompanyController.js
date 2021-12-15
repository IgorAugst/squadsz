const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateHash } = require('../utils');
const { Company } = require('../models');

class CompanyController {
  static async create(req, res) {
    const { name, email, cnpj, password } = req.body;

    const companyCnpj = await Company.findOne({ where: { cnpj } });
    const companyEmail = await Company.findOne({ where: { email } });

    if (companyCnpj) {
      return res.status(400).json({ message: 'CNPJ já cadastrado' });
    }

    if (companyEmail) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    try {
      const company = await Company.create({
        name,
        email,
        cnpj,
        password: generateHash(password),
      });
      return res.json(company);
    } catch (error) {
      return res.json({ message: 'Erro ao cadastrar empresa' });
    }
  }

  static async update(req, res) {
    const { id: idCompany } = req.headers;

    const { name, email, cnpj } = req.body;

    const companyCnpj = await Company.findOne({ where: { cnpj } });
    const companyEmail = await Company.findOne({ where: { email } });

    if (companyCnpj && companyCnpj.id !== Number(idCompany)) {
      return res.status(400).json({ message: 'CNPJ já cadastrado' });
    }

    if (companyEmail && companyEmail.id !== Number(idCompany)) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    try {
      await Company.update(idCompany, {
        name,
        email,
        cnpj,
      });
      return res
        .status(200)
        .json({ message: 'Empresa atualizada com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar empresa' });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await Company.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ message: 'Usuário e/ou senha incorretos' });
    }

    const isMatch = compareSync(password, user.password);

    if (isMatch) {
      const { password: userPassword, ...rest } = user;
      const userInfo = { ...rest };

      return res.status(200).json({
        message: 'Autenticado com sucesso',
        user,
        token: jwt.sign(userInfo, 'secret'),
      });
    }

    return res.status(403).json({ message: 'Usuário e/ou senha incorretos' });
  }
}

module.exports = CompanyController;
