const bcrypt = require('bcrypt');
const pool = require('../db/connection');

class Company {
  static async insert({
    cnpj, name, email, password, repeatPassword,
  }) {
    const errors = [];

    if (!cnpj || !name || !email || !password || !repeatPassword) {
      errors.push({ message: 'Preencha todos os campos' });
    }

    if (password !== repeatPassword) {
      errors.push({ message: 'As senhas não são iguais' });
    }

    if (password === undefined || password.length < 6) {
      errors.push({ message: 'A senha deve ter no mínimo 6 caracteres' });
    }

    pool.query('SELECT * FROM company WHERE email = $1', [email], (err, result) => {
      if (result.rows.length > 0) {
        errors.push({ message: 'E-mail já cadastrado' });
      }
    });

    pool.query('SELECT * FROM company WHERE cnpj = $1', [cnpj], (err, result) => {
      if (result.rows.length > 0) {
        errors.push({ message: 'CNPJ já cadastrado' });
      }
    });

    if (errors.length === 0) {
      const hash = await bcrypt.hash(password, 10);

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
