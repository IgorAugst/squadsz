const pool = require('../db/connection');

class Squad {
  static async create({ name, manager, company }) {
    const managerId = manager !== '' ? manager : null;
    const errors = [];

    if (!name) {
      errors.push({ message: 'Insira um nome para o squad' });
    }

    if (name.length < 3) {
      errors.push({ message: 'O nome deve ter mais de 3 caracteres' });
    }

    const { rows: rowsSquads } = await pool.query('SELECT * FROM squad WHERE name = $1', [name]);

    if (rowsSquads.length > 0) {
      errors.push({ message: 'O squad já existe' });
    }

    if (errors.length === 0) {
      pool.query('INSERT INTO squad (name, id_manager_employee, id_company) VALUES ($1, $2, $3)', [name, managerId, company], (err, res) => {
        if (err) {
          errors.push({ message: 'Erro ao criar o squad. Por favor, tente novamente.' });
        }
      });
    }

    return errors;
  }
}

module.exports = Squad;
