import pg from 'pg';
import config from './config.js'

const { database, host, password, port, user } = config;

const pool = new pg.Pool({
  user,
  host,
  database,
  password,
  port
})

export default pool;