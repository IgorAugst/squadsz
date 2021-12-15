const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateHash } = require('../utils');
const { Employee, Squad } = require('../models');

class EmployeeController {
  static async index(req, res) {
    const { id: idCompany } = req.headers;

    const squads = await Squad.findAll({ where: { id_company: idCompany } });
    const employees = await Employee.findAll({ where: { id_company: idCompany } });

    const employeesMap = employees.map((employee) => {
      const { name: squad } = squads.find(
        ({ id: idSquad }) => idSquad === Number(employee.id_squad),
      ) || {};
      return {
        ...employee,
        squad,
      };
    });
    return res.status(200).json(employeesMap);
  }

  static async updateView(req, res) {
    const { id: idEmployee } = req.params;

    try {
      const employee = await Employee.find(idEmployee);
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar funcionário' });
    }
  }

  static async update(req, res) {
    const { id: idEmployee } = req.params;
    const { id: idCompany } = req.headers;
    const {
      name,
      email,
      gender,
      office,
      social_name: socialName,
      squad,
    } = req.body;

    const employee = await Employee.findOne({
      where: { email, id_company: idCompany },
    });

    if (employee && employee.id !== Number(idEmployee)) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

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

      return res.status(200).json({ message: 'Funcionário atualizado com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar funcionário' });
    }
  }

  static async create(req, res) {
    const {
      name,
      birth_date: birthDate,
      squad,
      email,
      gender,
      office,
      social_name: socialName,
      password,
    } = req.body;
    const { id: idCompany } = req.headers;

    const employee = await Employee.findOne({
      where: { email, id_company: idCompany },
    });

    if (employee) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

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

      return res.status(200).send({ message: 'Funcionário criado com sucesso' });
    } catch (error) {
      return res.status(400).send({ message: 'Erro ao criar o funcionário' });
    }
  }

  static async delete(req, res) {
    const { id: idEmployee } = req.params;

    try {
      await Employee.delete(idEmployee);
      return res.status(200).json({ message: 'Funcionário deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar funcionário' });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await Employee.findOne({ where: { email } });

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

module.exports = EmployeeController;
