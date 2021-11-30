const { cnpj: cnpjValidator } = require('cpf-cnpj-validator');
const { generateHash } = require('../utils');
const pool = require('../db/connection');

class Company {
  static getCompanyProps(req, res) {
    return {
      profile: req.user,
      company: true,
    };
  }

  static async create({
    cnpj, name, email, password, confirmPassword,
  }) {
    const errors = [];

    if (!cnpj || !name || !email || !password || !confirmPassword) {
      errors.push({ message: 'Preencha todos os campos' });
      return errors;
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

    const { rows: companies } = await pool.query('SELECT * FROM company WHERE email = $1', [email]);
    const { rows: cnpjs } = await pool.query('SELECT * FROM company WHERE cnpj = $1', [cnpj]);

    if (companies.length > 0) {
      errors.push({ message: 'Este email já está sendo utilizado' });
    }

    if (cnpjs.length > 0) {
      errors.push({ message: 'Este CNPJ já está sendo utilizado' });
    }

    if (errors.length === 0) {
      const hash = generateHash(password);

      pool.query('INSERT INTO company (cnpj, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, password',
        [cnpj, name, email, hash], (err) => {
          if (err) {
            console.log(err.message);
          }
        });
    }

    return errors;
  }
}

module.exports = Company;