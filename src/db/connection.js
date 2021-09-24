const pg = require('pg');
const config = require('./config');

const {
  database, host, password, port, user,
} = config;

const pool = new pg.Pool({
  user,
  host,
  database,
  password,
  port,
});

module.exports = pool;
