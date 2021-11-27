const bcrypt = require('bcrypt');
const pool = require('../db/connection');

class Employee {
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
    return rows[0];
  }

  static async getAllByCompanyId(id) {
    const { rows: employees } = await pool.query('SELECT * FROM employee WHERE id_company = $1', [id]);
    return employees;
  }

  static async getAllBySquadId(id) {
    const { rows: employees } = await pool.query('SELECT * FROM employee WHERE id_squad = $1', [id]);
    return employees;
  }

  static async create({
    name,
    socialName,
    birthDate,
    email,
    gender,
    squad,
    company,
    office,
    password,
    repeatPassword,
  }) {
    const errors = [];

    if (!name || !birthDate || !email || !gender || !office || !password || !repeatPassword) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
      return errors;
    }

    if (password !== repeatPassword) {
      errors.push({ message: 'As senhas não são iguais' });
    }

    if (password.length < 6) {
      errors.push({ message: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const { rows: employees } = await pool.query('SELECT * FROM employee WHERE email = $1', [email]);

    if (employees.length > 0) {
      errors.push({ message: 'Este email já está sendo utilizado' });
    }

    if (errors.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      pool.query('INSERT INTO employee (name, social_name, birth_date, email, gender, id_squad, id_company, office, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [name, socialName, birthDate, email, gender, squad, company, office, hash], (err, res) => {
        if (err) {
          console.log(err.message);
        }
      });
    }

    return errors;
  }

  static async update({
    id,
    name,
    socialName,
    email,
    gender,
    squad,
    company,
    office,
  }) {
    const errors = [];

    if (!name || !email || !gender || !office) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
      return errors;
    }

    const { rows: employees } = await pool.query('SELECT * FROM employee WHERE email = $1 AND id != $2', [email, id]);

    if (employees.length > 0) {
      errors.push({ message: 'Esse email já está sendo utilizado' });
    }

    if (errors.length === 0) {
      pool.query('UPDATE employee SET name = $1, social_name = $2, email = $3, gender = $4, id_squad = $5, id_company = $6, office = $7 WHERE id = $8', [name, socialName, email, gender, squad, company, office, id], (err, res) => {
        if (err) {
          console.log(err.message);
        }
      });
    }

    return errors;
  }
}

module.exports = Employee;
