const bcrypt = require('bcrypt');
const { cnpj: cnpjValidator } = require('cpf-cnpj-validator');
const pool = require('../db/connection');

class Company {
  static getCompanyProps(req, res) {
    return {
      profile: req.user,
      company: true,
    };
  }

  static async create({
    cnpj, name, email, password, repeatPassword,
  }) {
    const errors = [];

    if (!cnpj || !name || !email || !password || !repeatPassword) {
      errors.push({ message: 'Preencha todos os campos' });
    }

    if (!cnpjValidator.isValid(cnpj)) {
      errors.push({ message: 'CNPJ inválido' });
    }

    if (password !== repeatPassword) {
      errors.push({ message: 'As senhas não são iguais' });
    }

    if (password === undefined || password.length < 6) {
      errors.push({ message: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const { rows: rowsCompany } = await pool.query('SELECT * FROM company WHERE email = $1', [email]);
    const { rows: rowsCpnj } = await pool.query('SELECT * FROM company WHERE cnpj = $1', [cnpj]);

    if (rowsCompany.length > 0) {
      errors.push({ message: 'Este email já está sendo utilizado' });
    }

    if (rowsCpnj.length > 0) {
      errors.push({ message: 'Este CNPJ já está sendo utilizado' });
    }

    if (errors.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      pool.query('INSERT INTO company (cnpj, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, password',
        [cnpj, name, email, hash], (err) => {
          if (err) {
            console.log(err.message);
          }
        });
    }

    return { errors };
  }
}

module.exports = Company;
