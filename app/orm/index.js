const pool = require('../db/connection');

class ORM {
  constructor(table) {
    this.table = table;
  }

  async all(select = ['*']) {
    const query = `SELECT ${select.join(', ')} FROM ${this.table}`;
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async create(obj) {
    const values = Object.values(obj);
    const fields = Object.keys(obj).join(', ');
    const indexes = Object.keys(obj)
      .map((value, index) => `$${index + 1}`)
      .join(', ');

    const query = `INSERT INTO ${this.table} (${fields}) VALUES (${indexes}) RETURNING *`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async update(id, obj) {
    const values = Object.values(obj);
    const fields = Object.keys(obj)
      .map((value, index) => `${value} = $${index + 1}`)
      .join(', ');

    const query = `UPDATE ${this.table} SET ${fields} WHERE id = $${
      values.length + 1
    } RETURNING *`;

    try {
      const { rows } = await pool.query(query, [...values, id]);
      return rows[0];
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async findOne({ select = ['*'], where }) {
    const values = Object.values(where);
    const conditions = Object.keys(where)
      .map((value, index) => `${value} = $${index + 1}`)
      .join(' AND ');

    const query = `SELECT ${select.join(', ')} FROM ${
      this.table
    } WHERE ${conditions}`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async findAll({ select = ['*'], where }) {
    const values = Object.values(where);
    const conditions = Object.keys(where)
      .map((value, index) => `${value} = $${index + 1}`)
      .join(' AND ');

    const query = `SELECT ${select.join(', ')} FROM ${
      this.table
    } WHERE ${conditions}`;

    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async find(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = $1`;

    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async delete(id) {
    const query = `DELETE FROM ${this.table} WHERE id = $1`;

    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  async rightJoin({ related = [], on = [], select = ['*'], where }) {
    const values = Object.values(where);
    const conditions = Object.keys(where)
      .map((value, index) => `${value} = $${index + 1}`)
      .join(' AND ');

    const query = `SELECT ${select.join(', ')} FROM ${related.join(
      ', '
    )} RIGHT JOIN ${this.table} ON ${on.join(' AND ')} WHERE ${conditions}`;

    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }
}

module.exports = ORM;
