const pool = require('../db/connection');

class Squad {
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM squad WHERE id = $1', [id]);
    return rows[0];
  }

  static async getAllByCompanyId(id) {
    const { rows: squads } = await pool.query('SELECT * FROM squad WHERE id_company = $1', [id]);
    return squads;
  }

  static async create({ name, manager, company }) {
    const managerId = manager !== '' ? manager : null;
    const errors = [];

    if (!name) {
      errors.push({ message: 'Insira um nome para o squad' });
    }

    if (name.length < 3) {
      errors.push({ message: 'O nome deve ter mais de 3 caracteres' });
    }

    const { rows: squads } = await pool.query('SELECT * FROM squad WHERE name = $1', [name]);

    if (squads.length > 0) {
      errors.push({ message: 'O squad já existe' });
    }

    if (errors.length === 0) {
      pool.query('INSERT INTO squad (name, id_manager_employee, id_company) VALUES ($1, $2, $3)', [name, managerId, company], (err, res) => {
        console.log('');
        if (err) {
          errors.push({ message: 'Erro ao criar o squad. Por favor, tente novamente.' });
        }
      });
    }

    return errors;
  }

  static async update({ id, name, manager }) {
    const managerId = manager !== '' ? manager : null;
    const errors = [];

    if (!name) {
      errors.push({ message: 'Insira um nome para o squad' });
      return errors;
    }

    if (name.length < 3) {
      errors.push({ message: 'O nome deve ter mais de 3 caracteres' });
    }

    const { rows: squads } = await pool.query('SELECT * FROM squad WHERE name = $1 AND id != $2', [name, id]);

    if (squads.length > 0) {
      errors.push({ message: 'O squad com esse nome já existe' });
    }

    if (errors.length === 0) {
      pool.query('UPDATE squad SET name = $1, id_manager_employee = $2 WHERE id = $3', [name, managerId, id], (err, res) => {
        if (err) {
          console.log(err.message);
        }
      });
    }

    return errors;
  }
}

module.exports = Squad;
