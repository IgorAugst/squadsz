const dotenv = require('dotenv');

dotenv.config();

const POSTGRES_USER = process.env.POSTGRES_USER || '';
const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
const POSTGRES_DB = process.env.POSTGRES_DB || '';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const NODE_PORT = process.env.PORT || 3000;

module.exports = {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  NODE_PORT,
};
