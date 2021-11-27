const pool = require('../db/connection');

class Project {
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM project WHERE id = $1', [id]);
    return rows[0];
  }

  static async getAllByCompanyId(id) {
    const { rows: employees } = await pool.query('SELECT * FROM project WHERE id_company = $1', [id]);
    return employees;
  }

  static async create({
    name, description, squad, company,
  }) {
    const errors = [];

    if (!name || !description) {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
      return errors;
    }

    const { rows: projects } = await pool.query('SELECT * FROM project WHERE name = $1', [name]);

    if (projects.length > 0) {
      errors.push({ message: 'Este projeto já existe' });
    }

    if (errors.length === 0) {
      pool.query('INSERT INTO project (name, id_squad, id_company, description, status) VALUES ($1, $2, $3, $4, $5)', [name, squad, company, description, 'para fazer'], (err, res) => {
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
    description,
    squad,
    status,
  }) {
    const errors = [];

    if (!name || !description || status === '') {
      errors.push({ message: 'Preencha todos os campos obrigatórios' });
      return errors;
    }

    const { rows: squads } = await pool.query('SELECT * FROM project WHERE name = $1 AND id != $2', [name, id]);

    if (squads.length > 0) {
      errors.push({ message: 'Esse projeto já existe' });
    }

    if (errors.length === 0) {
      pool.query('UPDATE project SET name = $1, description = $2, id_squad = $3, status = $4 WHERE id = $5', [name, description, squad, status, id], (err, res) => {
        if (err) {
          console.log(err.message);
        }
      });
    }

    return errors;
  }
}

module.exports = Project;
